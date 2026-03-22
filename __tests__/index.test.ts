import { AfriPay } from '../index';
import { MpesaKE } from '../MpesaKE';
import { MTNMoMo } from '../MTNMoMo';
import { AirtelMoney } from '../AirtelMoney';

describe('AfriPay', () => {
  let afriPay: AfriPay;

  beforeEach(() => {
    afriPay = new AfriPay({
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
          apiKey: 'test-mtn-key',
          subscriptionKey: 'test-sub-key',
          callbackUrl: 'https://test.com/callback',
        },
        'airtel-money': {
          apiKey: 'test-airtel-key',
          callbackUrl: 'https://test.com/callback',
        },
      },
    });
  });

  describe('constructor', () => {
    it('should initialize with sandbox environment', () => {
      expect(afriPay).toBeDefined();
      expect(afriPay.getProviders()).toContain('mpesa-ke');
      expect(afriPay.getProviders()).toContain('mtn-momo');
      expect(afriPay.getProviders()).toContain('airtel-money');
    });

    it('should initialize with production environment', () => {
      const productionAfriPay = new AfriPay({
        environment: 'production',
        providers: {
          'mpesa-ke': {
            consumerKey: 'prod-key',
            consumerSecret: 'prod-secret',
            shortCode: '174379',
            passkey: 'prod-passkey',
            callbackUrl: 'https://prod.com/callback',
          },
        },
      });
      expect(productionAfriPay).toBeDefined();
      expect(productionAfriPay.getProviders()).toContain('mpesa-ke');
    });

    it('should initialize without optional providers', () => {
      const minimalAfriPay = new AfriPay({
        environment: 'sandbox',
        providers: {
          'mpesa-ke': {
            consumerKey: 'test-key',
            consumerSecret: 'test-secret',
            shortCode: '174379',
            passkey: 'test-passkey',
            callbackUrl: 'https://test.com/callback',
          },
        },
      });
      expect(minimalAfriPay.getProviders()).toEqual(['mpesa-ke']);
    });
  });

  describe('getProviders', () => {
    it('should return configured providers', () => {
      const providers = afriPay.getProviders();
      expect(providers).toBeInstanceOf(Array);
      expect(providers.length).toBe(3);
    });
  });

  describe('getQueue', () => {
    it('should return the offline queue', () => {
      const queue = afriPay.getQueue();
      expect(queue).toBeDefined();
    });
  });

  describe('pay', () => {
    it('should throw error for unconfigured provider', async () => {
      const invalidAfriPay = new AfriPay({
        environment: 'sandbox',
        providers: {},
      });

      await expect(
        invalidAfriPay.pay({
          provider: 'mpesa-ke',
          amount: 100,
          phone: '254712345678',
          reference: 'TEST-001',
        })
      ).rejects.toThrow('Provider mpesa-ke not configured');
    });
  });

  describe('checkStatus', () => {
    it('should throw error for unconfigured provider', async () => {
      const invalidAfriPay = new AfriPay({
        environment: 'sandbox',
        providers: {},
      });

      await expect(
        invalidAfriPay.checkStatus('txn-123', 'mpesa-ke')
      ).rejects.toThrow('Provider mpesa-ke not configured');
    });
  });

  describe('reversal', () => {
    it('should throw error for unconfigured provider', async () => {
      const invalidAfriPay = new AfriPay({
        environment: 'sandbox',
        providers: {},
      });

      await expect(
        invalidAfriPay.reversal('txn-123', 'mpesa-ke')
      ).rejects.toThrow('Provider mpesa-ke not configured');
    });
  });
});
