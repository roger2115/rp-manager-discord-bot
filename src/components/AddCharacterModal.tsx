'use client'

import { useState } from 'react'
import { X, Upload, User } from 'lucide-react'

interface AddCharacterModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (character: {
    name: string
    tag: string
    avatarUrl: string
    description: string
  }) => void
  guildId: string
}

export default function AddCharacterModal({ isOpen, onClose, onAdd, guildId }: AddCharacterModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    avatarUrl: '',
    description: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onAdd({
        ...formData,
        avatarUrl: formData.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png'
      })
      
      // Reset form
      setFormData({
        name: '',
        tag: '',
        avatarUrl: '',
        description: ''
      })
      
      onClose()
    } catch (err) {
      console.error('Error adding character:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900/95 to-purple-900/95 backdrop-blur-md rounded-2xl border border-white/20 p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <User className="w-6 h-6 mr-2" />
            Dodaj Postać
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Preview */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img
                src={formData.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                alt="Avatar preview"
                className="w-20 h-20 rounded-full border-2 border-purple-400"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://cdn.discordapp.com/embed/avatars/0.png'
                }}
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-white font-medium mb-2">
              Nazwa postaci *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="Wprowadź nazwę postaci"
            />
          </div>

          {/* Tag */}
          <div>
            <label className="block text-white font-medium mb-2">
              Tag/Tytuł
            </label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="np. Wojownik, Mag, Złodziej"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-white font-medium mb-2">
              URL Avatara
            </label>
            <input
              type="url"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="https://example.com/avatar.png"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-medium mb-2">
              Opis postaci
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
              placeholder="Opisz swoją postać..."
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-600/50 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Dodawanie...' : 'Dodaj Postać'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}