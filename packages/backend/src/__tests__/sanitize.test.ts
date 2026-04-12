import { sanitizeInput, sanitizeURL, encodeHTML } from '../utils/sanitize';

describe('Sanitization Utils', () => {
  describe('sanitizeInput', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("XSS")</script>Hello';
      const result = sanitizeInput(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
    });

    it('should encode HTML entities', () => {
      const input = '<div>Test</div>';
      const result = sanitizeInput(input);
      expect(result).not.toContain('<div>');
    });

    it('should be idempotent', () => {
      const input = '<script>alert("XSS")</script>';
      const once = sanitizeInput(input);
      const twice = sanitizeInput(once);
      expect(once).toBe(twice);
    });

    it('should preserve text content', () => {
      const input = 'Hello World';
      const result = sanitizeInput(input);
      expect(result).toBe('Hello World');
    });

    it('should handle empty strings', () => {
      const result = sanitizeInput('');
      expect(result).toBe('');
    });
  });

  describe('sanitizeURL', () => {
    it('should accept valid HTTPS URLs from allowed domains', () => {
      const url = 'https://cdn.discordapp.com/avatars/123/abc.png';
      const result = sanitizeURL(url);
      expect(result).toBe(url);
    });

    it('should reject HTTP URLs', () => {
      const url = 'http://cdn.discordapp.com/avatars/123/abc.png';
      const result = sanitizeURL(url);
      expect(result).toBeNull();
    });

    it('should reject URLs from disallowed domains', () => {
      const url = 'https://evil.com/malicious.png';
      const result = sanitizeURL(url);
      expect(result).toBeNull();
    });

    it('should reject invalid URLs', () => {
      const url = 'not-a-url';
      const result = sanitizeURL(url);
      expect(result).toBeNull();
    });
  });

  describe('encodeHTML', () => {
    it('should encode special characters', () => {
      const input = '<>&"\\'';
      const result = encodeHTML(input);
      expect(result).toBe('&lt;&gt;&amp;&quot;&#x27;');
    });

    it('should handle empty strings', () => {
      const result = encodeHTML('');
      expect(result).toBe('');
    });

    it('should preserve normal text', () => {
      const input = 'Hello World';
      const result = encodeHTML(input);
      expect(result).toBe('Hello World');
    });
  });
});
