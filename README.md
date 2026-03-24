# M-Pal - African Mobile Money SDK

<p align="center">
  <a href="https://www.npmjs.com/package/m-pal">
    <img src="[[Image 1: unavailable (https://img.shields.io/npm/v/m-pal)]]" alt="npm version">
  </a>
  <a href="https://github.com/mbugus94-lang/m-pal/stargazers">
    <img src="[[Image 2: unavailable (https://img.shields.io/github/stars/mbugus94-lang/m-pal)]]" alt="GitHub stars">
  </a>
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/Node.js-18+-yellow?logo=node.js" alt="Node.js">
  <img src="[[Image 3: unavailable (https://img.shields.io/github/actions/workflow/status/mbugus94-lang/m-pal/ci.yml)]]" alt="CI Status">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Version-1.0.5-blue" alt="Version">
</p>

<p align="center">
  <strong>🚀 The unified SDK for African mobile money payments</strong><br>
  M-Pesa • MTN MoMo • Airtel Money — one clean API
</p>

---

## ✨ Features

- **M-Pesa Kenya** - STK Push, B2C, C2B, Reversals
- **MTN MoMo** - RequestToPay, Collections, Transactions
- **Airtel Money** - Payments, Refunds, B2C
- **Offline Queue** - Survives network failures, auto-retry
- **TypeScript** - 100% type-safe with full autocomplete
- **Zero Dependencies** - Only axios, zod, p-queue

---

## 📦 Installation

```bash
npm install m-pal
# or
yarn add m-pal
```

---

## 💻 Quick Start

```javascript
const { MPal } = require('m-pal');

const mp = new MPal({
  environment: 'sandbox',
  providers: {
    'mpesa-ke': {
      consumerKey: process.env.MPESA_CONSUMER_KEY,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET,
      shortCode: process.env.MPESA_SHORT_CODE,
      passkey: process.env.MPESA_PASSKEY,
      callbackUrl: 'https://your-app.com/mpesa-callback',
    },
  },
});

// Make a payment
async function pay() {
  try {
    const result = await mp.pay({
      provider: 'mpesa-ke',
      amount: 100,
      phone: '254712345678',
      reference: 'ORDER-001',
      description: 'Product payment',
    });
    
    console.log('Payment result:', result);
    // { success: true, transactionId: '...', status: 'pending', ... }
  } catch (error) {
    console.error('Payment failed:', error.message);
  }
}

pay();
```

---

## 🛠️ Development Setup

1. Clone the repository:
```bash
git clone https://github.com/mbugus94-lang/m-pal.git
cd m-pal
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Build the project:
```bash
npm run build
```

5. Run tests:
```bash
npm test
```

---

## 📚 API Reference

### MPal Class

```javascript
const mp = new MPal(config)
```

#### Configuration

```javascript
const config = {
  environment: 'sandbox', // or 'production'
  providers: {
    'mpesa-ke': { /* M-Pesa config */ },
    'mtn-momo': { /* MTN config */ },
    'airtel-money': { /* Airtel config */ },
  },
}
```

#### Methods

| Method | Description |
|--------|-------------|
| `mp.pay(request)` | Initiate a payment |
| `mp.checkStatus(transactionId, provider)` | Check payment status |
| `mp.reversal(transactionId, provider)` | Reverse a transaction |
| `mp.getProviders()` | Get list of configured providers |
| `mp.getQueue()` | Get offline queue |

### Payment Request

```javascript
const request = {
  provider: 'mpesa-ke',      // Provider name
  amount: 100,               // Amount
  phone: '254712345678',     // Phone number
  reference: 'ORDER-001',    // Your reference
  description: 'Payment',    // Optional description
  currency: 'KES',          // Optional currency (default: KES)
}
```

### Payment Response

```javascript
{
  success: true,              // Payment success
  transactionId: '...',       // Your transaction ID
  status: 'pending',         // pending | success | failed
  providerReference: '...',   // Provider's reference
  message: 'Success',         // Response message
  raw: { /* raw response */ }
}
```

---

## 🔍 Check Payment Status

```javascript
const status = await mp.checkStatus(
  'ws_CO_191220191020363925',  // Transaction ID
  'mpesa-ke'                     // Provider
);

