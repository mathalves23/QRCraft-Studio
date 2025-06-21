import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => {
      try {
        return window.innerWidth < MOBILE_BREAKPOINT
      } catch (error) {
        // Fallback para ambientes sem window.innerWidth
        return false
      }
    }

    const updateIsMobile = () => {
      setIsMobile(checkIsMobile())
    }

    // Verificação inicial
    updateIsMobile()

    // Configurar listener para mudanças de tamanho
    let mql
    try {
      mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      if (mql && mql.addEventListener) {
        mql.addEventListener("change", updateIsMobile)
      }
    } catch (error) {
      // Fallback para ambientes sem matchMedia
      console.warn('matchMedia não suportado, usando fallback')
    }

    // Fallback adicional com resize listener
    window.addEventListener("resize", updateIsMobile)

    return () => {
      try {
        if (mql && mql.removeEventListener) {
          mql.removeEventListener("change", updateIsMobile)
        }
      } catch (error) {
        // Ignorar erros na limpeza
      }
      window.removeEventListener("resize", updateIsMobile)
    }
  }, [])

  return !!isMobile
} 