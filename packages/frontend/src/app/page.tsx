'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    // Redirect to backend OAuth2 endpoint
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
    console.log('Redirecting to login:', `${apiUrl}/api/auth/login`);
    window.location.href = `${apiUrl}/api/auth/login`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        {/* Logo/Title */}
        <div className="text-center space-y-4">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-600 bg-clip-text text-transparent animate-pulse">
            RP Manager
          </h1>
          <p className="text-2xl text-gray-300 font-light">
            Zarządzanie Postaciami Roleplay na Discordzie
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-4xl">
          <div className="bg-dark-800/50 backdrop-blur-sm border border-primary-500/20 rounded-lg p-6 hover:border-primary-500/50 transition-all">
            <div className="text-4xl mb-3">🎭</div>
            <h3 className="text-lg font-semibold text-primary-400 mb-2">Zarządzanie Postaciami</h3>
            <p className="text-gray-400 text-sm">
              Twórz i zarządzaj postaciami roleplay z własnymi avatarami i nawiasami
            </p>
          </div>

          <div className="bg-dark-800/50 backdrop-blur-sm border border-secondary-500/20 rounded-lg p-6 hover:border-secondary-500/50 transition-all">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold text-secondary-400 mb-2">Proxy Webhooków</h3>
            <p className="text-gray-400 text-sm">
              Bezproblemowo mów jako twoje postacie używając składni nawiasów na Discordzie
            </p>
          </div>

          <div className="bg-dark-800/50 backdrop-blur-sm border border-primary-500/20 rounded-lg p-6 hover:border-primary-500/50 transition-all">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-lg font-semibold text-primary-400 mb-2">System Progresji</h3>
            <p className="text-gray-400 text-sm">
              Automatyczna progresja rang na podstawie aktywności i czasu
            </p>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="mt-8 px-12 py-5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-primary-500/50"
        >
          Zaloguj przez Discord
        </button>

        {/* Footer */}
        <p className="text-gray-500 text-sm mt-12">
          Stworzone przez <span className="text-primary-400">ten_røger</span>
        </p>
      </div>
    </main>
  );
}
