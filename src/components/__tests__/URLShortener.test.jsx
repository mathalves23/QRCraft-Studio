import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import URLShortener from '../URLShortener'

// Mock do fetch
global.fetch = vi.fn()

describe('URLShortener', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onShorten: vi.fn(),
    showNotification: vi.fn()
  }

  it('renderiza o modal quando isOpen é true', () => {
    render(<URLShortener {...defaultProps} />)
    expect(screen.getByText(/Encurtador de URLs/i)).toBeInTheDocument()
  })

  it('não renderiza quando isOpen é false', () => {
    render(<URLShortener {...defaultProps} isOpen={false} />)
    expect(screen.queryByText(/Encurtador de URLs/i)).not.toBeInTheDocument()
  })

  it('permite inserir URL para encurtar', () => {
    render(<URLShortener {...defaultProps} />)
    const urlInput = screen.getByPlaceholderText('https://exemplo.com/minha-url-muito-longa')
    fireEvent.change(urlInput, { target: { value: 'https://example.com/very-long-url' } })
    expect(urlInput.value).toBe('https://example.com/very-long-url')
  })

  it('chama onClose quando o botão fechar é clicado', () => {
    const onClose = vi.fn()
    render(<URLShortener {...defaultProps} onClose={onClose} />)
    const closeButton = screen.getByRole('button', { name: '✕' })
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })

  it('mostra botão de encurtar desabilitado quando URL está vazia', () => {
    render(<URLShortener {...defaultProps} />)
    const shortenButtons = screen.getAllByRole('button', { name: /encurtar url/i })
    const shortenButton = shortenButtons.find(btn => btn.textContent.includes('🚀 Encurtar URL'))
    expect(shortenButton).toBeDisabled()
  })

  it('habilita botão de encurtar quando URL é inserida', () => {
    render(<URLShortener {...defaultProps} />)
    const urlInput = screen.getByPlaceholderText('https://exemplo.com/minha-url-muito-longa')
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } })
    const shortenButtons = screen.getAllByRole('button', { name: /encurtar url/i })
    const shortenButton = shortenButtons.find(btn => btn.textContent.includes('🚀 Encurtar URL'))
    expect(shortenButton).not.toBeDisabled()
  })

  it('permite navegar entre as abas', () => {
    render(<URLShortener {...defaultProps} />)
    expect(screen.getByText(/URL para encurtar/i)).toBeInTheDocument()
    const historyButton = screen.getByRole('button', { name: /histórico/i })
    fireEvent.click(historyButton)
    expect(screen.getByText(/Nenhuma URL encurtada ainda/i)).toBeInTheDocument()
  })

  it('limpa campos quando modal é aberto', () => {
    const { rerender } = render(<URLShortener {...defaultProps} isOpen={false} />)
    rerender(<URLShortener {...defaultProps} isOpen={true} />)
    const urlInput = screen.getByPlaceholderText('https://exemplo.com/minha-url-muito-longa')
    expect(urlInput.value).toBe('')
  })

  it('renderiza botões de ação corretamente', () => {
    render(<URLShortener {...defaultProps} />)
    const buttons = screen.getAllByRole('button', { name: /encurtar url/i })
    expect(buttons.length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /histórico/i })).toBeInTheDocument()
  })
}) 