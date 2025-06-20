import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPaymentPreference } from '../mercadoPagoConfig'

// Mock do config
vi.mock('../../config/production.js', () => ({
  getConfig: vi.fn(() => ({
    MERCADO_PAGO: {
      PUBLIC_KEY: 'test_public_key',
      ACCESS_TOKEN: 'test_access_token',
      ENVIRONMENT: 'sandbox'
    },
    URLS: {
      WEBHOOK: 'https://webhook.example.com',
      FRONTEND: 'https://app.example.com',
      BACKEND: 'https://api.example.com'
    }
  })),
  validateConfig: vi.fn(() => ({
    MERCADO_PAGO: {
      PUBLIC_KEY: 'test_public_key',
      ACCESS_TOKEN: 'test_access_token',
      ENVIRONMENT: 'sandbox'
    },
    URLS: {
      WEBHOOK: 'https://webhook.example.com',
      FRONTEND: 'https://app.example.com',
      BACKEND: 'https://api.example.com'
    }
  }))
}))

describe('mercadoPagoConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createPaymentPreference', () => {
    it('cria preferência de pagamento com dados válidos', async () => {
      const userData = {
        id: 'user123',
        name: 'João Silva',
        email: 'joao@example.com'
      }

      const result = await createPaymentPreference(userData, 'PRO_ANNUAL')

      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('id')
      expect(result.data).toHaveProperty('init_point')
      expect(result.data).toHaveProperty('sandbox_init_point')
      expect(result.data.items[0].title).toBe('QRCraft Studio PRO - Plano Anual')
      expect(result.data.items[0].unit_price).toBe(20.00)
    })

    it('usa dados padrão quando userData não é fornecido', async () => {
      const result = await createPaymentPreference()

      expect(result.success).toBe(true)
      expect(result.data.payer.name).toBe('Usuário QRCraft')
      expect(result.data.payer.email).toBe('user@qrcraft.com')
    })

    it('inclui metadata correta', async () => {
      const userData = { id: 'user123' }
      const result = await createPaymentPreference(userData)

      expect(result.data.metadata).toEqual({
        user_id: 'user123',
        plan: 'pro',
        upgrade_type: 'annual',
        app: 'qrcraft-studio'
      })
    })
  })
}) 