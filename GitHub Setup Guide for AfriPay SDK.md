# GitHub Setup Guide for AfriPay SDK

This guide walks you through publishing the AfriPay SDK to GitHub and npm.

## Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `afripay-sdk`
3. Description: "The missing unified SDK for African mobile money"
4. Choose **Public** (recommended for open source)
5. Do NOT initialize with README (we already have one)
6. Click **Create repository**

## Step 2: Initialize Git and Push

```bash
cd /home/ubuntu/afripay-sdk

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: AfriPay SDK v0.2.0"

# Add remote repository
git remote add origin https://github.com/yourusername/afripay-sdk.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Update Repository URLs

Replace `yourusername` in these files with your actual GitHub username:

- `package.json` - Update `repository`, `homepage`, and `bugs` fields
- `README.md` - Update GitHub links
- `CONTRIBUTING.md` - Update GitHub links

## Step 4: Publish to npm

1. Create an npm account at [npmjs.com](https://www.npmjs.com)
2. Login to npm:
   ```bash
   npm login
   ```
3. Verify package name is available:
   ```bash
   npm search afripay-sdk
   ```
4. Publish:
   ```bash
   npm publish
   ```

Your package will be available at `https://www.npmjs.com/package/afripay-sdk`

## Step 5: Add GitHub Topics

On your GitHub repository page, add these topics:
- `africa`
- `mobile-money`
- `mpesa`
- `fintech`
- `sdk`
- `kenya`
- `payments`

## Step 6: Enable GitHub Features

### Discussions
1. Go to Settings → Features
2. Enable **Discussions**

### Wiki
1. Go to Settings → Features
2. Enable **Wiki** (optional)

### Releases
1. Go to Releases
2. Create release for v0.2.0
3. Add release notes from CHANGELOG.md

## Step 7: Add GitHub Actions (Optional)

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - run: npm run lint
```

## Step 8: Add Badges to README

Update README.md with these badges:

```markdown
[![npm version](https://img.shields.io/npm/v/afripay-sdk.svg)](https://www.npmjs.com/package/afripay-sdk)
[![npm downloads](https://img.shields.io/npm/dm/afripay-sdk.svg)](https://www.npmjs.com/package/afripay-sdk)
[![GitHub license](https://img.shields.io/github/license/yourusername/afripay-sdk)](https://github.com/yourusername/afripay-sdk/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/afripay-sdk)](https://github.com/yourusername/afripay-sdk/issues)
```

## Troubleshooting

### "Package already exists"
The package name `afripay-sdk` might be taken. Try:
- `@yourusername/afripay-sdk` (scoped package)
- `afripay-sdk-v2`
- `african-pay-sdk`

### Authentication Failed
```bash
npm logout
npm login
npm publish
```

### Build Errors Before Publish
```bash
npm run build
npm run lint
npm run test
```

## Next Steps

1. Add more providers (M-Pesa TZ/UG, Flutterwave, Stripe)
2. Create React hooks wrapper
3. Add webhook signature verification
4. Build web dashboard for transactions
5. Create video tutorials

## Support

- 📖 [npm Package](https://www.npmjs.com/package/afripay-sdk)
- 🐛 [GitHub Issues](https://github.com/yourusername/afripay-sdk/issues)
- 💬 [GitHub Discussions](https://github.com/yourusername/afripay-sdk/discussions)

---

**Made in Nairobi 🇰🇪 | Open Source for Africa**
