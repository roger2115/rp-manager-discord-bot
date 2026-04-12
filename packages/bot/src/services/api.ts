import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3003';

export interface Character {
  id: string;
  userId: string;
  guildId: string;
  name: string;
  avatarUrl: string;
  tag: string;
  brackets: string;
  currentRankId: string | null;
  messageCount: number;
}

export interface ProgressionResult {
  promoted: boolean;
  character: Character;
  promotion?: any;
}

/**
 * Get character by bracket
 */
export async function getCharacterByBracket(
  guildId: string,
  bracket: string
): Promise<Character | null> {
  try {
    const response = await axios.get(`${API_URL}/api/characters/by-bracket`, {
      params: { guildId, bracket },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Failed to get character by bracket:', error);
    throw error;
  }
}

/**
 * Increment character message count
 */
export async function incrementMessageCount(characterId: string): Promise<ProgressionResult> {
  try {
    const response = await axios.post(`${API_URL}/api/progression/increment`, {
      characterId,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to increment message count:', error);
    throw error;
  }
}

export default {
  getCharacterByBracket,
  incrementMessageCount,
};
