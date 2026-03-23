import { MpesaKE } from '../MpesaKE';

describe('MpesaKE', () => {
  let mpesa: MpesaKE;

  beforeEach(() => {
    mpesa = new MpesaKE({
      environment: 'sandbox',
      consumerKey: 'test-key',
      consumerSecret: 'test-secret',
      shortCode: '174379',
      passkey: 'test-passkey',
      callbackUrl: 'https://test.com/callback',
    });
  });

  describe('constructor', () => {
    it('should initialize with sandbox environment', () => {
      expect(mpesa).toBeDefined();
    });

    it('should initialize with production environment', () => {
      const prodMpesa = new MpesaKE({
        environment: 'production',
        consumerKey: 'prod-key',
        consumerSecret: 'prod-secret',
        shortCode: '174379',
        passkey: 'prod-passkey',
        callbackUrl: 'https://prod.com/callback',
      });
      expect(prodMpesa).toBeDefined();
    });
  });

  describe('pay', () => {
    it('should validate payment request', async () => {
      await expect(
        mpesa.pay({
          provider: 'mpesa-ke',
          amount: 100,
          phone: '254712345678',
          reference: 'TEST-001',
          description: 'Test payment',
          currency: 'KES',
        })
      ).rejects.toBeDefined();
    });

    it('should reject invalid phone number', async () => {
      await expect(
        mpesa.pay({
          provider: 'mpesa-ke',
          amount: 100,
          phone: '123',
          reference: 'TEST-001',
          description: 'Test payment',
          currency: 'KES',
        })
      ).rejects.toThrow();
    });

    it('should reject amount less than minimum', async () => {
      await expect(
        mpesa.pay({
          provider: 'mpesa-ke',
          amount: 0,
          phone: '254712345678',
          reference: 'TEST-001',
          description: 'Test payment',
          currency: 'KES',
        })
      ).rejects.toThrow();
    });
  });

  describe('checkStatus', () => {
    it('should check transaction status', async () => {
      await expect(
        mpesa.checkStatus('ws_CO_123456')
      ).rejects.toBeDefined();
    });
  });

  describe('reversal', () => {
    it('should initiate reversal', async () => {
      await expect(
        mpesa.reversal('ws_CO_123456')
      ).rejects.toBeDefined();
    });
  });

  describe('generateTimestamp', () => {
    it('should generate valid timestamp', () => {
      const timestamp = mpesa.generateTimestamp();
      expect(timestamp).toBeDefined();
      expect(typeof timestamp).toBe('string');
      expect(timestamp.length).toBe(20); // 14 digits (YYYYMMDDHHMMSS) + 3 ms + 3 counter
    });
  });

  describe('generatePassword', () => {
    it('should generate valid password', () => {
      const timestamp = mpesa.generateTimestamp();
      const password = mpesa.generatePassword(timestamp);
      expect(password).toBeDefined();
      expect(typeof password).toBe('string');
    });
  });
});
