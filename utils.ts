import crypto from 'crypto';

const COUNTRY_CODES: Record<string, string> = {
  KE: '254',
  UG: '256',
  GH: '233',
  TZ: '255',
  NG: '234',
  ZA: '27',
};

// Counter for ensuring unique timestamps
let timestampCounter = 0;

export function normalizePhone(phone: string, country: string = 'KE'): string {
  const countryCode = COUNTRY_CODES[country] || COUNTRY_CODES['KE'];
  let p = phone.replace(/\D/g, '');
  
  // Remove leading 0 and add country code
  if (p.startsWith('0')) {
    p = countryCode + p.slice(1);
  } else if (p.startsWith(countryCode.slice(1))) {
    // Already has country code without leading digit
    p = countryCode[0] + p;
  } else if (!p.startsWith(countryCode)) {
    // Add country code if not present
    p = countryCode + p;
  }
  
  return p;
}

export function generateTimestamp(): string {
  const now = new Date();
  const ms = now.getMilliseconds().toString().padStart(3, '0');
  const counter = (timestampCounter++ % 1000).toString().padStart(3, '0');
  return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}${ms}${counter}`;
}

export function generateMpesaPassword(shortCode: string, passkey: string, timestamp: string): string {
  const str = shortCode + passkey + timestamp;
  return Buffer.from(str).toString('base64');
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

export function validatePhoneNumber(phone: string, country: string = 'KE'): boolean {
  const normalized = normalizePhone(phone, country);
  const countryCode = COUNTRY_CODES[country] || COUNTRY_CODES['KE'];
  // Validate based on country code length (country code + 9 digits for most African countries)
  const expectedLength = countryCode.length + 9;
  return new RegExp(`^\\d{${expectedLength}}$`).test(normalized);
}

export function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    KES: 'KSh',
    UGX: 'UGX',
    GHS: 'GHS',
    NGN: '₦',
    ZAR: 'R',
    TZS: 'TZS',
    XOF: 'CFA',
  };
  const symbol = symbols[currency] || currency;
  const formatted = amount.toLocaleString('en-US');
  return `${symbol}${formatted}`;
}
