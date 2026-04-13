'use client'

import { useEffect, useState } from 'react'
import { Users, Plus, Search, Filter, LogOut, MessageSquare, Edit, Trash2, Bot } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import Notification from '../../components/Notification'
import AddCharacterModal from '../../components/AddCharacterModal'
import MessageHistoryModal from '../../components/MessageHistoryModal'

interface User {
  id: string
  username: string
  discriminator: string
  avatar: string | null
}

interface Guild {
  id: string
  name: string
  icon: string | null
  memberCount: number
}

interface Character {
  id: string
  name: string
  tag: string
  avatarUrl: string
  description: string
  guildId: string
  userId: string
}

interface BotStatus {
  isOnline: boolean
  username: string
  guilds: number
  users: number
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [selectedGuild, setSelectedGuild] = useState<string>('')
  const [characters, setCharacters] = useState<Character[]>([])
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  const { notifications, removeNotification, success, error, info } = useNotifications()

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rp-manager-discord-bot-production.up.railway.app'

  useEffect(() => {
    initializeDashboard()
  }, [])

  useEffect(() => {
    if (selectedGuild) {
      fetchCharacters()
    }
  }, [selectedGuild])

  const initializeDashboard = async () => {
    // Get user data from API
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        window.location.href = '/'
        return
      }
      
      const userData = await response.json()
      setUser(userData)

      // Fetch bot status and guilds
      await Promise.all([
        fetchBotStatus(),
        fetchGuilds()
      ])
    } catch (error) {
      console.error('Error initializing dashboard:', error)
      error('Błąd', 'Nie udało się załadować danych użytkownika')
      window.location.href = '/'
    } finally {
      setLoading(false)
    }
  }

  const fetchBotStatus = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/status`)
      if (response.ok) {
        const data = await response.json()
        setBotStatus(data.bot)
      }
    } catch (error) {
      console.error('Error fetching bot status:', error)
    }
  }

  const fetchGuilds = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/guilds`)
      if (response.ok) {
        const data = await response.json()
        setGuilds(data)
        if (data.length > 0) {
          setSelectedGuild(data[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching guilds:', error)
      error('Błąd', 'Nie udało się załadować listy serwerów')
    }
  }

  const fetchCharacters = async () => {
    if (!selectedGuild) return
    
    try {
      const response = await fetch(`${backendUrl}/api/characters/${selectedGuild}`)
      if (response.ok) {
        const data = await response.json()
        setCharacters(data)
      }
    } catch (error) {
      console.error('Error fetching characters:', error)
      error('Błąd', 'Nie udało się załadować postaci')
    }
  }

  const handleAddCharacter = async (characterData: {
    name: string
    tag: string
    avatarUrl: string
    description: string
  }) => {
    if (!user || !selectedGuild) return

    try {
      const response = await fetch(`${backendUrl}/api/characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...characterData,
          guildId: selectedGuild,
          userId: user.id
        })
      })

      if (response.ok) {
        const newCharacter = await response.json()
        setCharacters(prev => [...prev, newCharacter])
        success('Sukces!', `Postać ${characterData.name} została dodana`)
      } else {
        throw new Error('Failed to add character')
      }
    } catch (error) {
      console.error('Error adding character:', error)
      error('Błąd', 'Nie udało się dodać postaci')
      throw error
    }
  }

  const handleEditCharacter = (character: Character) => {
    info('Edycja postaci', 'Funkcja edycji będzie dostępna wkrótce!')
  }

  const handleDeleteCharacter = async (character: Character) => {
    if (!confirm(`Czy na pewno chcesz usunąć postać ${character.name}?`)) {
      return
    }

    try {
      const response = await fetch(`${backendUrl}/api/characters/${character.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCharacters(prev => prev.filter(char => char.id !== character.id))
        success('Sukces!', `Postać ${character.name} została usunięta`)
      } else {
        throw new Error('Failed to delete character')
      }
    } catch (error) {
      console.error('Error deleting character:', error)
      error('Błąd', 'Nie udało się usunąć postaci')
    }
  }

  const handleShowHistory = (character: Character) => {
    setSelectedCharacter(character)
    setShowHistoryModal(true)
  }

  const handleLogout = () => {
    document.cookie = 'discord_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    window.location.href = '/'
  }

  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('/logo.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-black/30 backdrop-blur-md border-r border-white/10 p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Panel RP Logo"
                className="w-8 h-8 rounded-lg"
              />
              <h1 className="text-2xl font-bold text-white">Panel RP</h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-colors"
              title="Wyloguj się"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          {user && (
            <div className="mb-8 p-4 bg-white/10 rounded-xl border border-white/20">
              <div className="flex items-center space-x-3">
                {user.avatar ? (
                  <img
                    src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                    alt={user.username}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-white font-semibold">{user.username}</p>
                  <p className="text-gray-400 text-sm">#{user.discriminator}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bot status */}
          {botStatus && (
            <div className="mb-6 p-4 bg-white/10 rounded-xl border border-white/20">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${botStatus.isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <div>
                  <p className="text-white font-semibold flex items-center">
                    <Bot className="w-4 h-4 mr-1" />
                    {botStatus.username}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {botStatus.guilds} serwerów • {botStatus.users} użytkowników
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Servers */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Serwery
            </h3>
            <div className="space-y-2">
              {guilds.map((guild) => (
                <button
                  key={guild.id}
                  onClick={() => setSelectedGuild(guild.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    selectedGuild === guild.id
                      ? 'bg-purple-600/50 text-white border border-purple-400/50'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {guild.icon ? (
                      <img
                        src={guild.icon}
                        alt={guild.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {guild.name[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{guild.name}</p>
                      <p className="text-xs text-gray-400">{guild.memberCount} członków</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Postacie</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Dodaj Postać</span>
              </button>
            </div>

            {/* Search */}
            <div className="mb-8 flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Szukaj postaci..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Characters grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCharacters.map((character) => (
                <div
                  key={character.id}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={character.avatarUrl}
                      alt={character.name}
                      className="w-16 h-16 rounded-full border-2 border-purple-400"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://cdn.discordapp.com/embed/avatars/0.png'
                      }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white">{character.name}</h3>
                      {character.tag && (
                        <p className="text-purple-400 font-medium">{character.tag}</p>
                      )}
                    </div>
                  </div>
                  {character.description && (
                    <p className="text-gray-300 mb-4 line-clamp-3">{character.description}</p>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShowHistory(character)}
                      className="flex-1 bg-blue-600/50 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                      title="Historia wiadomości"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">Historia</span>
                    </button>
                    <button
                      onClick={() => handleEditCharacter(character)}
                      className="flex-1 bg-purple-600/50 text-white py-2 px-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-1"
                      title="Edytuj postać"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm">Edytuj</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCharacter(character)}
                      className="flex-1 bg-pink-600/50 text-white py-2 px-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center space-x-1"
                      title="Usuń postać"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Usuń</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCharacters.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Brak postaci</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm ? 'Nie znaleziono postaci pasujących do wyszukiwania.' : 'Nie masz jeszcze żadnych postaci na tym serwerze.'}
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                >
                  Stwórz pierwszą postać
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddCharacterModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddCharacter}
        guildId={selectedGuild}
      />

      <MessageHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        character={selectedCharacter}
      />

      {/* Notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  )
}