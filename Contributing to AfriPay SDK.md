# Contributing to AfriPay SDK

We welcome contributions from developers across Africa and beyond! This guide will help you get started.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/afripay-sdk.git
   cd afripay-sdk
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Building

```bash
npm run build
```

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Running Examples

```bash
npm run dev
```

## Adding a New Provider

To add support for a new mobile money provider:

1. **Create a new provider file** in `src/providers/YourProvider.ts`:

```typescript
import { BaseProvider } from './base';
import { PaymentRequest, PaymentResponse } from '../types';

export class YourProvider extends BaseProvider {
  async pay(request: PaymentRequest): Promise<PaymentResponse> {
    // Implement payment logic
  }

  async checkStatus(transactionId: string): Promise<PaymentResponse> {
    // Implement status check logic
  }

  async reversal(transactionId: string): Promise<PaymentResponse> {
    // Implement reversal logic
  }
}
```

2. **Export the provider** from `src/index.ts`:

```typescript
export { YourProvider };
```

3. **Add tests** in `src/__tests__/YourProvider.test.ts`

4. **Update README.md** with provider details and configuration

5. **Submit a pull request** with a clear description

## Code Style

- Use **TypeScript** for all code
- Follow **ESLint** rules (run `npm run lint`)
- Use **meaningful variable names**
- Add **JSDoc comments** for public APIs
- Keep functions **small and focused**

## Commit Messages

Use clear, descriptive commit messages:

```
feat: Add Flutterwave provider support
fix: Handle M-Pesa token expiration correctly
docs: Update installation instructions
test: Add tests for offline queue
```

## Pull Request Process

1. **Ensure all tests pass**: `npm run test`
2. **Build successfully**: `npm run build`
3. **Update documentation** if needed
4. **Add tests** for new features
5. **Keep commits clean** and logical
6. **Write a clear PR description** explaining your changes

## Reporting Issues

Found a bug? Please report it on [GitHub Issues](https://github.com/yourusername/afripay-sdk/issues) with:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs **actual behavior**
- **Environment** (Node version, OS, etc.)
- **Error messages** or logs

## Feature Requests

Have an idea? Open a [GitHub Discussion](https://github.com/yourusername/afripay-sdk/discussions) or create an issue with the `enhancement` label.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- 📖 Check the [README](./README.md)
- 💬 Start a [Discussion](https://github.com/yourusername/afripay-sdk/discussions)
- 📧 Email us

---

**Thank you for contributing to AfriPay SDK!** 🙏 Together, we're building the future of African fintech.
