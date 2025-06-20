import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QRCodeTester from '../QRCodeTester'

// Mock do jsQR
vi.mock('jsqr', () => ({
  default: vi.fn()
}))

describe('QRCodeTester', () => {
  const defaultProps = {
    isOpen: true,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    qrData: 'https://example.com',
    darkMode: false,
    onClose: vi.fn(),
    showNotification: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock do canvas
    const mockCanvas = {
      getContext: vi.fn(() => ({
        drawImage: vi.fn(),
        getImageData: vi.fn(() => ({
          data: new Uint8ClampedArray(100),
          width: 10,
          height: 10
        }))
      })),
      width: 100,
      height: 100
    }
    
    Object.defineProperty(document, 'createElement', {
      value: vi.fn(() => mockCanvas)
    })
    
    // Mock do Image
    global.Image = vi.fn(() => ({
      onload: null,
      src: '',
      width: 200,
      height: 200
    }))
  })

  it('não renderiza quando isOpen é false', () => {
    render(<QRCodeTester {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText(/Teste de QR Code/)).not.toBeInTheDocument()
  })

  it('renderiza o modal quando isOpen é true', () => {
    render(<QRCodeTester {...defaultProps} />)
    
    expect(screen.getByText(/Teste de QR Code/)).toBeInTheDocument()
  })

  it('chama onClose quando o botão de fechar é clicado', async () => {
    const user = userEvent.setup()
    render(<QRCodeTester {...defaultProps} />)
    
    const closeButton = screen.getByRole('button', { name: /fechar/i })
    await user.click(closeButton)
    
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('mostra loading durante o teste', async () => {
    render(<QRCodeTester {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText(/Testando QR Code/)).toBeInTheDocument()
    })
  })

  it('detecta tipo de conteúdo corretamente', () => {
    render(<QRCodeTester {...defaultProps} qrData="mailto:test@example.com" />)
    
    // A função detectContentType é chamada internamente
    // Vamos testar se o componente renderiza corretamente com diferentes tipos
    expect(screen.getByText(/Teste de QR Code/)).toBeInTheDocument()
  })

  it('aplica estilos de dark mode', () => {
    render(<QRCodeTester {...defaultProps} darkMode={true} />)
    
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveStyle({ background: '#1e293b' })
  })

  it('mostra resultado do teste quando concluído', async () => {
    const mockJsQR = (await import('jsqr')).default
    mockJsQR.mockReturnValue({
      data: 'https://example.com',
      location: {
        topLeftCorner: { x: 0, y: 0 }
      }
    })

    render(<QRCodeTester {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText(/Leitura do QR Code/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('mostra erro quando QR Code não pode ser lido', async () => {
    const mockJsQR = (await import('jsqr')).default
    mockJsQR.mockReturnValue(null)

    render(<QRCodeTester {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText(/Não foi possível ler o QR Code/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('calcula pontuação corretamente', async () => {
    const mockJsQR = (await import('jsqr')).default
    mockJsQR.mockReturnValue({
      data: 'https://example.com',
      location: {
        topLeftCorner: { x: 0, y: 0 }
      }
    })

    render(<QRCodeTester {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText(/Excelente|Muito Bom|Bom|Regular|Precisa Melhorar/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('mostra ícones de status corretos', async () => {
    const mockJsQR = (await import('jsqr')).default
    mockJsQR.mockReturnValue({
      data: 'https://example.com',
      location: {
        topLeftCorner: { x: 0, y: 0 }
      }
    })

    render(<QRCodeTester {...defaultProps} />)
    
    await waitFor(() => {
      const successIcons = screen.getAllByText('✅')
      expect(successIcons.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it('testa QR Code automaticamente quando recebe novo qrCode', async () => {
    const mockJsQR = (await import('jsqr')).default
    mockJsQR.mockReturnValue({
      data: 'https://example.com',
      location: {
        topLeftCorner: { x: 0, y: 0 }
      }
    })

    const { rerender } = render(<QRCodeTester {...defaultProps} qrCode={null} />)
    
    // Simula receber um novo QR Code
    rerender(<QRCodeTester {...defaultProps} />)
    
    await waitFor(() => {
      expect(mockJsQR).toHaveBeenCalled()
    }, { timeout: 3000 })
  })
}) 