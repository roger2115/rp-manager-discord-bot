const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';

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
  createdAt: string;
  updatedAt: string;
  currentRank?: {
    id: string;
    name: string;
    order: number;
  };
}

export interface CreateCharacterData {
  name: string;
  avatarUrl: string;
  tag: string;
  brackets: string;
  guildId: string;
}

export interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Not authenticated');
  }

  return response.json();
}

/**
 * Logout
 */
export async function logout() {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
}

/**
 * Get user's Discord guilds
 */
export async function getGuilds(): Promise<Guild[]> {
  const response = await fetch(`${API_URL}/api/guilds`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch guilds');
  }

  return response.json();
}

/**
 * Get characters for a guild
 */
export async function getCharacters(guildId: string): Promise<Character[]> {
  const response = await fetch(`${API_URL}/api/characters?guildId=${guildId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch characters');
  }

  return response.json();
}

/**
 * Create character
 */
export async function createCharacter(data: CreateCharacterData): Promise<Character> {
  const response = await fetch(`${API_URL}/api/characters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create character');
  }

  return response.json();
}

/**
 * Update character
 */
export async function updateCharacter(
  id: string,
  data: Partial<CreateCharacterData>
): Promise<Character> {
  const response = await fetch(`${API_URL}/api/characters/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update character');
  }

  return response.json();
}

/**
 * Delete character
 */
export async function deleteCharacter(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/characters/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete character');
  }
}

export default {
  getCurrentUser,
  logout,
  getGuilds,
  getCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter,
};
