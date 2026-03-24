import axios from 'axios';
import { BaseProvider } from './base';
import { PaymentRequest, PaymentResponse } from './types';
import { normalizePhone, generateUUID } from './utils';

const BASE = {
  sandbox: 'https://sandbox.momodeveloper.mtn.com',
  production: 'https://api.mtn.com',
};

export interface MTNMoMoConfig {
  environment: 'sandbox' | 'production';
  apiUser?: string;
  apiKey: string;
  primaryKey?: string;
  subscriptionKey: string;
  callbackUrl?: string;
}

export class MTNMoMo extends BaseProvider {
  private config: MTNMoMoConfig;

  constructor(config: MTNMoMoConfig) {
    super();
    this.config = config;
  }

  protected getBaseUrl(): string {
    return BASE[this.config.environment];
  }

  protected formatPhoneNumber(phone: string): string {
    return normalizePhone(phone);
  }

  generateUUID(): string {
    return generateUUID();
  }

  async pay(request: PaymentRequest): Promise<PaymentResponse> {
    if (request.provider !== 'mtn-momo') {
      throw new Error('Invalid provider for MTNMoMo');
    }

    const phone = normalizePhone(request.phone);
    const requestId = generateUUID();

    try {
      const response = await axios.post(
        `${BASE[this.config.environment]}/collection/v1_0/requesttopay`,
        {
          amount: Math.floor(request.amount),
          currency: request.currency || 'XOF',
          externalId: request.reference,
          payer: {
            partyIdType: 'MSISDN',
            partyId: phone,
          },
          payerMessage: request.description || 'Payment',
          payeeNote: request.reference,
        },
        {
          headers: {
            'X-Reference-Id': requestId,
            'X-Target-Environment': this.config.environment === 'sandbox' ? 'sandbox' : 'production',
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: response.status === 202,
        transactionId: requestId,
        status: 'pending',
        providerReference: requestId,
        message: 'Payment request initiated',
        raw: response.data,
      };
    } catch (error) {
      throw new Error(`MTN MoMo payment failed: ${error}`);
    }
  }

  async checkStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await axios.get(
        `${BASE[this.config.environment]}/collection/v1_0/requesttopay/${transactionId}`,
        {
          headers: {
            'X-Target-Environment': this.config.environment === 'sandbox' ? 'sandbox' : 'production',
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          },
        }
      );

      return {
        success: response.data.status === 'SUCCESSFUL',
        transactionId,
        status: response.data.status === 'SUCCESSFUL' ? 'success' : 'pending',
        message: response.data.status,
        raw: response.data,
      };
    } catch (error) {
      throw new Error(`MTN MoMo status check failed: ${error}`);
    }
  }

  async reversal(transactionId: string): Promise<PaymentResponse> {
    const reversalId = generateUUID();

    try {
      const response = await axios.post(
        `${BASE[this.config.environment]}/collection/v1_0/requesttopay/${transactionId}/refund`,
        {
          externalId: reversalId,
        },
        {
          headers: {
            'X-Reference-Id': reversalId,
            'X-Target-Environment': this.config.environment === 'sandbox' ? 'sandbox' : 'production',
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: response.status === 202,
        transactionId: reversalId,
        status: 'pending',
        message: 'Reversal request submitted',
        raw: response.data,
      };
    } catch (error) {
      throw new Error(`MTN MoMo reversal failed: ${error}`);
    }
  }
}
