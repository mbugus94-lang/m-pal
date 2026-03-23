import axios from 'axios';
import { BaseProvider } from './base';
import { PaymentRequest, PaymentResponse } from './types';
import { normalizePhone, generateUUID } from './utils';

const BASE = {
  sandbox: 'https://sandbox.airtel.africa',
  production: 'https://api.airtel.africa',
};

export interface AirtelMoneyConfig {
  environment: 'sandbox' | 'production';
  clientId?: string;
  clientSecret?: string;
  apiKey?: string;
  callbackUrl: string;
}

export class AirtelMoney extends BaseProvider {
  private config: AirtelMoneyConfig;
  private accessToken: string = '';
  private tokenExpiry: number = 0;

  constructor(config: AirtelMoneyConfig) {
    super();
    this.config = config;
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.accessToken.length > 0 && this.tokenExpiry > now) {
      return this.accessToken;
    }

    const clientId = this.config.clientId || this.config.apiKey || '';
    const clientSecret = this.config.clientSecret || this.config.apiKey || '';

    try {
      const response = await axios.post(
        `${BASE[this.config.environment]}/auth/oauth2/token`,
        {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = now + (response.data.expires_in * 1000);
      return this.accessToken;
    } catch (error) {
      throw new Error(`Failed to get Airtel Money access token: ${error}`);
    }
  }

  async pay(request: PaymentRequest): Promise<PaymentResponse> {
    if (request.provider !== 'airtel-money') {
      throw new Error('Invalid provider for AirtelMoney');
    }

    const token = await this.getAccessToken();
    const phone = normalizePhone(request.phone);
    const reference = generateUUID();

    try {
      const response = await axios.post(
        `${BASE[this.config.environment]}/merchant/v1/payments/`,
        {
          reference,
          subscriber: {
            country: 'KE',
            currency: request.currency || 'KES',
            msisdn: phone,
          },
          transaction: {
            amount: Math.floor(request.amount),
            country: 'KE',
            currency: request.currency || 'KES',
            id: request.reference,
            type: 'MobileMoneyPayment',
          },
          pin: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: response.data.status === 'DP_ACCEPTED_FOR_PROCESSING',
        transactionId: reference,
        status: 'pending',
        providerReference: response.data.id,
        message: response.data.status,
        raw: response.data,
      };
    } catch (error) {
      throw new Error(`Airtel Money payment failed: ${error}`);
    }
  }

  async checkStatus(transactionId: string): Promise<PaymentResponse> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get(
        `${BASE[this.config.environment]}/merchant/v1/payments/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        success: response.data.status === 'DP_TRANSACTION_PROCESSED',
        transactionId,
        status: response.data.status === 'DP_TRANSACTION_PROCESSED' ? 'success' : 'pending',
        message: response.data.status,
        raw: response.data,
      };
    } catch (error) {
      throw new Error(`Airtel Money status check failed: ${error}`);
    }
  }

  async reversal(transactionId: string): Promise<PaymentResponse> {
    const token = await this.getAccessToken();
    const reversalId = generateUUID();

    try {
      const response = await axios.post(
        `${BASE[this.config.environment]}/merchant/v1/payments/${transactionId}/refunds`,
        {
          reference: reversalId,
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
        transactionId: reversalId,
        status: 'pending',
        message: 'Reversal request submitted',
        raw: response.data,
      };
    } catch (error) {
      throw new Error(`Airtel Money reversal failed: ${error}`);
    }
  }
}
