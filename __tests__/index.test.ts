import { AfriPay } from '../index';
import { MpesaKE } from '../MpesaKE';
import { MTNMoMo } from '../MTNMoMo';
import { AirtelMoney } from '../AirtelMoney';

describe('M-Pal SDK', () => {
  test('should export main classes', () => {
    expect(AfriPay).toBeDefined();
    expect(MpesaKE).toBeDefined();
    expect(MTNMoMo).toBeDefined();
    expect(AirtelMoney).toBeDefined();
  });

  test('AfriPay should initialize with provider', () => {
    const mpesaConfig = {
      consumerKey: 'test',
      consumerSecret: 'test',
      passkey: 'test',
      shortCode: '174379',
      environment: 'sandbox' as const
    };
    
    const afriPay = new AfriPay({
      environment: 'sandbox',
      providers: {
        'mpesa-ke': mpesaConfig
      }
    });
    expect(afriPay).toBeDefined();
    expect(afriPay.getProviders()).toContain('mpesa-ke');
  });

  test('AfriPay should support multiple providers', () => {
    const afriPay = new AfriPay({
      environment: 'sandbox',
      providers: {
        'mpesa-ke': {
          consumerKey: 'test',
          consumerSecret: 'test',
          passkey: 'test',
          shortCode: '174379',
          environment: 'sandbox'
        },
        'mtn-momo': {
          apiUser: 'test',
          apiKey: 'test',
          subscriptionKey: 'test',
          environment: 'sandbox'
        }
      }
    });
    
    expect(afriPay.getProviders()).toContain('mpesa-ke');
    expect(afriPay.getProviders()).toContain('mtn-momo');
  });

  test('should get providers list', () => {
    const afriPay = new AfriPay({
      environment: 'sandbox',
      providers: {
        'mpesa-ke': {
          consumerKey: 'test',
          consumerSecret: 'test',
          passkey: 'test',
          shortCode: '174379',
          environment: 'sandbox'
        }
      }
    });
    const providers = afriPay.getProviders();
    expect(providers).toContain('mpesa-ke');
  });

  test('should get queue instance', () => {
    const afriPay = new AfriPay({
      environment: 'sandbox',
      providers: {}
    });
    const queue = afriPay.getQueue();
    expect(queue).toBeDefined();
  });
});
