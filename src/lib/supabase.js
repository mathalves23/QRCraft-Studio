import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Configuração de tabelas
export const TABLES = {
  USERS: 'users',
  QR_CODES: 'qr_codes',
  ANALYTICS: 'analytics',
  PAYMENTS: 'payments',
  SUBSCRIPTIONS: 'subscriptions'
}

// Tipos de dados para TypeScript-like validation
export const USER_SCHEMA = {
  id: 'string',
  email: 'string',
  name: 'string',
  plan: 'string', // 'free', 'pro'
  created_at: 'timestamp',
  updated_at: 'timestamp',
  email_verified: 'boolean',
  monthly_usage: 'number',
  plan_expiry: 'timestamp'
}

export const QR_CODE_SCHEMA = {
  id: 'string',
  user_id: 'string',
  content: 'string',
  template_type: 'string',
  template_data: 'json',
  qr_data_url: 'text',
  settings: 'json', // size, color, etc
  created_at: 'timestamp',
  updated_at: 'timestamp',
  is_public: 'boolean',
  download_count: 'number'
}

export const ANALYTICS_SCHEMA = {
  id: 'string',
  user_id: 'string',
  event_type: 'string', // 'qr_generated', 'qr_downloaded', 'qr_scanned'
  event_data: 'json',
  ip_address: 'string',
  user_agent: 'string',
  created_at: 'timestamp'
}

// Helpers para autenticação
export const authHelpers = {
  // Registrar usuário
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || '',
            plan: 'free',
            email_verified: false,
            monthly_usage: 0
          }
        }
      })

      if (error) throw error

      // Criar perfil do usuário na tabela users
      if (data.user) {
        const { error: profileError } = await supabase
          .from(TABLES.USERS)
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: userData.name || '',
              plan: 'free',
              email_verified: false,
              monthly_usage: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])

        if (profileError) console.error('Erro ao criar perfil:', profileError)
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Login
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Logout
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error }
    }
  },

  // Obter usuário atual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) return { user: null, profile: null, error }

      // Buscar perfil completo do usuário
      const { data: profile, error: profileError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', user.id)
        .single()

      return { user, profile, error: profileError }
    } catch (error) {
      return { user: null, profile: null, error }
    }
  },

  // Verificar email
  async verifyEmail(token) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Reset de senha
  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// Helpers para QR Codes
export const qrHelpers = {
  // Salvar QR Code
  async saveQRCode(qrData) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from(TABLES.QR_CODES)
        .insert([
          {
            user_id: user.id,
            content: qrData.content,
            template_type: qrData.template_type,
            template_data: qrData.template_data,
            qr_data_url: qrData.qr_data_url,
            settings: qrData.settings,
            is_public: qrData.is_public || false,
            download_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Buscar QR Codes do usuário
  async getUserQRCodes(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from(TABLES.QR_CODES)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Incrementar download count
  async incrementDownload(qrCodeId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.QR_CODES)
        .update({ 
          download_count: supabase.sql`download_count + 1`,
          updated_at: new Date().toISOString()
        })
        .eq('id', qrCodeId)

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// Helpers para Analytics
export const analyticsHelpers = {
  // Registrar evento
  async trackEvent(eventType, eventData = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from(TABLES.ANALYTICS)
        .insert([
          {
            user_id: user?.id || null,
            event_type: eventType,
            event_data: eventData,
            ip_address: eventData.ip || null,
            user_agent: navigator.userAgent,
            created_at: new Date().toISOString()
          }
        ])

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Obter analytics do usuário
  async getUserAnalytics(userId, days = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from(TABLES.ANALYTICS)
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// Rate limiting client-side (básico)
export const rateLimiter = {
  limits: new Map(),
  
  isAllowed(key, maxRequests = 10, windowMs = 60000) {
    const now = Date.now()
    const windowStart = now - windowMs
    
    if (!this.limits.has(key)) {
      this.limits.set(key, [])
    }
    
    const requests = this.limits.get(key)
    
    // Remove requisições antigas
    while (requests.length > 0 && requests[0] < windowStart) {
      requests.shift()
    }
    
    // Verifica limite
    if (requests.length >= maxRequests) {
      return false
    }
    
    // Adiciona nova requisição
    requests.push(now)
    return true
  }
}

export default supabase 