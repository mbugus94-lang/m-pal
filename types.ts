import { z } from 'zod';

export const PaymentRequestSchema = z.object({
  provider: z.enum(['mpesa-ke', 'mtn-momo', 'airtel-money']),
  amount: z.number().positive(),
  phone: z.string(),
  reference: z.string().min(3),
  description: z.string().optional().default('AfriPay payment'),
  currency: z.string().optional().default('KES'),
});

export type PaymentRequest = z.infer<typeof PaymentRequestSchema>;

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
