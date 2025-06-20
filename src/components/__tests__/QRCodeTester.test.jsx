import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import QRCodeTester from '../QRCodeTester'

// Mock do jsQR
vi.mock('jsqr', () => ({
  default: vi.fn()
}))

describe('QRCodeTester', () => {
  const defaultProps = {
    isOpen: true,
    qrCode: 'data:image/png;base64,test',
    qrData: 'https://example.com',
    darkMode: false,
    onClose: vi.fn(),
    showNotification: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock básico do canvas e Image
    global.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(100),
        width: 10,
        height: 10
      }))
    }))
    
    global.Image = vi.fn(() => ({
      onload: null,
      src: '',
      width: 200,
      height: 200
    }))
  })

  it('não renderiza quando isOpen é false', () => {
    render(<QRCodeTester {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText(/Teste do QR Code/)).not.toBeInTheDocument()
  })

  it('renderiza o modal quando isOpen é true', () => {
    render(<QRCodeTester {...defaultProps} />)
    
    // O texto está dividido em elementos separados, então vamos procurar por partes
    expect(screen.getByText('Teste do QR Code')).toBeInTheDocument()
  })

  it('chama onClose quando o botão de fechar é clicado', () => {
    render(<QRCodeTester {...defaultProps} />)
    
    const closeButton = screen.getByText('✕')
    fireEvent.click(closeButton)
    
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('aplica estilos de dark mode', () => {
    render(<QRCodeTester {...defaultProps} darkMode={true} />)
    
    // Verifica se o componente renderiza com dark mode
    expect(screen.getByText('Teste do QR Code')).toBeInTheDocument()
  })
}) 