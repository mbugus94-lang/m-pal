# AfriPay SDK

**One SDK to rule all African mobile money.**

[![Made in Kenya](https://img.shields.io/badge/Made%20in%20Kenya-%F0%9F%87%B0%F0%9F%87%AA-00A651)](https://github.com/yourusername/afripay-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/afripay-sdk.svg)](https://www.npmjs.com/package/afripay-sdk)

A **unified, production-ready SDK** for African mobile money payments. Integrate M-Pesa (Kenya, Tanzania, Uganda), MTN MoMo, Airtel Money, and more with a single, clean API.

## Features

✅ **M-Pesa Kenya** - Full STK Push, status checks, and reversals  
✅ **MTN MoMo** - RequestToPay and transaction queries  
✅ **Airtel Money** - Payment requests and refunds  
✅ **Offline Queuing** - Survives network failures and app restarts  
✅ **Auto Token Refresh** - Handles OAuth tokens seamlessly  
✅ **Type-Safe** - 100% TypeScript with Zod validation  
✅ **Zero Dependencies** - Only axios, zod, and p-queue  
✅ **Extensible** - Add new providers in 5 lines  

## Quick Start

### Installation

```bash
npm install afripay-sdk
# or
yarn add afripay-sdk
```

### Basic Usage

```typescript
import { AfriPay } from 'afripay-sdk';

const afripay = new AfriPay({
  environment: 'sandbox',
  providers: {
    'mpesa-ke': {
      consumerKey: process.env.MPESA_KE_CONSUMER_KEY!,
      consumerSecret: process.env.MPESA_KE_CONSUMER_SECRET!,
      shortCode: process.env.MPESA_KE_SHORTCODE!,
      passkey: process.env.MPESA_KE_PASSKEY!,
      callbackUrl: process.env.MPESA_KE_CALLBACK_URL!,
    },
  },
});

// Initiate a payment
const result = await afripay.pay({
  provider: 'mpesa-ke',
  amount: 150,
  phone: '+254712345678',
  reference: 'INV-001',
  description: 'Product purchase',
});

console.log(result);
// {
//   success: true,
//   transactionId: 'ws_CO_191220191020363925',
//   status: 'pending',
//   providerReference: '29115-34620561-1',
//   message: 'Success. Request accepted for processing'
// }
```

### Check Payment Status

```typescript
const status = await afripay.checkStatus(
  'ws_CO_191220191020363925',
  'mpesa-ke'
);

console.log(status);
// { success: true, status: 'success', ... }
```

### Reverse a Payment

```typescript
const reversal = await afripay.reversal(
  'ws_CO_191220191020363925',
  'mpesa-ke'
);

console.log(reversal);
// { success: true, status: 'pending', message: 'Reversal request submitted' }
```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# M-Pesa Kenya (Required for M-Pesa)
MPESA_KE_CONSUMER_KEY=your_consumer_key
MPESA_KE_CONSUMER_SECRET=your_consumer_secret
MPESA_KE_SHORTCODE=174379
MPESA_KE_PASSKEY=your_passkey
MPESA_KE_CALLBACK_URL=https://yourdomain.com/webhook/mpesa

# MTN MoMo (Optional)
MTN_MOMO_API_KEY=your_api_key
MTN_MOMO_SUBSCRIPTION_KEY=your_subscription_key
MTN_MOMO_CALLBACK_URL=https://yourdomain.com/webhook/mtn-momo

# Airtel Money (Optional)
AIRTEL_MONEY_CLIENT_ID=your_client_id
AIRTEL_MONEY_CLIENT_SECRET=your_client_secret
AIRTEL_MONEY_CALLBACK_URL=https://yourdomain.com/webhook/airtel-money
```

### Getting Credentials

#### M-Pesa Kenya
1. Visit [Safaricom Daraja](https://developer.safaricom.co.ke/)
2. Create an app and get Consumer Key & Secret
3. Get your Shortcode and Passkey from your M-Pesa account

#### MTN MoMo
1. Visit [MTN MoMo Developer Portal](https://momodeveloper.mtn.com/)
2. Create an app and get API keys
3. Subscribe to the Collection API

#### Airtel Money
1. Visit [Airtel Africa Developer Portal](https://developer.airtel.africa/)
2. Create an app and get Client ID & Secret

## API Reference

### `new AfriPay(config)`

Initialize the SDK with provider configurations.

```typescript
const afripay = new AfriPay({
  environment: 'sandbox' | 'production',
  providers: {
    'mpesa-ke': { ... },
    'mtn-momo': { ... },
    'airtel-money': { ... },
  },
});
```

### `afripay.pay(request)`

Initiate a payment request.

```typescript
interface PaymentRequest {
  provider: 'mpesa-ke' | 'mtn-momo' | 'airtel-money';
  amount: number;
  phone: string;
  reference: string;
  description?: string;
  currency?: string;
}

const result = await afripay.pay({
  provider: 'mpesa-ke',
  amount: 100,
  phone: '+254712345678',
  reference: 'ORD-123',
  description: 'Order payment',
});
```

**Returns:**
```typescript
interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'pending' | 'success' | 'failed';
  providerReference?: string;
  message?: string;
  raw?: any;
}
```

### `afripay.checkStatus(transactionId, provider)`

Check the status of a payment.

```typescript
const status = await afripay.checkStatus(
  'ws_CO_191220191020363925',
  'mpesa-ke'
);
```

### `afripay.reversal(transactionId, provider)`

Reverse a completed payment.

```typescript
const reversal = await afripay.reversal(
  'ws_CO_191220191020363925',
  'mpesa-ke'
);
```

### `afripay.getQueue()`

Access the offline queue for debugging.

```typescript
const queue = afripay.getQueue();
const pending = queue.getPending();
console.log(`${pending.length} payments pending`);
```

## Offline Queuing

The SDK automatically queues failed payments and retries them when the network recovers.

```typescript
try {
  await afripay.pay({
    provider: 'mpesa-ke',
    amount: 100,
    phone: '+254712345678',
    reference: 'ORD-123',
  });
} catch (error) {
  // Payment queued for retry
  console.log('Payment queued. Will retry when online.');
}

// Later, when network is available:
const queue = afripay.getQueue();
console.log(`${queue.getPendingCount()} payments waiting`);
```

## Error Handling

All methods throw errors with descriptive messages:

```typescript
try {
  await afripay.pay({
    provider: 'mpesa-ke',
    amount: 100,
    phone: 'invalid-phone',
    reference: 'ORD-123',
  });
} catch (error) {
  console.error(error.message);
  // "M-Pesa STK Push failed: ..."
}
```

## Webhook Handling

When a payment completes, M-Pesa sends a callback to your `callbackUrl`. Example webhook handler:

```typescript
import express from 'express';

const app = express();

app.post('/webhook/mpesa', express.json(), (req, res) => {
  const { Body } = req.body;
  const { stkCallback } = Body;

  if (stkCallback.ResultCode === 0) {
    console.log('✅ Payment successful!');
    const metadata = stkCallback.CallbackMetadata.Item;
    const amount = metadata.find((item: any) => item.Name === 'Amount')?.Value;
    const receipt = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
    
    // Update your database
  } else {
    console.log('❌ Payment failed:', stkCallback.ResultDesc);
  }

  res.json({ ResultCode: 0, ResultDesc: 'Received' });
});

app.listen(3000);
```

## Testing

Run the test suite:

```bash
npm run test
```

Run the example:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
  ├── index.ts              # Main SDK entry point
  ├── types.ts              # TypeScript interfaces
  ├── utils.ts              # Utility functions
  ├── core/
  │   └── queue.ts          # Offline queuing
  ├── providers/
  │   ├── base.ts           # Base provider class
  │   ├── MpesaKE.ts        # M-Pesa Kenya
  │   ├── MTNMoMo.ts        # MTN MoMo
  │   └── AirtelMoney.ts    # Airtel Money
  └── examples/
      └── stk-push.ts       # Example usage
```

## Contributing

Contributions are welcome! To add a new provider:

1. Create a new file in `src/providers/YourProvider.ts`
2. Extend `BaseProvider`
3. Implement `pay()`, `checkStatus()`, and `reversal()`
4. Add tests in `src/__tests__/`
5. Update this README

```typescript
import { BaseProvider } from './base';
import { PaymentRequest, PaymentResponse } from '../types';

export class YourProvider extends BaseProvider {
  async pay(request: PaymentRequest): Promise<PaymentResponse> {
    // Implementation
  }

  async checkStatus(transactionId: string): Promise<PaymentResponse> {
    // Implementation
  }

  async reversal(transactionId: string): Promise<PaymentResponse> {
    // Implementation
  }
}
```

## Roadmap

- [ ] M-Pesa Tanzania & Uganda
- [ ] Flutterwave integration
- [ ] Stripe integration
- [ ] Webhook signature verification
- [ ] Rate limiting & backoff strategies
- [ ] React hooks for frontend integration
- [ ] GraphQL API wrapper

## License

MIT © 2026 Made in Nairobi 🇰🇪

## Support

- 📖 [Documentation](https://github.com/yourusername/afripay-sdk)
- 🐛 [Issues](https://github.com/yourusername/afripay-sdk/issues)
- 💬 [Discussions](https://github.com/yourusername/afripay-sdk/discussions)

---

**Made for African developers by African developers.** ⭐ Star us on GitHub | 🤝 Contribute | 🚀 Build the future.
