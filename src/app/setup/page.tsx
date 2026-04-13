'use client'

export default function Setup() {
  const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback` : 'https://panel-discord-rp.vercel.app/api/auth/callback'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Konfiguracja Discord OAuth</h1>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Kroki konfiguracji:</h2>
          
          <ol className="list-decimal list-inside space-y-4 text-gray-300">
            <li>Idź do <a href="https://discord.com/developers/applications" className="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer">Discord Developer Portal</a></li>
            <li>Wybierz swoją aplikację (ID: 1492693587614371971)</li>
            <li>Przejdź do sekcji "OAuth2" → "General"</li>
            <li>W sekcji "Redirects" dodaj następujący URL:</li>
          </ol>
          
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <code className="text-green-400 text-lg break-all">{redirectUri}</code>
            <button 
              onClick={() => navigator.clipboard.writeText(redirectUri)}
              className="ml-4 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Kopiuj
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg">
            <p className="text-yellow-300">
              <strong>Ważne:</strong> Po dodaniu redirect URI w Discord Developer Portal, zapisz zmiany i poczekaj kilka minut na propagację.
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Informacje o aplikacji:</h2>
          <div className="space-y-2 text-gray-300">
            <p><strong>Client ID:</strong> 1492693587614371971</p>
            <p><strong>Redirect URI:</strong> <code className="text-green-400">{redirectUri}</code></p>
            <p><strong>Scopes:</strong> identify, guilds</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Powrót do strony głównej
          </a>
        </div>
      </div>
    </div>
  )
}