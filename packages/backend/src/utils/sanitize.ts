import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a DOMPurify instance for Node.js
const window = new JSDOM('').window;
const purify = DOMPurify(window as unknown as Window);

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Configure DOMPurify to be strict
  const clean = purify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
  });
  
  return clean;
}

/**
 * Sanitize HTML content (for rich text)
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';
  
  return purify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
}

/**
 * Encode HTML entities
 */
export function encodeHTML(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validate and sanitize URL
 */
export function sanitizeURL(url: string): string | null {
  try {
    const parsed = new URL(url);
    
    // Only allow HTTP/HTTPS URLs
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
}

export default {
  sanitizeInput,
  sanitizeHTML,
  encodeHTML,
  sanitizeURL,
};
