import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TemplateSelector from '../TemplateSelector'

// Mock básico do navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(),
    readText: vi.fn(),
  },
  writable: true,
})

describe('TemplateSelector', () => {
  const defaultProps = {
    selectedTemplate: 'custom',
    setSelectedTemplate: vi.fn(),
    templateData: {},
    setTemplateData: vi.fn(),
    darkMode: false,
    showNotification: vi.fn(),
    user: null,
    isFeatureAvailable: vi.fn(() => true),
    onUpgradeClick: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza todos os templates disponíveis', () => {
    render(<TemplateSelector {...defaultProps} />)
    
    expect(screen.getByText('Personalizado')).toBeInTheDocument()
    expect(screen.getByText('WiFi')).toBeInTheDocument()
    expect(screen.getByText('vCard')).toBeInTheDocument()
    expect(screen.getByText('SMS')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Localização')).toBeInTheDocument()
    expect(screen.getByText('URL')).toBeInTheDocument()
    expect(screen.getByText('Redes Sociais')).toBeInTheDocument()
  })

  it('chama setSelectedTemplate quando um template é clicado', () => {
    render(<TemplateSelector {...defaultProps} />)
    
    const urlButton = screen.getByText('URL')
    fireEvent.click(urlButton)
    
    expect(defaultProps.setSelectedTemplate).toHaveBeenCalledWith('url')
  })

  it('mostra campos de configuração quando um template é selecionado', () => {
    render(<TemplateSelector {...defaultProps} selectedTemplate="wifi" />)
    
    expect(screen.getByText('📶 Configurar WiFi')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite o nome da rede WiFi')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite a senha da rede')).toBeInTheDocument()
    expect(screen.getByText('WPA/WPA2')).toBeInTheDocument()
  })

  it('não mostra campos de configuração para template custom', () => {
    render(<TemplateSelector {...defaultProps} selectedTemplate="custom" />)
    
    expect(screen.queryByText(/Configurar/)).not.toBeInTheDocument()
  })

  it('preenche dados de exemplo quando o botão é clicado', () => {
    render(<TemplateSelector {...defaultProps} selectedTemplate="wifi" />)
    
    const exemploButton = screen.getByText('📝 Exemplo')
    fireEvent.click(exemploButton)
    
    expect(defaultProps.setTemplateData).toHaveBeenCalled()
    expect(defaultProps.showNotification).toHaveBeenCalledWith('Dados de exemplo preenchidos!', 'success')
  })
}) 