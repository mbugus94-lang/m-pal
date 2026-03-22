import { MTNMoMo } from '../MTNMoMo';
import { MTNMoMoConfig } from '../types';

describe('MTN MoMo Provider', () => {
  const mockConfig: MTNMoMoConfig = {
    apiUser: 'test_user',
    apiKey: 'test_key',
    subscriptionKey: 'test_subscription',
    environment: 'sandbox'
  };

  test('should initialize with config', () => {
    const momo = new MTNMoMo(mockConfig);
    expect(momo).toBeDefined();
  });

  test('should have correct base URLs', () => {
    const momo = new MTNMoMo(mockConfig);
    const sandboxUrl = momo['getBaseUrl']();
    expect(sandboxUrl).toContain('sandbox');
  });

  test('should format phone numbers correctly', () => {
    const momo = new MTNMoMo(mockConfig);
    const formatted = momo['formatPhoneNumber']('256789123456');
    expect(formatted).toMatch(/^\d{12}$/);
  });

  test('should handle production environment', () => {
    const prodConfig = { ...mockConfig, environment: 'production' as const };
    const momo = new MTNMoMo(prodConfig);
    const prodUrl = momo['getBaseUrl']();
    expect(prodUrl).not.toContain('sandbox');
  });
});
