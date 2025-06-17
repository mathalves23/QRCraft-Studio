import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TemplateSelector from '../TemplateSelector'

// Mock data
const mockTemplates = [
  { id: 'url', name: 'URL', icon: '🌐' },
  { id: 'text', name: 'Texto', icon: '📝' },
  { id: 'email', name: 'Email', icon: '📧' },
  { id: 'wifi', name: 'WiFi', icon: '📶' },
  { id: 'vcard', name: 'vCard', icon: '👤' }
]

describe('TemplateSelector', () => {
  const defaultProps = {
    selectedTemplate: 'url',
    onTemplateChange: vi.fn(),
    templateData: {},
    onTemplateDataChange: vi.fn(),
    darkMode: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render template selector with all templates', () => {
      render(<TemplateSelector {...defaultProps} />)
      
      expect(screen.getByText('🌐')).toBeInTheDocument()
      expect(screen.getByText('📝')).toBeInTheDocument()
      expect(screen.getByText('📧')).toBeInTheDocument()
      expect(screen.getByText('📶')).toBeInTheDocument()
      expect(screen.getByText('👤')).toBeInTheDocument()
    })

    it('should highlight selected template', () => {
      render(<TemplateSelector {...defaultProps} selectedTemplate="email" />)
      
      const emailTemplate = screen.getByText('📧').closest('button')
      expect(emailTemplate).toHaveStyle({
        background: expect.stringContaining('linear-gradient')
      })
    })

    it('should render in dark mode', () => {
      render(<TemplateSelector {...defaultProps} darkMode={true} />)
      
      const container = screen.getByText('🌐').closest('div').parentElement
      expect(container).toHaveStyle({
        background: expect.stringContaining('rgba(15, 23, 42')
      })
    })
  })

  describe('Template Selection', () => {
    it('should call onTemplateChange when template is clicked', async () => {
      const user = userEvent.setup()
      render(<TemplateSelector {...defaultProps} />)
      
      const textTemplate = screen.getByText('📝').closest('button')
      await user.click(textTemplate)
      
      expect(defaultProps.onTemplateChange).toHaveBeenCalledWith('text')
    })

    it('should not call onTemplateChange for already selected template', async () => {
      const user = userEvent.setup()
      render(<TemplateSelector {...defaultProps} selectedTemplate="url" />)
      
      const urlTemplate = screen.getByText('🌐').closest('button')
      await user.click(urlTemplate)
      
      expect(defaultProps.onTemplateChange).not.toHaveBeenCalled()
    })
  })

  describe('Template Forms', () => {
    it('should render URL form when URL template is selected', () => {
      render(<TemplateSelector {...defaultProps} selectedTemplate="url" />)
      
      expect(screen.getByPlaceholderText('Digite ou cole a URL')).toBeInTheDocument()
    })

    it('should render text form when text template is selected', () => {
      render(<TemplateSelector {...defaultProps} selectedTemplate="text" />)
      
      expect(screen.getByPlaceholderText('Digite seu texto personalizado')).toBeInTheDocument()
    })

    it('should render email form when email template is selected', () => {
      render(<TemplateSelector {...defaultProps} selectedTemplate="email" />)
      
      expect(screen.getByPlaceholderText('email@exemplo.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Assunto do email')).toBeInTheDocument()
    })

    it('should render WiFi form when WiFi template is selected', () => {
      render(<TemplateSelector {...defaultProps} selectedTemplate="wifi" />)
      
      expect(screen.getByPlaceholderText('Nome da rede')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Senha da rede')).toBeInTheDocument()
    })

    it('should render vCard form when vCard template is selected', () => {
      render(<TemplateSelector {...defaultProps} selectedTemplate="vcard" />)
      
      expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Sobrenome')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Empresa')).toBeInTheDocument()
    })
  })

  describe('Form Interactions', () => {
    it('should update URL input and call onTemplateDataChange', async () => {
      const user = userEvent.setup()
      render(<TemplateSelector {...defaultProps} selectedTemplate="url" />)
      
      const urlInput = screen.getByPlaceholderText('Digite ou cole a URL')
      await user.type(urlInput, 'https://example.com')
      
      expect(defaultProps.onTemplateDataChange).toHaveBeenCalledWith({
        url: 'https://example.com'
      })
    })

    it('should update email form inputs', async () => {
      const user = userEvent.setup()
      render(<TemplateSelector {...defaultProps} selectedTemplate="email" />)
      
      const emailInput = screen.getByPlaceholderText('email@exemplo.com')
      const subjectInput = screen.getByPlaceholderText('Assunto do email')
      
      await user.type(emailInput, 'test@example.com')
      await user.type(subjectInput, 'Test Subject')
      
      expect(defaultProps.onTemplateDataChange).toHaveBeenCalledWith({
        email: 'test@example.com',
        subject: 'Test Subject'
      })
    })

    it('should update WiFi security type', async () => {
      const user = userEvent.setup()
      render(<TemplateSelector {...defaultProps} selectedTemplate="wifi" />)
      
      const securitySelect = screen.getByDisplayValue('WPA/WPA2')
      await user.selectOptions(securitySelect, 'WEP')
      
      expect(defaultProps.onTemplateDataChange).toHaveBeenCalledWith({
        security: 'WEP'
      })
    })
  })

  describe('Validation', () => {
    it('should show validation error for invalid URL', async () => {
      const user = userEvent.setup()
      render(<TemplateSelector {...defaultProps} selectedTemplate="url" />)
      
      const urlInput = screen.getByPlaceholderText('Digite ou cole a URL')
      await user.type(urlInput, 'invalid-url')
      
      expect(screen.getByText('URL inválida. Use https:// ou http://')).toBeInTheDocument()
    })

    it('should show validation error for invalid email', async () => {
      const user = userEvent.setup()
      render(<TemplateSelector {...defaultProps} selectedTemplate="email" />)
      
      const emailInput = screen.getByPlaceholderText('email@exemplo.com')
      await user.type(emailInput, 'invalid-email')
      
      expect(screen.getByText('Email inválido')).toBeInTheDocument()
    })

    it('should validate required fields', () => {
      render(<TemplateSelector 
        {...defaultProps} 
        selectedTemplate="wifi" 
        templateData={{ ssid: '', password: '' }}
      />)
      
      expect(screen.getByText('Nome da rede é obrigatório')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<TemplateSelector {...defaultProps} />)
      
      const urlTemplate = screen.getByLabelText('Template URL')
      expect(urlTemplate).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<TemplateSelector {...defaultProps} />)
      
      await user.tab()
      const firstTemplate = screen.getByText('🌐').closest('button')
      expect(firstTemplate).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(defaultProps.onTemplateChange).toHaveBeenCalled()
    })
  })
}) 