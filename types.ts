import { z } from 'zod';

export const PaymentRequestSchema = z.object({
  provider: z.enum(['mpesa-ke', 'mtn-momo', 'airtel-money']),
  amount: z.number().positive(),
  phone: z.string(),
  reference: z.string().min(3),
  description: z.string().optional().default('AfriPay payment'),
  currency: z.string().optional().default('KES'),
});

export type PaymentRequest = {
  provider: 'mpesa-ke' | 'mtn-momo' | 'airtel-money';
  amount: number;
  phone: string;
  reference: string;
  description?: string;
  currency?: string;
};

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'pending' | 'success' | 'failed';
  providerReference?: string;
  message?: string;
  raw?: any;
}

export interface ProviderConfig {
  environment: 'sandbox' | 'production';
  [key: string]: any;
}

export interface MTNMoMoConfig {
  environment: 'sandbox' | 'production';
  apiUser?: string;
  apiKey: string;
  primaryKey?: string;
  subscriptionKey: string;
  callbackUrl?: string;
}

export interface MPesaConfig {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortCode: string;
  environment: 'sandbox' | 'production';
}

export interface AirtelMoneyConfig {
  environment: 'sandbox' | 'production';
  clientId?: string;
  clientSecret?: string;
  apiKey?: string;
  callbackUrl: string;
}
