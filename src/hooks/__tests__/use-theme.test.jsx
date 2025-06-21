import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme, ThemeProvider } from '../use-theme'

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock do matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    
    // Limpa classes do body
    document.body.className = ''
  })

  afterEach(() => {
    document.body.className = ''
  })

  const renderThemeHook = (defaultTheme = 'system') => {
    return renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider defaultTheme={defaultTheme}>
          {children}
        </ThemeProvider>
      )
    })
  }

  it('inicializa com tema system por padrão', () => {
    const { result } = renderThemeHook()
    
    expect(result.current.theme).toBe('system')
  })

  it('carrega tema do localStorage se disponível', () => {
    localStorageMock.getItem.mockReturnValue('dark')
    
    const { result } = renderThemeHook()
    
    expect(result.current.theme).toBe('dark')
  })

  it('alterna entre temas claro e escuro', () => {
    const { result } = renderThemeHook('light')
    
    // Inicia com light
    expect(result.current.theme).toBe('light')
    
    // Alterna para dark
    act(() => {
      result.current.setTheme('dark')
    })
    
    expect(result.current.theme).toBe('dark')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('vite-ui-theme', 'dark')
    
    // Alterna de volta para light
    act(() => {
      result.current.setTheme('light')
    })
    
    expect(result.current.theme).toBe('light')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('vite-ui-theme', 'light')
  })

  it('define tema específico', () => {
    const { result } = renderThemeHook()
    
    act(() => {
      result.current.setTheme('dark')
    })
    
    expect(result.current.theme).toBe('dark')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('vite-ui-theme', 'dark')
  })

  it('salva tema no localStorage', () => {
    const { result } = renderThemeHook()
    
    act(() => {
      result.current.setTheme('dark')
    })
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('vite-ui-theme', 'dark')
  })

  it('detecta preferência do sistema', () => {
    // Mock matchMedia para preferir tema escuro
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query.includes('dark'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    
    const { result } = renderThemeHook('system')
    
    // Deve usar preferência do sistema se não há tema salvo
    expect(result.current.theme).toBe('system')
  })

  it('mantém tema consistente entre renderizações', () => {
    localStorageMock.getItem.mockReturnValue('dark')
    
    const { result: result1 } = renderThemeHook()
    expect(result1.current.theme).toBe('dark')
    
    const { result: result2 } = renderThemeHook()
    expect(result2.current.theme).toBe('dark')
  })

  it('aplica tema ao DOM', () => {
    const { result } = renderThemeHook('dark')
    
    expect(document.documentElement).toHaveClass('dark')
  })

  it('remove classes antigas ao mudar tema', () => {
    // Não simular erro de localStorage
    localStorageMock.setItem.mockImplementation(() => {})
    const { result } = renderThemeHook('light')
    
    expect(document.documentElement).toHaveClass('light')
    
    act(() => {
      result.current.setTheme('dark')
    })
    
    expect(document.documentElement).toHaveClass('dark')
    expect(document.documentElement).not.toHaveClass('light')
  })
}) 