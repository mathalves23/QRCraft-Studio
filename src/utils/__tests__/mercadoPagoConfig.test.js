import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  createPaymentPreference, 
  createPixPayment, 
  processCardPayment, 
  checkPaymentStatus,
  validatePayment,
  upgradeUserPlan
} from '../mercadoPagoConfig'

// Mock do fetch
global.fetch = vi.fn()

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
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
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

  describe('createPixPayment', () => {
    it('cria pagamento PIX com sucesso', async () => {
      const userData = { id: 'user123', name: 'João' }
      const mockResponse = {
        success: true,
        data: {
          qr_code: 'pix_qr_code_data',
          qr_code_text: 'pix_code_text'
        }
      }

      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })

      const result = await createPixPayment(userData, 25.00)

      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/create-payment',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'pix',
            userData,
            amount: 25.00
          })
        })
      )
      expect(result.success).toBe(true)
    })

    it('trata erro na criação do pagamento PIX', async () => {
      const userData = { id: 'user123' }
      const mockResponse = {
        success: false,
        error: 'Erro no servidor'
      }

      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })

      const result = await createPixPayment(userData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Erro no servidor')
    })

    it('trata erro de rede', async () => {
      fetch.mockRejectedValueOnce(new Error('Erro de rede'))

      const result = await createPixPayment({})

      expect(result.success).toBe(false)
      expect(result.error).toBe('Erro de rede')
    })
  })

  describe('processCardPayment', () => {
    it('processa pagamento com cartão com sucesso', async () => {
      const cardData = {
        cardNumber: '4111111111111111',
        cardholderName: 'João Silva',
        expirationDate: '12/25',
        cvv: '123'
      }
      const userData = { id: 'user123' }
      const mockResponse = {
        success: true,
        data: { payment_id: 'pay_123' }
      }

      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })

      const result = await processCardPayment(cardData, userData, 30.00)

      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/create-payment',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            type: 'card',
            userData,
            amount: 30.00,
            cardData
          })
        })
      )
      expect(result.success).toBe(true)
    })

    it('trata erro no processamento do cartão', async () => {
      const cardData = { cardNumber: 'invalid' }
      const mockResponse = {
        success: false,
        error: 'Cartão inválido'
      }

      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse)
      })

      const result = await processCardPayment(cardData, {})

      expect(result.success).toBe(false)
      expect(result.error).toBe('Cartão inválido')
    })
  })

  describe('checkPaymentStatus', () => {
    it('verifica status do pagamento com sucesso', async () => {
      const result = await checkPaymentStatus('pay_123')

      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('status')
    })

    it('simula delay na verificação', async () => {
      const startTime = Date.now()
      const result = await checkPaymentStatus('pay_123')
      const endTime = Date.now()

      expect(result.success).toBe(true)
      // O delay simulado é de 500ms
      expect(endTime - startTime).toBeGreaterThanOrEqual(500)
    })
  })

  describe('validatePayment', () => {
    it('valida pagamento com dados corretos', () => {
      const paymentData = {
        status: 'approved',
        amount: 20.00,
        currency: 'BRL',
        external_reference: 'qrcraft_user123_1234567890'
      }
      const userData = { id: 'user123' }

      const result = validatePayment(paymentData, userData)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('rejeita pagamento com status inválido', () => {
      const paymentData = {
        status: 'rejected',
        amount: 20.00,
        currency: 'BRL'
      }
      const userData = { id: 'user123' }

      const result = validatePayment(paymentData, userData)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Status do pagamento inválido')
    })

    it('rejeita pagamento com valor incorreto', () => {
      const paymentData = {
        status: 'approved',
        amount: 15.00, // Valor incorreto
        currency: 'BRL'
      }
      const userData = { id: 'user123' }

      const result = validatePayment(paymentData, userData)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Valor do pagamento incorreto')
    })

    it('rejeita pagamento com moeda incorreta', () => {
      const paymentData = {
        status: 'approved',
        amount: 20.00,
        currency: 'USD' // Moeda incorreta
      }
      const userData = { id: 'user123' }

      const result = validatePayment(paymentData, userData)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Moeda do pagamento deve ser BRL')
    })
  })

  describe('upgradeUserPlan', () => {
    it('atualiza plano do usuário com sucesso', () => {
      const userData = { id: 'user123', plan: 'free' }
      const paymentData = {
        status: 'approved',
        amount: 20.00,
        metadata: { plan: 'pro', upgrade_type: 'annual' }
      }

      const result = upgradeUserPlan(userData, paymentData)

      expect(result.success).toBe(true)
      expect(result.userData.plan).toBe('pro')
      expect(result.userData.proFeatures).toBe(true)
      expect(result.userData.planExpiry).toBeDefined()
    })

    it('trata erro na atualização do plano', () => {
      const userData = null
      const paymentData = { status: 'approved' }

      const result = upgradeUserPlan(userData, paymentData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Dados do usuário inválidos')
    })
  })
}) 