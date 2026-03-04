# AfriPay SDK - Quick Start Guide

Get started with AfriPay SDK in 5 minutes.

## Installation

```bash
npm install afripay-sdk
```

## 1. Set Up Environment Variables

Create a `.env` file:

```env
MPESA_KE_CONSUMER_KEY=your_key_here
MPESA_KE_CONSUMER_SECRET=your_secret_here
MPESA_KE_SHORTCODE=174379
MPESA_KE_PASSKEY=your_passkey_here
MPESA_KE_CALLBACK_URL=https://yourdomain.com/webhook/mpesa
```

## 2. Initialize AfriPay

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
```

## 3. Initiate a Payment

```typescript
const result = await afripay.pay({
  provider: 'mpesa-ke',
  amount: 100,
  phone: '+254712345678',
  reference: 'ORDER-123',
  description: 'Product purchase',
});

console.log(result);
// {
//   success: true,
//   transactionId: 'ws_CO_191220191020363925',
//   status: 'pending',
//   providerReference: '29115-34620561-1'
// }
```

## 4. Check Payment Status

```typescript
const status = await afripay.checkStatus(
  'ws_CO_191220191020363925',
  'mpesa-ke'
);

if (status.success && status.status === 'success') {
  console.log('✅ Payment successful!');
} else {
  console.log('⏳ Payment pending...');
}
```

## 5. Handle Webhooks

```typescript
import express from 'express';

const app = express();

app.post('/webhook/mpesa', express.json(), (req, res) => {
  const { Body } = req.body;
  const { stkCallback } = Body;

  if (stkCallback.ResultCode === 0) {
    console.log('✅ Payment successful!');
    // Update your database
  } else {
    console.log('❌ Payment failed');
  }

  res.json({ ResultCode: 0, ResultDesc: 'Received' });
});

app.listen(3000);
```

## Common Use Cases

### Express.js Integration

```typescript
import express from 'express';
import { AfriPay } from 'afripay-sdk';

const app = express();
const afripay = new AfriPay({ /* config */ });

app.post('/api/pay', async (req, res) => {
  try {
    const result = await afripay.pay(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### React/Next.js Integration

```typescript
import { useState } from 'react';

export function PaymentButton() {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'mpesa-ke',
          amount: 100,
          phone: '+254712345678',
          reference: 'ORDER-123',
        }),
      });
      const result = await response.json();
      console.log('Payment initiated:', result);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return <button onClick={handlePay} disabled={loading}>Pay Now</button>;
}
```

## Error Handling

```typescript
try {
  const result = await afripay.pay({
    provider: 'mpesa-ke',
    amount: 100,
    phone: '+254712345678',
    reference: 'ORDER-123',
  });
} catch (error) {
  if (error.message.includes('token')) {
    console.error('Authentication failed');
  } else if (error.message.includes('network')) {
    console.error('Network error - payment queued for retry');
  } else {
    console.error('Payment error:', error.message);
  }
}
```

## Getting Help

- 📖 [Full Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/yourusername/afripay-sdk/issues)
- 💬 [Ask Questions](https://github.com/yourusername/afripay-sdk/discussions)

## Next Steps

1. Read the [full API documentation](./README.md)
2. Check out [examples](./src/examples/)
3. Join our [community discussions](https://github.com/yourusername/afripay-sdk/discussions)
4. Contribute to the [project](./CONTRIBUTING.md)

---

**Happy coding! 🚀**
