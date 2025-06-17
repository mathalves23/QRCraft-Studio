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
  SUBSCRIPTIONS: 'subscriptions',
  SHORTENED_URLS: 'shortened_urls',
  NOTIFICATIONS: 'notifications'
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

export const SHORTENED_URL_SCHEMA = {
  id: 'string',
  user_id: 'string',
  original_url: 'string',
  short_code: 'string',
  short_url: 'string',
  title: 'string',
  description: 'string',
  click_count: 'number',
  is_public: 'boolean',
  expires_at: 'timestamp',
  created_at: 'timestamp',
  updated_at: 'timestamp'
}

export const NOTIFICATION_SCHEMA = {
  id: 'string',
  user_id: 'string',
  type: 'string', // 'info', 'warning', 'error', 'success', 'promotion'
  title: 'string',
  message: 'string',
  read: 'boolean',
  action_type: 'string', // 'upgrade', 'feature', 'link', null
  action_data: 'json',
  created_at: 'timestamp',
  expires_at: 'timestamp'
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

// Helpers para URLs Encurtadas
export const urlShortenerHelpers = {
  // Gerar código curto único
  generateShortCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  // Salvar URL encurtada
  async saveShortUrl(originalUrl, customData = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Usuário não autenticado')

      let shortCode = customData.customCode || this.generateShortCode()
      
      // Verificar se o código já existe
      const { data: existing } = await supabase
        .from(TABLES.SHORTENED_URLS)
        .select('short_code')
        .eq('short_code', shortCode)
        .single()

      if (existing) {
        // Gerar novo código se já existir
        shortCode = this.generateShortCode()
      }

      const shortUrl = `${window.location.origin}/s/${shortCode}`

      const { data, error } = await supabase
        .from(TABLES.SHORTENED_URLS)
        .insert([
          {
            user_id: user.id,
            original_url: originalUrl,
            short_code: shortCode,
            short_url: shortUrl,
            title: customData.title || '',
            description: customData.description || '',
            click_count: 0,
            is_public: customData.isPublic || false,
            expires_at: customData.expiresAt || null,
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

  // Buscar URLs do usuário
  async getUserUrls(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from(TABLES.SHORTENED_URLS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Buscar URL por código curto
  async getUrlByShortCode(shortCode) {
    try {
      const { data, error } = await supabase
        .from(TABLES.SHORTENED_URLS)
        .select('*')
        .eq('short_code', shortCode)
        .single()

      if (data && data.expires_at && new Date(data.expires_at) < new Date()) {
        return { data: null, error: { message: 'URL expirada' } }
      }

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Incrementar contador de cliques
  async incrementClick(shortCode) {
    try {
      const { data, error } = await supabase
        .from(TABLES.SHORTENED_URLS)
        .update({ 
          click_count: supabase.sql`click_count + 1`,
          updated_at: new Date().toISOString()
        })
        .eq('short_code', shortCode)

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Deletar URL
  async deleteUrl(urlId) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from(TABLES.SHORTENED_URLS)
        .delete()
        .eq('id', urlId)
        .eq('user_id', user.id)

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// Helpers para Notificações
export const notificationHelpers = {
  // Criar notificação do sistema
  async createSystemNotification(notificationData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .insert([
          {
            user_id: notificationData.userId || null, // null = para todos
            type: notificationData.type || 'info',
            title: notificationData.title,
            message: notificationData.message,
            read: false,
            action_type: notificationData.actionType || null,
            action_data: notificationData.actionData || null,
            created_at: new Date().toISOString(),
            expires_at: notificationData.expiresAt || null
          }
        ])
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Buscar notificações do usuário
  async getUserNotifications(userId, includeGlobal = true) {
    try {
      let query = supabase
        .from(TABLES.NOTIFICATIONS)
        .select('*')
        .order('created_at', { ascending: false })

      if (includeGlobal) {
        // Buscar notificações específicas do usuário E globais
        query = query.or(`user_id.eq.${userId},user_id.is.null`)
      } else {
        // Apenas notificações específicas do usuário
        query = query.eq('user_id', userId)
      }

      // Filtrar notificações expiradas
      query = query.or('expires_at.is.null,expires_at.gt.now()')

      const { data, error } = await query

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Marcar notificação como lida
  async markAsRead(notificationId, userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .update({ read: true })
        .eq('id', notificationId)
        .or(`user_id.eq.${userId},user_id.is.null`)

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Marcar todas como lidas
  async markAllAsRead(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .update({ read: true })
        .or(`user_id.eq.${userId},user_id.is.null`)
        .eq('read', false)

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Contar notificações não lidas
  async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .select('*', { count: 'exact', head: true })
        .or(`user_id.eq.${userId},user_id.is.null`)
        .eq('read', false)
        .or('expires_at.is.null,expires_at.gt.now()')

      return { count: count || 0, error }
    } catch (error) {
      return { count: 0, error }
    }
  },

  // Deletar notificação
  async deleteNotification(notificationId, userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTIFICATIONS)
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId) // Só pode deletar próprias notificações

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
  },

  // Obter estatísticas de QR Codes por tipo
  async getQRStatsByType(userId, days = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from(TABLES.QR_CODES)
        .select('template_type, created_at')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())

      if (error) throw error

      // Agrupar por tipo
      const typeStats = {}
      data.forEach(item => {
        const type = item.template_type
        typeStats[type] = (typeStats[type] || 0) + 1
      })

      // Converter para formato do dashboard
      const result = Object.entries(typeStats).map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        count,
        percentage: Math.round((count / data.length) * 100) || 0
      }))

      return { data: result, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Obter atividade diária
  async getDailyActivity(userId, days = 7) {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // QR Codes gerados por dia
      const { data: qrData, error: qrError } = await supabase
        .from(TABLES.QR_CODES)
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      if (qrError) throw qrError

      // Downloads por dia (baseado nos analytics de download)
      const { data: downloadData, error: downloadError } = await supabase
        .from(TABLES.ANALYTICS)
        .select('created_at')
        .eq('user_id', userId)
        .eq('event_type', 'qr_downloaded')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      if (downloadError) throw downloadError

      // Agrupar por data
      const dailyStats = {}
      
      // Inicializar todos os dias com 0
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        const dateStr = date.toISOString().split('T')[0]
        dailyStats[dateStr] = { generated: 0, downloaded: 0 }
      }

      // Contar QR Codes gerados
      qrData.forEach(item => {
        const date = item.created_at.split('T')[0]
        if (dailyStats[date]) {
          dailyStats[date].generated++
        }
      })

      // Contar downloads
      downloadData.forEach(item => {
        const date = item.created_at.split('T')[0]
        if (dailyStats[date]) {
          dailyStats[date].downloaded++
        }
      })

      // Converter para array
      const result = Object.entries(dailyStats).map(([date, stats]) => ({
        date,
        generated: stats.generated,
        downloaded: stats.downloaded
      }))

      return { data: result, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Obter estatísticas gerais
  async getGeneralStats(userId) {
    try {
      // Total de QR Codes
      const { count: totalGenerated, error: qrError } = await supabase
        .from(TABLES.QR_CODES)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (qrError) throw qrError

      // Total de downloads
      const { count: totalDownloads, error: downloadError } = await supabase
        .from(TABLES.ANALYTICS)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('event_type', 'qr_downloaded')

      if (downloadError) throw downloadError

      // QR Codes com mais downloads
      const { data: topQRs, error: topError } = await supabase
        .from(TABLES.QR_CODES)
        .select('content, template_type, download_count')
        .eq('user_id', userId)
        .order('download_count', { ascending: false })
        .limit(5)

      if (topError) throw topError

      return {
        data: {
          totalGenerated: totalGenerated || 0,
          totalDownloads: totalDownloads || 0,
          topQRs: topQRs || []
        },
        error: null
      }
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