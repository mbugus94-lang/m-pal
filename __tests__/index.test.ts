import { MPal } from '../index';
import { MPesaKE } from '../MpesaKE';
import { MTNMoMo } from '../MTNMoMo';
import { AirtelMoney } from '../AirtelMoney';

describe('M-Pal SDK', () => {
  test('should export main classes', () => {
    expect(MPal).toBeDefined();
    expect(MPesaKE).toBeDefined();
    expect(MTNMoMo).toBeDefined();
    expect(AirtelMoney).toBeDefined();
  });

  test('MPal should initialize with provider', () => {
    const mpesaConfig = {
      consumerKey: 'test',
      consumerSecret: 'test',
      passkey: 'test',
      shortCode: '174379',
      environment: 'sandbox' as const
    };
    
    const mpal = new MPal({ mpesa: mpesaConfig });
    expect(mpal).toBeDefined();
    expect(mpal.mpesa).toBeDefined();
  });

  test('MPal should support multiple providers', () => {
    const mpal = new MPal({
      mpesa: {
        consumerKey: 'test',
        consumerSecret: 'test',
        passkey: 'test',
        shortCode: '174379',
        environment: 'sandbox'
      },
      mtnMomo: {
        apiUser: 'test',
        apiKey: 'test',
        subscriptionKey: 'test',
        environment: 'sandbox'
      }
    });
    
    expect(mpal.mpesa).toBeDefined();
    expect(mpal.mtnMomo).toBeDefined();
  });

  test('should get supported countries', () => {
    const countries = MPal.getSupportedCountries();
    expect(countries).toContain('KE');
    expect(countries).toContain('UG');
    expect(countries).toContain('GH');
    expect(countries).toContain('TZ');
  });

  test('should get provider for country', () => {
    expect(MPal.getProviderForCountry('KE')).toBe('mpesa');
    expect(MPal.getProviderForCountry('UG')).toBe('mtn-momo');
    expect(MPal.getProviderForCountry('GH')).toBe('mtn-momo');
  });
});
