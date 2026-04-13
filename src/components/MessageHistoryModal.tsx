'use client'

import { useState, useEffect } from 'react'
import { X, MessageSquare, ExternalLink, Clock } from 'lucide-react'

interface Message {
  id: string
  content: string
  timestamp: string
  editedAt?: string
  messageUrl: string
}

interface MessageHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  character: {
    id: string
    name: string
    avatarUrl: string
  } | null
}

export default function MessageHistoryModal({ isOpen, onClose, character }: MessageHistoryModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && character) {
      fetchMessages()
    }
  }, [isOpen, character])

  const fetchMessages = async () => {
    if (!character) return
    
    setLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rp-manager-discord-bot-production.up.railway.app'
      const response = await fetch(`${backendUrl}/api/messages/${character.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !character) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900/95 to-purple-900/95 backdrop-blur-md rounded-2xl border border-white/20 p-6 w-full max-w-2xl max-h-[80vh] shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img
              src={character.avatarUrl}
              alt={character.name}
              className="w-10 h-10 rounded-full border-2 border-purple-400"
            />
            <div>
              <h2 className="text-xl font-bold text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Historia wiadomości
              </h2>
              <p className="text-gray-400 text-sm">{character.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="overflow-y-auto max-h-96 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">Brak wiadomości</p>
              <p className="text-gray-500 text-sm">Ta postać nie wysłała jeszcze żadnych wiadomości</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(message.timestamp)}</span>
                    {message.editedAt && (
                      <span className="text-yellow-400">(edytowano {formatDate(message.editedAt)})</span>
                    )}
                  </div>
                  <a
                    href={message.messageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                    title="Otwórz w Discord"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-white whitespace-pre-wrap">{message.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  )
}