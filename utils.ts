import crypto from 'crypto';

export function normalizePhone(phone: string, country: string = 'KE'): string {
  let p = phone.replace(/\D/g, '');
  if (country === 'KE') {
    if (p.startsWith('0')) p = '254' + p.slice(1);
    else if (p.startsWith('7')) p = '254' + p;
  }
  if (!p.startsWith('254')) {
    p = '254' + p;
  }
  return p;
}

export function generateTimestamp(): string {
  const now = new Date();
  return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
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
  return /^\d{12}$/.test(normalized);
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
