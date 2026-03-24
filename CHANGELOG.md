# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-03-24

### Added
- Comprehensive test suite with Jest (20+ test cases)
- Phone number validation for all supported countries
- Transaction status checking tests
- Provider configuration validation

### Changed
- Updated axios to ^1.13.6 for latest security patches
- Updated zod to ^4.3.6 for improved validation
- Updated p-queue to ^9.1.0
- Enhanced error messages for network failures

### Security
- Added input validation using Zod schemas
- Masked sensitive credentials in error logs
- Added request timeout configuration (30s default)

## [1.0.0] - 2026-03-21

### Added
- Initial release of M-Pal - African Mobile Money SDK
- M-Pesa Kenya integration (STK Push, B2C, C2B, Reversals)
- MTN MoMo integration (RequestToPay, Collections, Transactions)
- Airtel Money integration (Payments, Refunds, B2C)
- Offline queue for failed transactions with auto-retry
- 100% TypeScript support with full type definitions
- Provider-agnostic API design
- Comprehensive documentation and examples
- .env.example with all required environment variables
- MIT License

### Features
- `pay()` - Initiate payments across all providers
- `checkStatus()` - Check transaction status
- `reversal()` - Reverse transactions
- `getProviders()` - List configured providers
- `getQueue()` - Access offline queue for retry management

### Security
- Environment-based configuration (no hardcoded secrets)
- Request signing for M-Pesa Daraja API
- Token-based authentication for MTN MoMo
- API key authentication for Airtel Money
