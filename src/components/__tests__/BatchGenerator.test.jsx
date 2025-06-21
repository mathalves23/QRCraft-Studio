import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BatchGenerator from '../BatchGenerator'

// Mock do QRCode
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mock-qr-code')
  }
}))

describe('BatchGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const defaultProps = {
    batchTexts: [''],
    setBatchTexts: vi.fn(),
    onGenerate: vi.fn(),
    onClose: vi.fn(),
    showNotification: vi.fn()
  }

  it('renderiza o modal quando isOpen é true', () => {
    render(<BatchGenerator {...defaultProps} />)
    
    expect(screen.getByText(/Geração em Lote/i)).toBeInTheDocument()
  })

  it('não renderiza quando isOpen é false', () => {
    render(<BatchGenerator {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText(/Geração em Lote/i)).not.toBeInTheDocument()
  })

  it('permite adicionar novos campos de texto', () => {
    render(<BatchGenerator {...defaultProps} />)
    
    const addButton = screen.getByRole('button', { name: /adicionar/i })
    fireEvent.click(addButton)
    
    expect(defaultProps.setBatchTexts).toHaveBeenCalled()
  })

  it('permite remover campos de texto', () => {
    const propsWithMultipleTexts = {
      ...defaultProps,
      batchTexts: ['texto1', 'texto2']
    }
    render(<BatchGenerator {...propsWithMultipleTexts} />)
    
    const removeButtons = screen.getAllByRole('button', { name: /🗑️/i })
    if (removeButtons.length > 0) {
      fireEvent.click(removeButtons[0])
      expect(defaultProps.setBatchTexts).toHaveBeenCalled()
    }
  })

  it('chama onClose quando o botão fechar é clicado', () => {
    const onClose = vi.fn()
    render(<BatchGenerator {...defaultProps} onClose={onClose} />)
    
    const closeButton = screen.getByRole('button', { name: /✕/ })
    fireEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalled()
  })

  it('valida campos vazios antes de gerar', () => {
    render(<BatchGenerator {...defaultProps} />)
    
    const generateButton = screen.getByRole('button', { name: /gerar/i })
    expect(generateButton).toBeDisabled()
  })

  it('permite inserir texto nos campos', () => {
    render(<BatchGenerator {...defaultProps} />)
    
    const textInput = screen.getByRole('textbox')
    fireEvent.change(textInput, { target: { value: 'https://example.com' } })
    
    expect(defaultProps.setBatchTexts).toHaveBeenCalled()
  })

  it('limpa campos quando modal é aberto', () => {
    const { rerender } = render(<BatchGenerator {...defaultProps} isOpen={false} />)
    
    // Abre o modal
    rerender(<BatchGenerator {...defaultProps} isOpen={true} />)
    
    const textInput = screen.getByRole('textbox')
    expect(textInput.value).toBe('')
  })
}) 