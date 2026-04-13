'use client'

import { useEffect, useState } from 'react'
import { Users, Plus, Search, Filter, LogOut } from 'lucide-react'

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
}

interface Character {
  id: string
  name: string
  tag: string
  avatarUrl: string
  description: string
  guildId: string
}

interface BotStatus {
  isOnline: boolean
  lastHeartbeat: string | null
  guilds: number
  users: number
  uptime: number | null
  username: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [selectedGuild, setSelectedGuild] = useState<string>('')
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null)

  useEffect(() => {
    // Get user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me')
        
        if (!response.ok) {
          // Redirect to login if not authenticated
          window.location.href = '/'
          return
        }

        const userData = await response.json()
        
        // Set real user data
        setUser({
          id: userData.id,
          username: userData.username,
          discriminator: '0000', // Discord removed discriminators
          avatar: userData.avatar
        })

        // Mock guilds and characters for now
        const mockGuilds: Guild[] = [
          {
            id: '1',
            name: 'Test Server',
            icon: null
          }
        ]

        const mockCharacters: Character[] = [
          {
            id: '1',
            name: 'Sven',
            tag: 'Wojownik',
            avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
            description: 'Potężny wojownik z północy',
            guildId: '1'
          }
        ]

        setGuilds(mockGuilds)
        setCharacters(mockCharacters)
        if (mockGuilds.length > 0) {
          setSelectedGuild(mockGuilds[0].id)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        window.location.href = '/'
      }
    }

    // Fetch bot status
    const fetchBotStatus = async () => {
      try {
        const response = await fetch('/api/bot/status')
        if (response.ok) {
          const status = await response.json()
          setBotStatus(status.bot)
        }
      } catch (error) {
        console.error('Error fetching bot status:', error)
      }
    }

    fetchUserData()
    fetchBotStatus()
    
    // Update bot status every 30 seconds
    const statusInterval = setInterval(fetchBotStatus, 30000)
    
    return () => clearInterval(statusInterval)
  }, [])

  const filteredCharacters = characters.filter(char => 
    char.guildId === selectedGuild &&
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleLogout = () => {
    // Clear cookie and redirect
    document.cookie = 'discord_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    window.location.href = '/'
  }

  const handleAddCharacter = () => {
    alert('Funkcja dodawania postaci będzie dostępna wkrótce!')
  }

  const handleEditCharacter = (characterId: string) => {
    alert(`Edycja postaci ${characterId} będzie dostępna wkrótce!`)
  }

  const handleDeleteCharacter = (characterId: string) => {
    if (confirm('Czy na pewno chcesz usunąć tę postać?')) {
      setCharacters(prev => prev.filter(char => char.id !== characterId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-black/20 backdrop-blur-md border-r border-white/10 p-6">
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
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>

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

          {/* Bot Status */}
          <div className="mb-6 p-4 bg-white/10 rounded-xl border border-white/20">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              🤖 Status Bota
            </h3>
            {botStatus ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    botStatus.isOnline 
                      ? 'bg-green-600/50 text-green-300' 
                      : 'bg-red-600/50 text-red-300'
                  }`}>
                    {botStatus.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Serwery:</span>
                  <span className="text-white">{botStatus.guilds}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Użytkownicy:</span>
                  <span className="text-white">{botStatus.users}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">Ładowanie...</div>
            )}
          </div>

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
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {guild.name[0].toUpperCase()}
                    </div>
                    <span className="truncate">{guild.name}</span>
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
                onClick={handleAddCharacter}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Dodaj Postać</span>
              </button>
            </div>

            {/* Search and filters */}
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
              <button className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-gray-400 hover:text-white transition-colors">
                <Filter className="w-5 h-5" />
              </button>
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
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white">{character.name}</h3>
                      <p className="text-purple-400 font-medium">{character.tag}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-3">{character.description}</p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditCharacter(character.id)}
                      className="flex-1 bg-purple-600/50 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Edytuj
                    </button>
                    <button 
                      onClick={() => handleDeleteCharacter(character.id)}
                      className="flex-1 bg-pink-600/50 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Usuń
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
                  onClick={handleAddCharacter}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                >
                  Stwórz pierwszą postać
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}