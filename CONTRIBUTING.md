# Contributing to M-Pal

Thank you for your interest in contributing to M-Pal, the African Mobile Money SDK!

## 🌍 Our Mission

M-Pal aims to make mobile money integration easy for developers across Africa. We welcome contributions that help us achieve this goal.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- TypeScript knowledge
- Understanding of mobile money APIs (M-Pesa, MTN MoMo, Airtel Money)

### Setup

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/m-pal.git
   cd m-pal
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Build the project**:
   ```bash
   npm run build
   ```

## 📝 Development Guidelines

### Project Structure

```
m-pal/
├── __tests__/          # Test files
├── dist/               # Compiled JavaScript
├── *.ts                # Source TypeScript files
├── package.json
├── tsconfig.json
└── README.md
```

### Adding a New Provider

To add support for a new mobile money provider:

1. Create a new TypeScript file (e.g., `NewProvider.ts`)
2. Implement the provider class extending the base provider
3. Add tests in `__tests__/`
4. Update the README with documentation
5. Export from `index.ts`

### Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Use Zod for runtime validation

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- __tests__/index.test.ts
```

### Writing Tests

- Test both success and error cases
- Mock external API calls
- Validate TypeScript types
- Test validation schemas

## 📦 Submitting Changes

1. **Ensure tests pass**: `npm test`
2. **Ensure TypeScript compiles**: `npm run lint`
3. **Commit your changes** with clear messages
4. **Push to your fork**
5. **Open a Pull Request**

### PR Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] TypeScript compiles without errors
- [ ] Code follows style guidelines
- [ ] No breaking changes (or clearly documented)

## 🐛 Bug Reports

Please include:

- Provider name (M-Pesa, MTN MoMo, Airtel Money)
- Error message or unexpected behavior
- Code snippet showing usage
- Environment (Node version, OS)

## 🎯 Feature Requests

We especially welcome:

- New mobile money providers
- Additional countries/regions
- Better error handling
- Performance improvements
- Documentation translations

## 🏆 Recognition

Contributors will be:

- Listed in README.md
- Mentioned in release notes
- Added to our contributors page

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Made with ❤️ in Africa 🌍
