import { renderHook } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useIsMobile } from '../use-mobile'

// Mock do window.matchMedia
const mockMatchMedia = (matches) => ({
  matches,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
})

describe('useIsMobile', () => {
  let originalInnerWidth
  let originalMatchMedia

  beforeEach(() => {
    originalInnerWidth = window.innerWidth
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    window.innerWidth = originalInnerWidth
    window.matchMedia = originalMatchMedia
    vi.clearAllMocks()
  })

  it('deve retornar true para telas menores que 768px', () => {
    window.innerWidth = 500
    window.matchMedia = vi.fn().mockReturnValue(mockMatchMedia(true))

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('deve retornar false para telas maiores ou iguais a 768px', () => {
    window.innerWidth = 1024
    window.matchMedia = vi.fn().mockReturnValue(mockMatchMedia(false))

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('deve usar fallback quando matchMedia não é suportado', () => {
    window.innerWidth = 500
    window.matchMedia = null

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('deve usar fallback quando matchMedia.addEventListener não existe', () => {
    window.innerWidth = 500
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      // Sem addEventListener
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('deve configurar listeners corretamente', () => {
    window.innerWidth = 500
    const mockMql = mockMatchMedia(true)
    window.matchMedia = vi.fn().mockReturnValue(mockMql)

    renderHook(() => useIsMobile())

    expect(mockMql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('deve limpar listeners no cleanup', () => {
    window.innerWidth = 500
    const mockMql = mockMatchMedia(true)
    window.matchMedia = vi.fn().mockReturnValue(mockMql)

    const { unmount } = renderHook(() => useIsMobile())

    unmount()

    expect(mockMql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('deve lidar com erro na limpeza dos listeners', () => {
    window.innerWidth = 500
    const mockMql = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(() => {
        throw new Error('Erro na limpeza')
      })
    }
    window.matchMedia = vi.fn().mockReturnValue(mockMql)

    const { unmount } = renderHook(() => useIsMobile())

    // Não deve lançar erro
    expect(() => unmount()).not.toThrow()
  })

  it('deve lidar com erro ao acessar window.innerWidth', () => {
    // Mock window.innerWidth para lançar erro
    Object.defineProperty(window, 'innerWidth', {
      get: vi.fn(() => {
        throw new Error('innerWidth não disponível')
      }),
      configurable: true
    })

    window.matchMedia = vi.fn().mockReturnValue(mockMatchMedia(false))

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })
}) 