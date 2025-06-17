import { describe, it, expect, vi } from 'vitest'
import QRCode from 'qrcode'

// Mock QRCode library
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn(),
    toString: vi.fn(),
  }
}))

describe('QR Code Utils', () => {
  describe('QR Code Generation', () => {
    it('should generate QR code with default options', async () => {
      const mockDataURL = 'data:image/png;base64,mockqrcode'
      QRCode.toDataURL.mockResolvedValue(mockDataURL)

      const result = await QRCode.toDataURL('test data', {
        width: 256,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'H',
        margin: 2,
      })

      expect(QRCode.toDataURL).toHaveBeenCalledWith('test data', {
        width: 256,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'H',
        margin: 2,
      })
      expect(result).toBe(mockDataURL)
    })

    it('should generate SVG QR code', async () => {
      const mockSVG = '<svg>mock svg</svg>'
      QRCode.toString.mockResolvedValue(mockSVG)

      const result = await QRCode.toString('test data', {
        type: 'svg',
        width: 256,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'H',
        margin: 2,
      })

      expect(QRCode.toString).toHaveBeenCalledWith('test data', {
        type: 'svg',
        width: 256,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'H',
        margin: 2,
      })
      expect(result).toBe(mockSVG)
    })

    it('should handle QR code generation errors', async () => {
      const errorMessage = 'QR generation failed'
      QRCode.toDataURL.mockRejectedValue(new Error(errorMessage))

      await expect(
        QRCode.toDataURL('invalid data')
      ).rejects.toThrow(errorMessage)
    })
  })

  describe('Template Data Generation', () => {
    it('should generate WiFi QR data correctly', () => {
      const wifiData = {
        ssid: 'MyNetwork',
        password: 'mypassword',
        security: 'WPA',
        hidden: false
      }

      const expected = 'WIFI:T:WPA;S:MyNetwork;P:mypassword;H:false;;'
      const result = generateWiFiData(wifiData)
      
      expect(result).toBe(expected)
    })

    it('should generate vCard data correctly', () => {
      const vCardData = {
        firstName: 'John',
        lastName: 'Doe',
        organization: 'Company',
        phone: '+1234567890',
        email: 'john@example.com',
        url: 'https://johndoe.com'
      }

      const result = generateVCardData(vCardData)
      
      expect(result).toContain('BEGIN:VCARD')
      expect(result).toContain('VERSION:3.0')
      expect(result).toContain('FN:John Doe')
      expect(result).toContain('ORG:Company')
      expect(result).toContain('TEL:+1234567890')
      expect(result).toContain('EMAIL:john@example.com')
      expect(result).toContain('URL:https://johndoe.com')
      expect(result).toContain('END:VCARD')
    })

    it('should generate email data correctly', () => {
      const emailData = {
        to: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test message'
      }

      const expected = 'mailto:test@example.com?subject=Test%20Subject&body=Test%20message'
      const result = generateEmailData(emailData)
      
      expect(result).toBe(expected)
    })

    it('should generate SMS data correctly', () => {
      const smsData = {
        phone: '+1234567890',
        message: 'Hello World'
      }

      const expected = 'sms:+1234567890?body=Hello%20World'
      const result = generateSMSData(smsData)
      
      expect(result).toBe(expected)
    })
  })

  describe('QR Code Validation', () => {
    it('should validate URL format', () => {
      expect(isValidURL('https://example.com')).toBe(true)
      expect(isValidURL('http://example.com')).toBe(true)
      expect(isValidURL('ftp://example.com')).toBe(false)
      expect(isValidURL('invalid-url')).toBe(false)
      expect(isValidURL('')).toBe(false)
    })

    it('should validate email format', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true)
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })

    it('should validate phone format', () => {
      expect(isValidPhone('+1234567890')).toBe(true)
      expect(isValidPhone('1234567890')).toBe(true)
      expect(isValidPhone('+55 11 99999-9999')).toBe(true)
      expect(isValidPhone('123')).toBe(false)
      expect(isValidPhone('abc')).toBe(false)
    })
  })
})

// Helper functions to test
function generateWiFiData({ ssid, password, security, hidden }) {
  return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;`
}

function generateVCardData({ firstName, lastName, organization, phone, email, url }) {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${firstName} ${lastName}`,
    `ORG:${organization}`,
    `TEL:${phone}`,
    `EMAIL:${email}`,
    `URL:${url}`,
    'END:VCARD'
  ].join('\n')
}

function generateEmailData({ to, subject, body }) {
  const params = new URLSearchParams()
  if (subject) params.append('subject', subject)
  if (body) params.append('body', body)
  
  return `mailto:${to}${params.toString() ? '?' + params.toString() : ''}`
}

function generateSMSData({ phone, message }) {
  return `sms:${phone}${message ? '?body=' + encodeURIComponent(message) : ''}`
}

function isValidURL(string) {
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (_) {
    return false
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone) {
  const phoneRegex = /^[\+\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
} 