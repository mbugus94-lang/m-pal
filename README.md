# M-Pal - African Mobile Money SDK

<p align="center">
  <strong>🚀 One SDK for all African Mobile Money</strong>
</p>

---

## ✨ Features

- **M-Pesa Kenya** - STK Push, B2C, C2B
- **MTN MoMo** - RequestToPay, Collections
- **Airtel Money** - Payments, Refunds
- **Offline Queue** - Survives network failures
- **TypeScript** - 100% type-safe

---

## 📦 Install

```bash
npm install m-pal
```

---

## 💻 Quick Start

```javascript
import { MPal } from 'm-pal';

const mp = new MPal({
  provider: 'mpesa-ke',
  apiKey: 'your-api-key',
  environment: 'sandbox'
});

// Make payment
const result = await mp.pay({
  amount: 100,
  phone: '254712345678',
  reference: 'ORDER-001'
});

console.log(result);
```

---

## 📚 Supported Providers

| Provider | Countries |
|---------|-----------|
| M-Pesa | Kenya, Tanzania, Uganda |
| MTN MoMo | Ghana, Uganda, Nigeria, Cameroon |
| Airtel Money | Kenya, Tanzania, Uganda, Nigeria |

---

## 🔧 Build

```bash
npm install
npm run build
```

---

## 📄 License

MIT

---

 align="center"><pMade with ❤️ in Africa</p>