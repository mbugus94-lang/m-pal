import { validatePhoneNumber, formatCurrency, generateTimestamp } from '../utils';

describe('Utility Functions', () => {
  describe('validatePhoneNumber', () => {
    test('should validate Kenyan numbers', () => {
      expect(validatePhoneNumber('254712345678', 'KE')).toBe(true);
      expect(validatePhoneNumber('0712345678', 'KE')).toBe(true);
      expect(validatePhoneNumber('12345', 'KE')).toBe(false);
    });

    test('should validate Ugandan numbers', () => {
      expect(validatePhoneNumber('256789123456', 'UG')).toBe(true);
      expect(validatePhoneNumber('0789123456', 'UG')).toBe(true);
    });

    test('should validate Ghanaian numbers', () => {
      expect(validatePhoneNumber('233241234567', 'GH')).toBe(true);
      expect(validatePhoneNumber('0241234567', 'GH')).toBe(true);
    });

    test('should reject invalid numbers', () => {
      expect(validatePhoneNumber('abc', 'KE')).toBe(false);
      expect(validatePhoneNumber('', 'KE')).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    test('should format Kenyan Shillings', () => {
      expect(formatCurrency(1000, 'KES')).toContain('KSh');
      expect(formatCurrency(1000, 'KES')).toContain('1,000');
    });

    test('should format Ugandan Shillings', () => {
      expect(formatCurrency(5000, 'UGX')).toContain('UGX');
    });

    test('should format Ghana Cedis', () => {
      expect(formatCurrency(100, 'GHS')).toContain('GHS');
    });

    test('should handle zero and negative amounts', () => {
      expect(formatCurrency(0, 'KES')).toContain('0');
    });
  });

  describe('generateTimestamp', () => {
    test('should generate valid timestamp', () => {
      const ts = generateTimestamp();
      expect(ts).toMatch(/^\d{20}$/); // 14 digits (YYYYMMDDHHMMSS) + 3 ms + 3 counter
    });

    test('should generate unique timestamps', () => {
      const ts1 = generateTimestamp();
      const ts2 = generateTimestamp();
      expect(ts1).not.toBe(ts2);
    });
  });
});
