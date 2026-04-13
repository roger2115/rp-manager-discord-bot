'use client'

import { useState, useCallback } from 'react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification
    }

    setNotifications(prev => [...prev, newNotification])
    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const success = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'success', title, message, duration })
  }, [addNotification])

  const error = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'error', title, message, duration })
  }, [addNotification])

  const info = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'info', title, message, duration })
  }, [addNotification])

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'warning', title, message, duration })
  }, [addNotification])

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning
  }
}