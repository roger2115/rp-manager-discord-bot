import { parseMessageBrackets } from '../utils/bracketParser';

describe('Bracket Parser', () => {
  it('should parse square brackets correctly', () => {
    const result = parseMessageBrackets('[Hello world]');
    expect(result).toEqual({
      bracket: '[]',
      content: 'Hello world',
      fullMatch: '[Hello world]',
    });
  });

  it('should parse round brackets correctly', () => {
    const result = parseMessageBrackets('(Hello world)');
    expect(result).toEqual({
      bracket: '()',
      content: 'Hello world',
      fullMatch: '(Hello world)',
    });
  });

  it('should parse curly brackets correctly', () => {
    const result = parseMessageBrackets('{Hello world}');
    expect(result).toEqual({
      bracket: '{}',
      content: 'Hello world',
      fullMatch: '{Hello world}',
    });
  });

  it('should return null for empty brackets', () => {
    const result = parseMessageBrackets('[]');
    expect(result).toBeNull();
  });

  it('should return null for no brackets', () => {
    const result = parseMessageBrackets('Hello world');
    expect(result).toBeNull();
  });

  it('should handle nested brackets', () => {
    const result = parseMessageBrackets('[Hello [nested] world]');
    expect(result?.content).toBe('Hello [nested] world');
  });

  it('should trim whitespace from content', () => {
    const result = parseMessageBrackets('[  Hello world  ]');
    expect(result?.content).toBe('Hello world');
  });

  it('should handle empty strings', () => {
    const result = parseMessageBrackets('');
    expect(result).toBeNull();
  });

  it('should handle multiple bracket types and use first valid one', () => {
    const result = parseMessageBrackets('[First] (Second)');
    expect(result?.bracket).toBe('[]');
    expect(result?.content).toBe('First] (Second');
  });
});
