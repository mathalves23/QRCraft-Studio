import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getConfig, validateConfig } from '../production'

// Mock das variáveis de ambiente
const originalEnv = process.env

describe('production config', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
  })

  describe('getConfig', () => {
    it('retorna configuração padrão quando variáveis de ambiente não estão definidas', () => {
      const config = getConfig()
      
      expect(config).toHaveProperty('MERCADO_PAGO')
      expect(config).toHaveProperty('URLS')
      expect(config.MERCADO_PAGO).toHaveProperty('PUBLIC_KEY')
      expect(config.MERCADO_PAGO).toHaveProperty('ACCESS_TOKEN')
      expect(config.MERCADO_PAGO).toHaveProperty('ENVIRONMENT')
    })

    it('usa variáveis de ambiente quando disponíveis', () => {
      process.env.VITE_MP_PUBLIC_KEY = 'test_public_key'
      process.env.VITE_MP_ACCESS_TOKEN = 'test_access_token'
      process.env.VITE_MP_ENVIRONMENT = 'sandbox'
      
      const config = getConfig()
      
      expect(config.MERCADO_PAGO.PUBLIC_KEY).toBe('test_public_key')
      expect(config.MERCADO_PAGO.ACCESS_TOKEN).toBe('test_access_token')
      expect(config.MERCADO_PAGO.ENVIRONMENT).toBe('sandbox')
    })

    it('configura URLs corretamente', () => {
      process.env.VITE_WEBHOOK_URL = 'https://webhook.test.com'
      process.env.VITE_FRONTEND_URL = 'https://app.test.com'
      process.env.VITE_BACKEND_URL = 'https://api.test.com'
      
      const config = getConfig()
      
      expect(config.URLS.WEBHOOK).toBeDefined()
      expect(config.URLS.FRONTEND).toBeDefined()
      expect(config.URLS.BACKEND).toBeDefined()
    })

    it('usa URLs padrão quando variáveis não estão definidas', () => {
      const config = getConfig()
      
      expect(config.URLS.WEBHOOK).toBeDefined()
      expect(config.URLS.FRONTEND).toBeDefined()
      expect(config.URLS.BACKEND).toBeDefined()
    })
  })

  describe('validateConfig', () => {
    it('valida configuração válida com credenciais reais', () => {
      // Configurar credenciais válidas
      process.env.VITE_MP_PUBLIC_KEY = 'APP_USR-real-key-123'
      process.env.VITE_MP_ACCESS_TOKEN = 'APP_USR-real-token-456'
      
      const result = validateConfig()
      
      expect(result).toBeDefined()
      expect(result.MERCADO_PAGO.PUBLIC_KEY).toBe('APP_USR-real-key-123')
      expect(result.MERCADO_PAGO.ACCESS_TOKEN).toBe('APP_USR-real-token-456')
    })

    it('não lança erro para configuração de desenvolvimento com credenciais padrão', () => {
      // Configuração padrão de desenvolvimento
      process.env.VITE_MP_PUBLIC_KEY = 'TEST-suas-credenciais-de-teste-aqui'
      process.env.VITE_MP_ACCESS_TOKEN = 'TEST-suas-credenciais-de-teste-aqui'
      
      // Não deve lançar erro em desenvolvimento
      expect(() => validateConfig()).not.toThrow()
    })

    it('detecta credenciais inválidas mas não lança erro em desenvolvimento', () => {
      // Configurar credenciais inválidas
      process.env.VITE_MP_PUBLIC_KEY = 'APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
      process.env.VITE_MP_ACCESS_TOKEN = 'APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
      
      // Em desenvolvimento, não deve lançar erro mesmo com credenciais inválidas
      expect(() => validateConfig()).not.toThrow()
    })

    it('valida URLs obrigatórias', () => {
      const result = validateConfig()
      
      expect(result.URLS).toBeDefined()
      expect(result.URLS.BACKEND).toBeDefined()
      expect(result.URLS.FRONTEND).toBeDefined()
      expect(result.URLS.WEBHOOK).toBeDefined()
    })

    it('retorna configuração válida com URLs padrão', () => {
      const result = validateConfig()
      
      expect(result.URLS.BACKEND).toContain('netlify.app')
      expect(result.URLS.FRONTEND).toContain('netlify.app')
      expect(result.URLS.WEBHOOK).toContain('netlify.app')
    })
  })

  describe('integração', () => {
    it('getConfig retorna configuração válida', () => {
      const config = getConfig()
      
      expect(config).toBeDefined()
      expect(config.MERCADO_PAGO).toBeDefined()
      expect(config.URLS).toBeDefined()
    })

    it('funciona com ambiente de desenvolvimento', () => {
      process.env.NODE_ENV = 'development'
      
      const config = getConfig()
      
      expect(config.MERCADO_PAGO.ENVIRONMENT).toBe('sandbox')
    })

    it('validateConfig retorna configuração válida', () => {
      const config = validateConfig()
      
      expect(config).toBeDefined()
      expect(config.MERCADO_PAGO).toBeDefined()
      expect(config.URLS).toBeDefined()
    })
  })
}) 