import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TemplateSelector from '../TemplateSelector'

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

  it('chama setSelectedTemplate quando um template é clicado', async () => {
    const user = userEvent.setup()
    render(<TemplateSelector {...defaultProps} />)
    
    const urlButton = screen.getByText('URL')
    await user.click(urlButton)
    
    expect(defaultProps.setSelectedTemplate).toHaveBeenCalledWith('url')
  })

  it('mostra campos de configuração quando um template é selecionado', () => {
    render(<TemplateSelector {...defaultProps} selectedTemplate="wifi" />)
    
    expect(screen.getByText('📶 Configurar WiFi')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome da Rede (SSID)')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Segurança')).toBeInTheDocument()
  })

  it('não mostra campos de configuração para template custom', () => {
    render(<TemplateSelector {...defaultProps} selectedTemplate="custom" />)
    
    expect(screen.queryByText(/Configurar/)).not.toBeInTheDocument()
  })

  it('atualiza templateData quando um campo é alterado', async () => {
    const user = userEvent.setup()
    render(<TemplateSelector {...defaultProps} selectedTemplate="wifi" />)
    
    const ssidInput = screen.getByLabelText('Nome da Rede (SSID)')
    await user.type(ssidInput, 'MinhaRede')
    
    expect(defaultProps.setTemplateData).toHaveBeenCalledWith(expect.any(Function))
  })

  it('preenche dados de exemplo quando o botão é clicado', async () => {
    const user = userEvent.setup()
    render(<TemplateSelector {...defaultProps} selectedTemplate="wifi" />)
    
    const exemploButton = screen.getByText('📝 Exemplo')
    await user.click(exemploButton)
    
    expect(defaultProps.setTemplateData).toHaveBeenCalled()
    expect(defaultProps.showNotification).toHaveBeenCalledWith('Dados de exemplo preenchidos!', 'success')
  })

  it('mostra ícone de bloqueio para templates premium quando feature não está disponível', () => {
    render(
      <TemplateSelector 
        {...defaultProps} 
        isFeatureAvailable={vi.fn(() => false)}
      />
    )
    
    const wifiButton = screen.getByText('WiFi').closest('button')
    expect(wifiButton).toHaveTextContent('🔒')
  })

  it('chama onUpgradeClick quando template premium é clicado sem permissão', async () => {
    const user = userEvent.setup()
    render(
      <TemplateSelector 
        {...defaultProps} 
        isFeatureAvailable={vi.fn(() => false)}
      />
    )
    
    const wifiButton = screen.getByText('WiFi')
    await user.click(wifiButton)
    
    expect(defaultProps.showNotification).toHaveBeenCalledWith(
      'Plano Standard permite apenas QR Codes de URLs. Upgrade para PRO para mais templates!',
      'error'
    )
    expect(defaultProps.onUpgradeClick).toHaveBeenCalled()
  })

  it('renderiza campos de select corretamente', () => {
    render(<TemplateSelector {...defaultProps} selectedTemplate="wifi" />)
    
    const securitySelect = screen.getByLabelText('Segurança')
    expect(securitySelect).toBeInTheDocument()
    expect(securitySelect).toHaveValue('')
  })

  it('aplica estilos de dark mode corretamente', () => {
    render(<TemplateSelector {...defaultProps} darkMode={true} selectedTemplate="wifi" />)
    
    const ssidInput = screen.getByLabelText('Nome da Rede (SSID)')
    expect(ssidInput).toHaveStyle({ background: '#1e293b' })
  })

  it('destaca template selecionado visualmente', () => {
    render(<TemplateSelector {...defaultProps} selectedTemplate="url" />)
    
    const urlButton = screen.getByText('URL').closest('button')
    expect(urlButton).toHaveStyle({ border: '2px solid #3b82f6' })
  })
}) 