console.log(status);
// { success: true, status: 'success', ... }
```

---

## ↩️ Reverse a Transaction

```javascript
const result = await mp.reversal(
  'transaction_id',
  'mpesa-ke'
);
```

---

## 🛒 Complete E-commerce Example

```javascript
const { MPal } = require('m-pal');

const mp = new MPal({
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  providers: {
    'mpesa-ke': {
      consumerKey: process.env.MPESA_KEY,
      consumerSecret: process.env.MPESA_SECRET,
      shortCode: '174379',
      passkey: process.env.MPESA_PASSKEY,
      callbackUrl: 'https://yourapp.com/webhook/mpesa',
    },
  },
});

app.post('/checkout', async (req, res) => {
  const { phone, amount, orderId } = req.body;
  
  try {
    const result = await mp.pay({
      provider: 'mpesa-ke',
      amount,
      phone,
      reference: orderId,
      description: `Order ${orderId}`,
    });
    
    res.json({ success: true, transactionId: result.transactionId });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/webhook/mpesa', (req, res) => {
  const { Body } = req.body;
  console.log('Payment callback:', Body);
  // Update order status in database
  res.json({ status: 'ok' });
});
```

---

## 🌍 Supported Providers

| Provider | Countries | Status |
|----------|-----------|--------|
| **M-Pesa** | Kenya, Tanzania, Uganda | ✅ Stable |
| **MTN MoMo** | Ghana, Uganda, Nigeria, Cameroon | ✅ Stable |
| **Airtel Money** | Kenya, Tanzania, Uganda, Nigeria | ✅ Stable |

---

## ⚙️ Environment Variables

Create a `.env` file:

```bash
# M-Pesa Kenya
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORT_CODE=174379
MPESA_PASSKEY=your_passkey

# MTN MoMo
MTN_API_KEY=your_api_key
MTN_SUBSCRIPTION_KEY=your_subscription_key

# Airtel Money
AIRTEL_API_KEY=your_api_key
```

---

## 🐛 Error Handling

```javascript
try {
  const result = await mp.pay({ /* ... */ });
} catch (error) {
  if (error.message.includes('network')) {
    // Handle network errors - payment queued for retry
    console.log('Payment queued for retry');
  } else if (error.message.includes('insufficient')) {
    // Handle insufficient funds
    console.log('Insufficient funds');
  } else {
    // Handle other errors
    console.error('Payment failed:', error.message);
  }
}
```

---

## 📤 Offline Queue

The SDK automatically queues failed payments and retries them:

```javascript
// Get queued payments
const queue = mp.getQueue();
const pending = await queue.getPending();

// Process queue manually
await queue.processQueue();
```

---

## 🔷 TypeScript Support

Full TypeScript support with autocompletion:

```typescript
import { MPal, PaymentRequest, PaymentResponse } from 'm-pal';

const mp = new MPal({ /* config */ });

const result: PaymentResponse = await mp.pay({
  provider: 'mpesa-ke',
  amount: 100,
  phone: '254712345678',
  reference: 'ORDER-001',
});
```

---

## 🔧 CI/CD

This project uses GitHub Actions for continuous integration:

- **Node.js 18.x & 20.x** testing
- **Linting** with ESLint
- **Testing** with Jest and coverage reporting
- **TypeScript** build verification
- **Code formatting** with Prettier

The workflow runs on every push and pull request to ensure code quality.

---

## 🐛 Troubleshooting

### Common Issues

**Module not found errors:**
```bash
npm run build  # Ensure the project is built
```

**TypeScript compilation errors:**
```bash
npm run lint:fix  # Fix auto-fixable issues
```

**Test failures:**
```bash
# Run tests with verbose output
npm test -- --verbose
```

**Provider API errors:**
- Verify your environment variables are correct
- Check that your callback URL is publicly accessible
- Ensure your provider credentials are for the correct environment (sandbox vs production)

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

## 👤 Author

Made with ❤️ in Africa by [David Gakere](https://github.com/mbugus94-lang)

---

## 💬 Support

- 📧 Email: mbugus94@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/mbugus94-lang/m-pal/issues)