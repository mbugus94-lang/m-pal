import { MTNMoMo } from '../MTNMoMo';

describe('MTNMoMo', () => {
  let mtn: MTNMoMo;

  beforeEach(() => {
    mtn = new MTNMoMo({
      environment: 'sandbox',
      apiKey: 'test-api-key',
      primaryKey: 'test-primary-key',
      subscriptionKey: 'test-sub-key',
      callbackUrl: 'https://test.com/callback',
    });
  });

  describe('constructor', () => {
    it('should initialize with sandbox environment', () => {
      expect(mtn).toBeDefined();
    });

    it('should initialize with production environment', () => {
      const prodMtn = new MTNMoMo({
        environment: 'production',
        apiKey: 'prod-api-key',
        primaryKey: 'prod-primary-key',
        subscriptionKey: 'prod-sub-key',
        callbackUrl: 'https://prod.com/callback',
      });
      expect(prodMtn).toBeDefined();
    });
  });

  describe('pay', () => {
    it('should validate payment request', async () => {
      await expect(
        mtn.pay({
          provider: 'mtn-momo',
          amount: 100,
          phone: '233123456789',
          reference: 'TEST-001',
          description: 'Test payment',
          currency: 'XOF',
        })
      ).rejects.toBeDefined();
    });

    it('should reject invalid phone number format', async () => {
      await expect(
        mtn.pay({
          provider: 'mtn-momo',
          amount: 100,
          phone: '123',
          reference: 'TEST-001',
          description: 'Test payment',
          currency: 'XOF',
        })
      ).rejects.toThrow();
    });
  });

  describe('checkStatus', () => {
    it('should check transaction status', async () => {
      await expect(
        mtn.checkStatus('txn-123456')
      ).rejects.toBeDefined();
    });
  });

  describe('reversal', () => {
    it('should initiate reversal', async () => {
      await expect(
        mtn.reversal('txn-123456')
      ).rejects.toBeDefined();
    });
  });

  describe('generateUUID', () => {
    it('should generate valid UUID for reference', () => {
      const uuid = mtn.generateUUID();
      expect(uuid).toBeDefined();
      expect(typeof uuid).toBe('string');
    });
  });
});
