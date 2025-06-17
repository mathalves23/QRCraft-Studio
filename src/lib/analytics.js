import * as Sentry from '@sentry/react'
import mixpanel from 'mixpanel-browser'
import posthog from 'posthog-js'

// Configurações dos serviços (devem vir de variáveis de ambiente)
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || ''
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || ''
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || ''
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'
const IS_PRODUCTION = import.meta.env.PROD

// Serviço unificado de Analytics e Monitoramento
export const analyticsService = {
  
  // Inicialização
  init() {
    if (!IS_PRODUCTION) {
      console.warn('Analytics desabilitado em ambiente de desenvolvimento.')
      return
    }

    // 1. Sentry (Error Monitoring)
    if (SENTRY_DSN) {
      Sentry.init({
        dsn: SENTRY_DSN,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: false,
            blockAllMedia: false,
          }),
        ],
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        environment: import.meta.env.MODE,
        release: `qrcraft-studio@${__APP_VERSION__}`
      })
      console.log('✅ Sentry inicializado.')
    }

    // 2. Mixpanel (Product Analytics)
    if (MIXPANEL_TOKEN) {
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: !IS_PRODUCTION,
        track_pageview: true,
        persistence: 'localStorage'
      })
      console.log('✅ Mixpanel inicializado.')
    }

    // 3. PostHog (Product Analytics + Session Replay)
    if (POSTHOG_KEY) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        autocapture: true,
        capture_pageview: true,
        session_recording: {
          enabled: true,
          maskAllText: true,
          maskInputOptions: {
            password: true,
          },
        },
      })
      console.log('✅ PostHog inicializado.')
    }
  },

  // Identificar usuário nos serviços
  identifyUser(userId, traits = {}) {
    if (!IS_PRODUCTION) return

    // Sentry
    Sentry.setUser({ id: userId, ...traits })

    // Mixpanel
    mixpanel.identify(userId)
    mixpanel.people.set(traits)

    // PostHog
    posthog.identify(userId, traits)
  },

  // Registrar evento
  trackEvent(eventName, properties = {}) {
    if (!IS_PRODUCTION) {
      console.log(`[Analytics DEV] Evento: ${eventName}`, properties)
      return
    }

    // Mixpanel
    mixpanel.track(eventName, properties)

    // PostHog
    posthog.capture(eventName, properties)
  },

  // Limpar identificação do usuário (logout)
  reset() {
    if (!IS_PRODUCTION) return
    
    // Sentry
    Sentry.setUser(null)
    
    // Mixpanel
    mixpanel.reset()

    // PostHog
    posthog.reset()
  },
  
  // Capturar erro manualmente
  captureError(error, context = {}) {
    if (!IS_PRODUCTION) {
      console.error('[Sentry DEV]', error, context)
      return
    }
    
    Sentry.withScope(scope => {
      scope.setExtras(context)
      Sentry.captureException(error)
    })
  }
}

// Inicializar o serviço
analyticsService.init()

export default analyticsService 