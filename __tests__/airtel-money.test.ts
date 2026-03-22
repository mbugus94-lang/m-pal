import { AirtelMoney } from '../AirtelMoney';
import { AirtelMoneyConfig } from '../types';

describe('Airtel Money Provider', () => {
  const mockConfig: AirtelMoneyConfig = {
    clientId: 'test_client',
    clientSecret: 'test_secret',
    environment: 'sandbox'
  };

  test('should initialize with config', () => {
    const airtel = new AirtelMoney(mockConfig);
    expect(airtel).toBeDefined();
  });

  test('should get correct base URL for sandbox', () => {
    const airtel = new AirtelMoney(mockConfig);
    const url = airtel['getBaseUrl']();
    expect(url).toContain('sandbox');
  });

  test('should get correct base URL for production', () => {
    const prodConfig = { ...mockConfig, environment: 'production' as const };
    const airtel = new AirtelMoney(prodConfig);
    const url = airtel['getBaseUrl']();
    expect(url).not.toContain('sandbox');
  });

  test('should format transaction reference', () => {
    const airtel = new AirtelMoney(mockConfig);
    const ref = airtel['generateReference']();
    expect(ref).toBeDefined();
    expect(typeof ref).toBe('string');
  });
});
