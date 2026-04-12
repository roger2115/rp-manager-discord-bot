'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getGuilds, Guild, getCharacters, Character, createCharacter, updateCharacter, deleteCharacter } from '@/lib/api';
import CharacterForm from '@/components/CharacterForm';
import CharacterCard from '@/components/CharacterCard';
import Modal from '@/components/Modal';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
        
        const response = await fetch(`${apiUrl}/api/auth/me`, {
          credentials: 'include',
        });

        if (!response.ok) {
          router.push('/');
          return;
        }

        const data = await response.json();
        setUser(data.user);

        // Fetch guilds
        try {
          const guildsData = await getGuilds();
          setGuilds(guildsData);
        } catch (error) {
          console.error('Dashboard: Failed to fetch guilds:', error);
        }
      } catch (error) {
        console.error('Dashboard: Auth check failed:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch characters when guild is selected
  useEffect(() => {
    if (!selectedGuild) {
      setCharacters([]);
      return;
    }

    const fetchCharacters = async () => {
      setLoadingCharacters(true);
      try {
        const data = await getCharacters(selectedGuild);
        setCharacters(data);
      } catch (error) {
        console.error('Failed to fetch characters:', error);
      } finally {
        setLoadingCharacters(false);
      }
    };

    fetchCharacters();
  }, [selectedGuild]);

  const handleCreateCharacter = async (data: any) => {
    if (!selectedGuild) {
      alert('Proszę najpierw wybrać serwer');
      return;
    }

    try {
      const characterData = {
        ...data,
        guildId: selectedGuild,
      };
      
      await createCharacter(characterData);
      setShowCreateModal(false);
      
      // Refresh characters
      const updatedCharacters = await getCharacters(selectedGuild);
      setCharacters(updatedCharacters);
    } catch (error) {
      console.error('Nie udało się utworzyć postaci:', error);
      alert('Nie udało się utworzyć postaci: ' + (error as Error).message);
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę postać?')) return;

    try {
      await deleteCharacter(id);
      // Refresh characters
      if (selectedGuild) {
        const updatedCharacters = await getCharacters(selectedGuild);
        setCharacters(updatedCharacters);
      }
    } catch (error) {
      console.error('Nie udało się usunąć postaci:', error);
      alert('Nie udało się usunąć postaci');
    }
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
    setShowEditModal(true);
  };

  const handleUpdateCharacter = async (data: any) => {
    if (!editingCharacter) return;

    try {
      await updateCharacter(editingCharacter.id, data);
      setShowEditModal(false);
      setEditingCharacter(null);
      
      // Refresh characters
      if (selectedGuild) {
        const updatedCharacters = await getCharacters(selectedGuild);
        setCharacters(updatedCharacters);
      }
    } catch (error) {
      console.error('Nie udało się zaktualizować postaci:', error);
      alert('Nie udało się zaktualizować postaci: ' + (error as Error).message);
    }
  };

  // Get unique groups for filtering
  const groups = Array.from(new Set(characters.map(c => c.tag))).sort();

  // Filter and sort characters
  const filteredCharacters = characters
    .filter(character => {
      const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           character.brackets.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = selectedGroup === 'all' || character.tag === selectedGroup;
      return matchesSearch && matchesGroup;
    })
    .sort((a, b) => {
      // Sort by group first, then by name
      if (a.tag !== b.tag) {
        return a.tag.localeCompare(b.tag);
      }
      return a.name.localeCompare(b.name);
    });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl text-primary-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative bg-dark-800/80 backdrop-blur-md border-b border-primary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">RP</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                RP Manager
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Witaj ponownie!</span>
              <button 
                onClick={async () => {
                  try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
                    await fetch(`${apiUrl}/api/auth/logout`, {
                      method: 'POST',
                      credentials: 'include',
                    });
                    router.push('/');
                  } catch (error) {
                    console.error('Wylogowanie nie powiodło się:', error);
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all"
              >
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Server Selector */}
          <div className="lg:col-span-1">
            <div className="bg-dark-800/80 backdrop-blur-md border border-primary-900/50 rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-primary-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Twoje Serwery
              </h2>
              {guilds.length === 0 ? (
                <p className="text-gray-500 text-sm">Nie znaleziono serwerów</p>
              ) : (
                <div className="space-y-2">
                  {guilds.map((guild) => (
                    <button
                      key={guild.id}
                      onClick={() => setSelectedGuild(guild.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all transform hover:scale-[1.02] ${
                        selectedGuild === guild.id
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                          : 'bg-dark-700/50 text-gray-300 hover:bg-dark-700 border border-primary-900/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {guild.icon ? (
                          <img
                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                            alt={guild.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold">
                            {guild.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium truncate">{guild.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Characters List */}
          <div className="lg:col-span-2">
            <div className="bg-dark-800/80 backdrop-blur-md border border-primary-900/50 rounded-lg p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-primary-400 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Twoje Postacie
                </h2>
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                  disabled={!selectedGuild}
                  onClick={() => setShowCreateModal(true)}
                >
                  + Nowa Postać
                </button>
              </div>

              {!selectedGuild ? (
                <p className="text-gray-400 text-sm">
                  Wybierz serwer, aby zobaczyć i zarządzać swoimi postaciami
                </p>
              ) : loadingCharacters ? (
                <p className="text-gray-400 text-sm">Ładowanie postaci...</p>
              ) : characters.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  Nie masz jeszcze postaci. Kliknij "+ Nowa Postać", aby utworzyć!
                </p>
              ) : (
                <>
                  {/* Search and Filter */}
                  <div className="mb-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Szukaj postaci..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 bg-dark-700 border border-primary-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-600"
                    />
                    
                    {groups.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedGroup('all')}
                          className={`px-3 py-1 rounded-lg text-sm transition-all ${
                            selectedGroup === 'all'
                              ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                              : 'bg-dark-700 text-gray-400 hover:bg-dark-600 border border-primary-900/30'
                          }`}
                        >
                          Wszystkie
                        </button>
                        {groups.map(group => (
                          <button
                            key={group}
                            onClick={() => setSelectedGroup(group)}
                            className={`px-3 py-1 rounded-lg text-sm transition-all ${
                              selectedGroup === group
                                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
                                : 'bg-dark-700 text-gray-400 hover:bg-dark-600 border border-primary-900/30'
                            }`}
                          >
                            {group}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Characters Grid */}
                  {filteredCharacters.length === 0 ? (
                    <p className="text-gray-400 text-sm">Nie znaleziono postaci</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredCharacters.map((character) => (
                        <CharacterCard
                          key={character.id}
                          character={character}
                          onEdit={() => handleEditCharacter(character)}
                          onDelete={() => handleDeleteCharacter(character.id)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Character Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Utwórz Nową Postać"
      >
        <CharacterForm 
          onSubmit={handleCreateCharacter}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Character Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingCharacter(null);
        }}
        title="Edytuj Postać"
      >
        <CharacterForm 
          initialData={editingCharacter || undefined}
          onSubmit={handleUpdateCharacter}
          onCancel={() => {
            setShowEditModal(false);
            setEditingCharacter(null);
          }}
        />
      </Modal>
    </div>
  );
}
