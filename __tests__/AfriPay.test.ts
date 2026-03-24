import { AfriPay, AfriPayConfig } from '../index';
import { MpesaKE, MTNMoMo, AirtelMoney } from '../index';

describe('AfriPay SDK', () => {
  let config: AfriPayConfig;

  beforeEach(() => {
    config = {
      environment: 'sandbox',
      providers: {
        'mpesa-ke': {
          consumerKey: 'test-key',
          consumerSecret: 'test-secret',
          shortCode: '174379',
          passkey: 'test-passkey',
          callbackUrl: 'https://test.com/callback',
        },
        'mtn-momo': {
          apiKey: 'test-api-key',
          subscriptionKey: 'test-sub-key',
          callbackUrl: 'https://test.com/callback',
        },
        'airtel-money': {
          apiKey: 'test-airtel-key',
          callbackUrl: 'https://test.com/callback',
        },
      },
    };
  });

  describe('Initialization', () => {
    it('should initialize with valid config', () => {
      const afriPay = new AfriPay(config);
      expect(afriPay).toBeDefined();
      expect(afriPay.getProviders()).toContain('mpesa-ke');
      expect(afriPay.getProviders()).toContain('mtn-momo');
      expect(afriPay.getProviders()).toContain('airtel-money');
    });

    it('should initialize with empty providers', () => {
      const emptyConfig: AfriPayConfig = {
        environment: 'sandbox',
        providers: {},
      };
      const afriPay = new AfriPay(emptyConfig);
      expect(afriPay.getProviders()).toEqual([]);
    });

    it('should initialize with single provider', () => {
      const singleConfig: AfriPayConfig = {
        environment: 'sandbox',
        providers: {
          'mpesa-ke': config.providers['mpesa-ke'],
        },
      };
      const afriPay = new AfriPay(singleConfig);
      expect(afriPay.getProviders()).toEqual(['mpesa-ke']);
    });
  });

  describe('Provider Management', () => {
    it('should return all configured providers', () => {
      const afriPay = new AfriPay(config);
      const providers = afriPay.getProviders();
      expect(providers).toHaveLength(3);
      expect(providers).toContain('mpesa-ke');
      expect(providers).toContain('mtn-momo');
      expect(providers).toContain('airtel-money');
    });

    it('should return empty array when no providers configured', () => {
      const emptyConfig: AfriPayConfig = {
        environment: 'sandbox',
        providers: {},
      };
      const afriPay = new AfriPay(emptyConfig);
      expect(afriPay.getProviders()).toEqual([]);
    });
  });

  describe('Queue Management', () => {
    it('should return offline queue instance', () => {
      const afriPay = new AfriPay(config);
      const queue = afriPay.getQueue();
      expect(queue).toBeDefined();
    });
  });

  describe('Payment Processing', () => {
    it('should throw error for unconfigured provider', async () => {
      const afriPay = new AfriPay(config);
      const request = {
        provider: 'unconfigured-provider' as any,
        amount: 100,
        phone: '254712345678',
        reference: 'TEST-001',
        description: 'Test payment',
      };

      await expect(afriPay.pay(request)).rejects.toThrow(
        'Provider unconfigured-provider not configured'
      );
    });
  });

  describe('Status Checking', () => {
    it('should throw error for unconfigured provider in checkStatus', async () => {
      const afriPay = new AfriPay(config);
      await expect(
        afriPay.checkStatus('txn-123', 'unconfigured-provider')
      ).rejects.toThrow('Provider unconfigured-provider not configured');
    });
  });

  describe('Reversal', () => {
    it('should throw error for unconfigured provider in reversal', async () => {
      const afriPay = new AfriPay(config);
      await expect(
        afriPay.reversal('txn-123', 'unconfigured-provider')
      ).rejects.toThrow('Provider unconfigured-provider not configured');
    });
  });
});

describe('AfriPay Providers', () => {
  describe('MpesaKE', () => {
    it('should be exported', () => {
      expect(MpesaKE).toBeDefined();
    });
  });

  describe('MTNMoMo', () => {
    it('should be exported', () => {
      expect(MTNMoMo).toBeDefined();
    });
  });

  describe('AirtelMoney', () => {
    it('should be exported', () => {
      expect(AirtelMoney).toBeDefined();
    });
  });
});
