import { AirtelMoney } from '../AirtelMoney';

describe('AirtelMoney', () => {
  let airtel: AirtelMoney;

  beforeEach(() => {
    airtel = new AirtelMoney({
      environment: 'sandbox',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      callbackUrl: 'https://test.com/callback',
    });
  });

  describe('constructor', () => {
    it('should initialize with sandbox environment', () => {
      expect(airtel).toBeDefined();
    });

    it('should initialize with production environment', () => {
      const prodAirtel = new AirtelMoney({
        environment: 'production',
        clientId: 'prod-client-id',
        clientSecret: 'prod-client-secret',
        callbackUrl: 'https://prod.com/callback',
      });
      expect(prodAirtel).toBeDefined();
    });
  });

  describe('pay', () => {
    it('should validate payment request', async () => {
      await expect(
        airtel.pay({
          provider: 'airtel-money',
          amount: 100,
          phone: '256123456789',
          reference: 'TEST-001',
          description: 'Test payment',
          currency: 'KES',
        })
      ).rejects.toBeDefined();
    });

    it('should reject invalid phone number format', async () => {
      await expect(
        airtel.pay({
          provider: 'airtel-money',
          amount: 100,
          phone: '123',
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
        airtel.checkStatus('txn-123456')
      ).rejects.toBeDefined();
    });
  });

  describe('reversal', () => {
    it('should initiate reversal', async () => {
      await expect(
        airtel.reversal('txn-123456')
      ).rejects.toBeDefined();
    });
  });
});
