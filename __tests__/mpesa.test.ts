import { MpesaKE } from '../MpesaKE';
import { MPesaConfig } from '../types';

describe('M-Pesa Provider', () => {
  const mockConfig: MPesaConfig = {
    consumerKey: 'test_key',
    consumerSecret: 'test_secret',
    passkey: 'test_passkey',
    shortCode: '174379',
    environment: 'sandbox'
  };

  test('should initialize with config', () => {
    const mpesa = new MpesaKE(mockConfig);
    expect(mpesa).toBeDefined();
  });

  test('should generate valid auth headers', () => {
    const mpesa = new MpesaKE(mockConfig);
    const headers = mpesa['getAuthHeaders']();
    expect(headers).toHaveProperty('Authorization');
    expect(headers.Authorization).toContain('Bearer');
  });

  test('should generate valid timestamp', () => {
    const mpesa = new MpesaKE(mockConfig);
    const timestamp = mpesa['generateTimestamp']();
    expect(timestamp).toMatch(/^\d{14}$/);
  });

  test('should generate password correctly', () => {
    const mpesa = new MpesaKE(mockConfig);
    const timestamp = '20240322030500';
    const password = mpesa['generatePassword'](timestamp);
    expect(password).toBeDefined();
    expect(typeof password).toBe('string');
  });

  test('should throw error for missing config', () => {
    expect(() => {
      new MpesaKE({} as MPesaConfig);
    }).toThrow();
  });
});
