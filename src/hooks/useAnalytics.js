import { useCallback } from 'react'
import analyticsService from '../lib/analytics'
import { useAuth } from './useAuth.jsx'

// Hook para rastreamento de eventos de analytics
export function useAnalytics() {
  const { user, profile } = useAuth()

  // Função para rastrear eventos
  const trackEvent = useCallback((eventName, properties = {}) => {
    const eventProperties = {
      ...properties,
      user_id: user?.id,
      user_plan: profile?.plan || 'anonymous',
      app_version: __APP_VERSION__
    }
    
    analyticsService.trackEvent(eventName, eventProperties)
  }, [user, profile])

  // Função para identificar o usuário
  const identifyUser = useCallback(() => {
    if (user && profile) {
      analyticsService.identifyUser(user.id, {
        email: user.email,
        name: profile.name,
        plan: profile.plan
      })
    }
  }, [user, profile])

  // Função para limpar sessão do usuário (logout)
  const resetAnalytics = useCallback(() => {
    analyticsService.reset()
  }, [])
  
  // Função para capturar erros
  const captureError = useCallback((error, context = {}) => {
    const errorContext = {
      ...context,
      user_id: user?.id,
      user_plan: profile?.plan
    }
    analyticsService.captureError(error, errorContext)
  }, [user, profile])

  return {
    trackEvent,
    identifyUser,
    resetAnalytics,
    captureError
  }
}

export default useAnalytics 