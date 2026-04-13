'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export interface NotificationProps {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle
}

const colors = {
  success: 'from-green-500 to-emerald-500',
  error: 'from-red-500 to-pink-500',
  info: 'from-blue-500 to-cyan-500',
  warning: 'from-yellow-500 to-orange-500'
}

export default function Notification({ id, type, title, message, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const Icon = icons[type]

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100)

    // Auto close
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`
        bg-gradient-to-r ${colors[type]} p-0.5 rounded-xl shadow-2xl
        backdrop-blur-md border border-white/20
      `}>
        <div className="bg-black/80 backdrop-blur-md rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Icon className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm">{title}</h4>
              {message && (
                <p className="text-gray-300 text-sm mt-1">{message}</p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}