export interface BracketMatch {
  bracket: string; // The prefix/bracket that was matched (e.g., "Sven.")
  content: string; // The message content after the prefix (e.g., "test")
  fullMatch: string; // The full matched string
}

/**
 * Parse message content for bracket/prefix patterns
 * Supports both bracket syntax [text] and prefix syntax "Sven. text"
 * Example: "Sven. test" -> { bracket: "Sven.", content: "test", fullMatch: "Sven. test" }
 * Example: "[Sven.] test" -> { bracket: "Sven.", content: "test", fullMatch: "[Sven.] test" }
 */
export function parseMessageBrackets(content: string): BracketMatch | null {
  if (!content || content.trim().length === 0) {
    return null;
  }

  const trimmedContent = content.trim();

  // Common bracket patterns - check these first
  const bracketPatterns = [
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '{', close: '}' },
    { open: '<', close: '>' },
    { open: '«', close: '»' },
  ];

  // Try bracket patterns first
  for (const pattern of bracketPatterns) {
    if (trimmedContent.startsWith(pattern.open)) {
      const closeIndex = trimmedContent.indexOf(pattern.close, 1);

      if (closeIndex !== -1) {
        const bracketContent = trimmedContent.substring(1, closeIndex).trim();

        if (bracketContent.length > 0) {
          // Extract the message content after the brackets
          const messageContent = trimmedContent.substring(closeIndex + 1).trim();
          
          return {
            bracket: bracketContent, // Content inside brackets (e.g., "Sven.")
            content: messageContent, // Message after brackets (e.g., "test")
            fullMatch: trimmedContent.substring(0, closeIndex + 1),
          };
        }
      }
    }
  }

  // If no brackets found, treat the entire message as a potential prefix match
  // The backend will check if any character has a matching bracket/prefix
  // For now, return null and let the backend handle prefix matching
  return null;
}

export default parseMessageBrackets;
