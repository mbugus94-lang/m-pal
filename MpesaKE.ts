import axios from 'axios';
import { BaseProvider } from './base';
import { PaymentRequest, PaymentResponse } from './types';
import { normalizePhone, generateTimestamp, generateMpesaPassword } from './utils';

const BASE = {
  sandbox: 'https://sandbox.safaricom.co.ke',
  production: 'https://api.safaricom.co.ke',
};

interface MpesaKEConfig {
  environment: 'sandbox' | 'production';
  consumerKey: string;
  consumerSecret: string;
  shortCode: string;
  passkey: string;
  callbackUrl: string;
}

export class MpesaKE extends BaseProvider {
  private config: MpesaKEConfig;
  private accessToken: string = '';
  private tokenExpiry: number = 0;

  constructor(config: MpesaKEConfig) {
    super();
    this.config = config;
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.accessToken.length > 0 && this.tokenExpiry > now) {
      return this.accessToken;
    }

    const auth = Buffer.from(
      `${this.config.consumerKey}:${this.config.consumerSecret}`
    ).toString('base64');

    try {
      const response = await axios.get(
        `${BASE[this.config.environment]}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = now + (response.data.expires_in * 1000);
      return this.accessToken;
    } catch (error) {
      throw new Error(`Failed to get M-Pesa access token: ${error}`);
    }
  }

  async pay(request: PaymentRequest): Promise<PaymentResponse> {
    if (request.provider !== 'mpesa-ke') {
      throw new Error('Invalid provider for MpesaKE');
    }

    const token = await this.getAccessToken();
    const timestamp = generateTimestamp();
    const password = generateMpesaPassword(
      this.config.shortCode,
      this.config.passkey,
      timestamp
    );
    const phone = normalizePhone(request.phone, 'KE');

    try {
      const response = await axios.post(
        `${BASE[this.config.environment]}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.config.shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.floor(request.amount),
          PartyA: phone,
          PartyB: this.config.shortCode,
          PhoneNumber: phone,
          CallBackURL: this.config.callbackUrl,
          AccountReference: request.reference,
          TransactionDesc: request.description || 'Payment',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: response.data.ResponseCode === '0',
        transactionId: response.data.CheckoutRequestID || '',
        status: 'pending',
        providerReference: response.data.MerchantRequestID,
        message: response.data.ResponseDescription,
        raw: response.data,
      };
    } catch (error) {
      throw new Error(`M-Pesa STK Push failed: ${error}`);
    }
  }

  async checkStatus(transactionId: string): Promise<PaymentResponse> {
    const token = await this.getAccessToken();
    const timestamp = generateTimestamp();
    const password = generateMpesaPassword(
      this.config.shortCode,
      this.config.passkey,
      timestamp
    );

    try {
      const response = await axios.post(
        `${BASE[this.config.environment]}/mpesa/stkpushquery/v1/query`,
        {
          BusinessShortCode: this.config.shortCode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: transactionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const resultCode = parseInt(response.data.ResultCode);
      return {
        success: resultCode === 0,
        transactionId,
        status: resultCode === 0 ? 'success' : resultCode === 1032 ? 'pending' : 'failed',
        message: response.data.ResultDesc,
        raw: response.data,
      };
    } catch (error) {
      throw new Error(`M-Pesa status check failed: ${error}`);
    }
  }

  async reversal(transactionId: string): Promise<PaymentResponse> {
    const token = await this.getAccessToken();
    const timestamp = generateTimestamp();
    const password = generateMpesaPassword(
      this.config.shortCode,
      this.config.passkey,
      timestamp
    );

    try {
      const response = await axios.post(
        `${BASE[this.config.environment]}/mpesa/reversal/v1/request`,
        {
          Initiator: 'testapi',
          SecurityCredential: password,
          CommandID: 'TransactionReversal',
          TransactionID: transactionId,
          Amount: '1',
          ReceiverParty: this.config.shortCode,
          RecieverIdentifierType: '4',
          ResultURL: this.config.callbackUrl,
          QueueTimeOutURL: this.config.callbackUrl,
          Remarks: 'Reversal',
          Occasion: 'Reversal',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: response.status === 200,
        transactionId,
        status: 'pending',
        message: 'Reversal request submitted',
        raw: response.data,
      };
    } catch (error) {
      throw new Error(`M-Pesa reversal failed: ${error}`);
    }
  }
}
