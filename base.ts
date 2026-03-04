import { PaymentRequest, PaymentResponse } from './types';

export abstract class BaseProvider {
  abstract pay(request: PaymentRequest): Promise<PaymentResponse>;
  abstract checkStatus(transactionId: string): Promise<PaymentResponse>;
  abstract reversal(transactionId: string): Promise<PaymentResponse>;
}
