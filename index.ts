import { PaymentRequest, PaymentResponse, ProviderConfig } from './types';
import { MpesaKE } from './MpesaKE';
import { MTNMoMo } from './MTNMoMo';
import { AirtelMoney } from './AirtelMoney';
import { BaseProvider } from './base';
import { OfflineQueue, QueuedTask } from './queue';
import { generateUUID } from './utils';

export interface MPalConfig {
  environment: 'sandbox' | 'production';
  providers: {
    [key: string]: any;
  };
}

export class MPal {
  private config: MPalConfig;
  private providers: Map<string, BaseProvider> = new Map();
  private queue: OfflineQueue;

  constructor(config: MPalConfig) {
    this.config = config;
    this.queue = new OfflineQueue();
    this.initializeProviders();
  }

  private initializeProviders() {
    const { providers } = this.config;

    if (providers['mpesa-ke']) {
      this.providers.set('mpesa-ke', new MpesaKE({
        environment: this.config.environment,
        ...providers['mpesa-ke'],
      }));
    }

    if (providers['mtn-momo']) {
      this.providers.set('mtn-momo', new MTNMoMo({
        environment: this.config.environment,
        ...providers['mtn-momo'],
      }));
    }

    if (providers['airtel-money']) {
      this.providers.set('airtel-money', new AirtelMoney({
        environment: this.config.environment,
        ...providers['airtel-money'],
      }));
    }
  }

  async pay(request: PaymentRequest): Promise<PaymentResponse> {
    const provider = this.providers.get(request.provider);
    if (!provider) {
      throw new Error(`Provider ${request.provider} not configured`);
    }

    try {
      return await provider.pay(request);
    } catch (error) {
      // Queue the payment for retry
      const queuedTask: QueuedTask = {
        id: generateUUID(),
        timestamp: Date.now(),
        provider: request.provider,
        amount: request.amount,
        phone: request.phone,
        reference: request.reference,
        description: request.description,
        status: 'pending',
        retries: 0,
      };

      await this.queue.enqueue(
        () => provider.pay(request),
        queuedTask
      );

      throw error;
    }
  }

  async checkStatus(transactionId: string, provider: string): Promise<PaymentResponse> {
    const prov = this.providers.get(provider);
    if (!prov) {
      throw new Error(`Provider ${provider} not configured`);
    }

    return await prov.checkStatus(transactionId);
  }

  async reversal(transactionId: string, provider: string): Promise<PaymentResponse> {
    const prov = this.providers.get(provider);
    if (!prov) {
      throw new Error(`Provider ${provider} not configured`);
    }

    return await prov.reversal(transactionId);
  }

  getQueue(): OfflineQueue {
    return this.queue;
  }

  getProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

// Backward compatibility alias
export const AfriPay = MPal;
export type AfriPayConfig = MPalConfig;

export { PaymentRequest, PaymentResponse, ProviderConfig };
export { MpesaKE, MTNMoMo, AirtelMoney };
export { BaseProvider };
export { OfflineQueue };
