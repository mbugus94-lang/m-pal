import dotenv from 'dotenv';
import { AfriPay } from './index';

dotenv.config();

async function main() {
  const afripay = new AfriPay({
    environment: 'sandbox',
    providers: {
      'mpesa-ke': {
        consumerKey: process.env.MPESA_KE_CONSUMER_KEY!,
        consumerSecret: process.env.MPESA_KE_CONSUMER_SECRET!,
        shortCode: process.env.MPESA_KE_SHORTCODE || '174379',
        passkey: process.env.MPESA_KE_PASSKEY!,
        callbackUrl: process.env.MPESA_KE_CALLBACK_URL || 'https://example.com/callback',
      },
    },
  });

  try {
    console.log('🚀 Starting M-Pesa STK Push example...');
    
    const result = await afripay.pay({
      provider: 'mpesa-ke',
      amount: 150,
      phone: '+254712345678',
      reference: 'INV-001',
      description: 'Test payment',
      currency: 'KES',
    });

    console.log('✅ Payment initiated:', result);

    // Check status after a few seconds
    if (result.transactionId) {
      setTimeout(async () => {
        try {
          const status = await afripay.checkStatus(result.transactionId, 'mpesa-ke');
          console.log('📊 Payment status:', status);
        } catch (error) {
          console.error('❌ Status check error:', error);
        }
      }, 5000);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();
