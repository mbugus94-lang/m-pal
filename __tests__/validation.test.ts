import { z } from 'zod';

// Test validation schemas used in the SDK
describe('M-Pal - Validation Tests', () => {
  describe('Payment Request Schema', () => {
    const paymentRequestSchema = z.object({
      provider: z.enum(['mpesa-ke', 'mtn-momo', 'airtel-money']),
      amount: z.number().positive(),
      phone: z.string().min(10),
      reference: z.string().min(1).max(50),
      description: z.string().max(255).optional(),
      currency: z.enum(['KES', 'UGX', 'GHS', 'TZS', 'NGN']).default('KES'),
    });

    test('should validate valid M-Pesa payment request', () => {
      const validRequest = {
        provider: 'mpesa-ke' as const,
        amount: 100,
        phone: '254712345678',
        reference: 'ORDER-001',
        description: 'Test payment',
        currency: 'KES' as const,
      };

      expect(() => paymentRequestSchema.parse(validRequest)).not.toThrow();
    });

    test('should reject invalid provider', () => {
      const invalidRequest = {
        provider: 'invalid-provider',
        amount: 100,
        phone: '254712345678',
        reference: 'ORDER-001',
      };

      expect(() => paymentRequestSchema.parse(invalidRequest)).toThrow();
    });

    test('should reject negative amount', () => {
      const invalidRequest = {
        provider: 'mpesa-ke',
        amount: -50,
        phone: '254712345678',
        reference: 'ORDER-001',
      };

      expect(() => paymentRequestSchema.parse(invalidRequest)).toThrow();
    });

    test('should reject phone number that is too short', () => {
      const invalidRequest = {
        provider: 'mpesa-ke',
        amount: 100,
        phone: '123',
        reference: 'ORDER-001',
      };

      expect(() => paymentRequestSchema.parse(invalidRequest)).toThrow();
    });

    test('should reject reference that is too long', () => {
      const invalidRequest = {
        provider: 'mpesa-ke',
        amount: 100,
        phone: '254712345678',
        reference: 'A'.repeat(51),
      };

      expect(() => paymentRequestSchema.parse(invalidRequest)).toThrow();
    });

    test('should use default currency KES', () => {
      const request = {
        provider: 'mpesa-ke',
        amount: 100,
        phone: '254712345678',
        reference: 'ORDER-001',
      };

      const result = paymentRequestSchema.parse(request);
      expect(result.currency).toBe('KES');
    });
  });

  describe('Config Schema', () => {
    const configSchema = z.object({
      environment: z.enum(['sandbox', 'production']),
      providers: z.record(z.string(), z.object({
        consumerKey: z.string().optional(),
        consumerSecret: z.string().optional(),
        apiKey: z.string().optional(),
        apiSecret: z.string().optional(),
      })),
    });

    test('should validate valid config', () => {
      const validConfig = {
        environment: 'sandbox' as const,
        providers: {
          'mpesa-ke': {
            consumerKey: 'test-key',
            consumerSecret: 'test-secret',
          },
        },
      };

      expect(() => configSchema.parse(validConfig)).not.toThrow();
    });

    test('should reject invalid environment', () => {
      const invalidConfig = {
        environment: 'staging',
        providers: {},
      };

      expect(() => configSchema.parse(invalidConfig)).toThrow();
    });
  });
});
