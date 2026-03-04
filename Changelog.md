# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-02-27

### Added
- **M-Pesa Kenya** - Full STK Push implementation with correct timestamp and password generation
- **MTN MoMo** - RequestToPay API integration
- **Airtel Money** - Payment request and refund support
- **Offline Queuing** - Automatic retry mechanism for failed payments
- **Auto Token Refresh** - Seamless OAuth token management
- **Type Safety** - Full TypeScript support with Zod validation
- **Error Handling** - Comprehensive error messages and recovery
- **Webhook Examples** - Sample webhook handlers for payment callbacks
- **Comprehensive Documentation** - README, examples, and API reference
- **Jest Tests** - Test configuration and examples

### Fixed
- Correct M-Pesa timestamp format (YYYYMMDDHHMMSS)
- Proper phone number normalization for Kenyan numbers
- Base64 password encoding for M-Pesa authentication
- Token expiration handling across all providers

### Improved
- Unified Provider interface for easy extensibility
- Clean API surface with minimal dependencies
- Queue persistence across app restarts
- Better error messages for debugging

## [0.1.0] - 2026-02-20

### Added
- Initial project scaffold
- Base provider architecture
- Project structure and build configuration

---

## Upcoming

### Planned for v0.3.0
- [ ] M-Pesa Tanzania & Uganda support
- [ ] Flutterwave integration
- [ ] Stripe integration
- [ ] Webhook signature verification
- [ ] Rate limiting & backoff strategies
- [ ] React hooks for frontend integration

### Planned for v0.4.0
- [ ] GraphQL API wrapper
- [ ] Real-time transaction status updates
- [ ] Multi-currency support
- [ ] Advanced reporting and analytics

---

## Migration Guides

### From v0.1 to v0.2

No breaking changes. All v0.1 code will work with v0.2.

```typescript
// v0.1 and v0.2 compatible
const afripay = new AfriPay({
  environment: 'sandbox',
  providers: {
    'mpesa-ke': { /* config */ }
  }
});
```

---

## Support

For questions or issues, please visit:
- [GitHub Issues](https://github.com/yourusername/afripay-sdk/issues)
- [GitHub Discussions](https://github.com/yourusername/afripay-sdk/discussions)
