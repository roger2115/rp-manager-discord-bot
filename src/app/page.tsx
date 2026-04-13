'use client'

import { useEffect, useState } from 'react'
import { LogIn, Users, Shield, Zap } from 'lucide-react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = () => {
    const discordClientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '1492693587614371971'
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback`)
    const scope = encodeURIComponent('identify guilds')
    
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-12 animate-float">
          <div className="mb-6">
            <img 
              src="/logo.png" 
              alt="Panel RP Discord Logo" 
              className="w-32 h-32 mx-auto mb-4 rounded-2xl shadow-2xl"
            />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Panel RP Discord
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Zaawansowany system zarządzania postaciami RP dla serwerów Discord. 
            Twórz, zarządzaj i rozwijaj swoje postacie w jednym miejscu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <Users className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Zarządzanie Postaciami</h3>
            <p className="text-gray-300">Twórz i edytuj postacie z pełną kontrolą nad ich wyglądem i historią.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <Shield className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">System Uprawnień</h3>
            <p className="text-gray-300">Kontroluj kto może tworzyć i edytować postacie na twoim serwerze.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <Zap className="w-12 h-12 text-violet-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Automatyzacja</h3>
            <p className="text-gray-300">Bot automatycznie obsługuje wiadomości RP i system progresji postaci.</p>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        >
          <div className="flex items-center space-x-3">
            <LogIn className="w-6 h-6" />
            <span>Zaloguj się przez Discord</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
        </button>

        <p className="text-gray-400 mt-6 text-center max-w-md">
          Kliknij powyżej, aby zalogować się przez Discord i uzyskać dostęp do panelu zarządzania postaciami.
        </p>
      </div>
    </div>
  )
}