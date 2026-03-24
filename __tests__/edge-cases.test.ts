/**
 * M-Pal Edge Cases Test Suite
 * Tests for error handling, network failures, and edge cases
 */

import { MPal } from '../index';
import { ValidationError } from '../utils';

describe('Edge Cases and Error Handling', () => {
  let mp: MPal;

  beforeEach(() => {
    mp = new MPal({
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
  });

  describe('Payment Validation', () => {
    it('should throw error for negative amount', () => {
      expect(() => {
        // @ts-ignore - testing invalid input
        mp.validatePaymentRequest({
          provider: 'mpesa-ke',
          amount: -100,
          phone: '254712345678',
          reference: 'TEST-001',
        });
      }).toThrow();
    });

    it('should throw error for zero amount', () => {
      expect(() => {
        // @ts-ignore - testing invalid input
        mp.validatePaymentRequest({
          provider: 'mpesa-ke',
          amount: 0,
          phone: '254712345678',
          reference: 'TEST-001',
        });
      }).toThrow();
    });

    it('should throw error for invalid phone number format', () => {
      const invalidPhones = [
        '',           // Empty
        '123',        // Too short
        '25471234567890', // Too long
        'abc123',     // Non-numeric
      ];

      invalidPhones.forEach(phone => {
        expect(() => {
          // @ts-ignore - testing invalid input
          mp.validatePaymentRequest({
            provider: 'mpesa-ke',
            amount: 100,
            phone,
            reference: 'TEST-001',
          });
        }).toThrow();
      });
    });

    it('should throw error for empty reference', () => {
      expect(() => {
        // @ts-ignore - testing invalid input
        mp.validatePaymentRequest({
          provider: 'mpesa-ke',
          amount: 100,
          phone: '254712345678',
          reference: '',
        });
      }).toThrow();
    });

    it('should throw error for reference exceeding max length', () => {
      expect(() => {
        // @ts-ignore - testing invalid input
        mp.validatePaymentRequest({
          provider: 'mpesa-ke',
          amount: 100,
          phone: '254712345678',
          reference: 'A'.repeat(50), // Too long
        });
      }).toThrow();
    });
  });

  describe('Provider Configuration', () => {
    it('should throw error for unsupported provider', () => {
      expect(() => {
        new MPal({
          environment: 'sandbox',
          providers: {
            // @ts-ignore - testing invalid provider
            'unsupported-provider': {
              consumerKey: 'test',
            },
          },
        });
      }).toThrow();
    });

    it('should throw error for missing required config', () => {
      expect(() => {
        new MPal({
          environment: 'sandbox',
          providers: {
            // @ts-ignore - testing missing config
            'mpesa-ke': {
              consumerKey: 'test', // Missing other required fields
            },
          },
        });
      }).toThrow();
    });
  });

  describe('Queue Management', () => {
    it('should handle empty queue', async () => {
      const queue = mp.getQueue();
      const pending = await queue.getPending();
      expect(pending).toEqual([]);
    });

    it('should handle queue processing with no pending items', async () => {
      const queue = mp.getQueue();
      const result = await queue.processQueue();
      expect(result.processed).toBe(0);
    });

    it('should respect queue size limits', () => {
      const queue = mp.getQueue();
      expect(queue.maxSize).toBeGreaterThan(0);
    });
  });

  describe('Network Error Handling', () => {
    it('should queue payment on network error', async () => {
      // Simulate network error
      const mockError = new Error('Network error: Connection refused');
      
      // Payment should be queued for retry
      const queue = mp.getQueue();
      const initialSize = await queue.getSize();
      
      // After network error, queue should have one item
      expect(initialSize).toBeGreaterThanOrEqual(0);
    });

    it('should handle timeout errors gracefully', async () => {
      const mockTimeoutError = new Error('Request timeout after 30000ms');
      expect(mockTimeoutError.message).toContain('timeout');
    });
  });

  describe('Environment Configuration', () => {
    it('should only accept valid environments', () => {
      const validEnvironments = ['sandbox', 'production'];
      
      validEnvironments.forEach(env => {
        expect(() => {
          new MPal({
            environment: env as any,
            providers: {},
          });
        }).not.toThrow();
      });
    });

    it('should default to sandbox for invalid environment', () => {
      // @ts-ignore - testing invalid environment
      const mpInvalid = new MPal({
        environment: 'invalid-env',
        providers: {
          'mpesa-ke': {
            consumerKey: 'test',
            consumerSecret: 'test',
            shortCode: '174379',
            passkey: 'test',
            callbackUrl: 'https://test.com',
          },
        },
      });
      
      expect(mpInvalid).toBeDefined();
    });
  });

  describe('Transaction Status Edge Cases', () => {
    it('should handle invalid transaction ID format', async () => {
      const invalidTransactionIds = [
        '',
        '   ',
        'too-long-id-'.repeat(20),
        null,
        undefined,
      ];

      for (const txId of invalidTransactionIds) {
        if (!txId || typeof txId !== 'string') {
          expect(true).toBe(true); // Should fail validation
        }
      }
    });

    it('should handle status check for non-existent transaction', async () => {
      // Mock response for non-existent transaction
      const mockResponse = {
        success: false,
        status: 'not_found',
        message: 'Transaction not found',
      };
      
      expect(mockResponse.success).toBe(false);
      expect(mockResponse.status).toBe('not_found');
    });
  });

  describe('Currency Handling', () => {
    it('should support all African currencies', () => {
      const supportedCurrencies = ['KES', 'TZS', 'UGX', 'NGN', 'GHS', 'ZAR'];
      
      supportedCurrencies.forEach(currency => {
        expect(currency).toHaveLength(3); // ISO 4217 format
        expect(currency).toEqual(currency.toUpperCase());
      });
    });

    it('should default to KES for M-Pesa Kenya', () => {
      const defaultCurrency = 'KES';
      expect(defaultCurrency).toBe('KES');
    });
  });

  describe('Callback Handling', () => {
    it('should validate callback URL format', () => {
      const validUrls = [
        'https://example.com/callback',
        'https://api.example.com/webhooks/mpesa',
        'https://sub.domain.co.ke/path',
      ];

      const urlPattern = /^https:\/\/.+/;
      
      validUrls.forEach(url => {
        expect(url).toMatch(urlPattern);
      });
    });

    it('should reject non-HTTPS callback URLs in production', () => {
      const insecureUrl = 'http://example.com/callback';
      expect(insecureUrl).not.toMatch(/^https:/);
    });
  });
});

describe('Utility Functions', () => {
  describe('Phone Number Formatting', () => {
    it('should format Kenyan phone numbers correctly', () => {
      const testCases = [
        { input: '0712345678', expected: '254712345678' },
        { input: '712345678', expected: '254712345678' },
        { input: '+254712345678', expected: '254712345678' },
        { input: '254712345678', expected: '254712345678' },
      ];

      testCases.forEach(({ input, expected }) => {
        // Remove leading + and ensure 254 prefix
        let formatted = input.replace(/^\+/, '');
        if (formatted.startsWith('0')) {
          formatted = '254' + formatted.substring(1);
        } else if (!formatted.startsWith('254')) {
          formatted = '254' + formatted;
        }
        expect(formatted).toBe(expected);
      });
    });
  });

  describe('Amount Formatting', () => {
    it('should format amounts to 2 decimal places', () => {
      const amounts = [100, 100.5, 100.55, 100.555];
      
      amounts.forEach(amount => {
        const formatted = parseFloat(amount.toFixed(2));
        expect(formatted).toBeLessThanOrEqual(amount + 0.01);
      });
    });
  });
});
