import { useState, useEffect, useContext, createContext } from 'react'
import { supabase, authHelpers } from '../lib/supabase'

// Context para autenticação
const AuthContext = createContext({})

// Provider do contexto de autenticação
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar sessão existente
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erro ao obter sessão:', error)
          setError(error.message)
        } else if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
        }
      } catch (err) {
        console.error('Erro ao verificar sessão:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        
        setLoading(false)
        setError(null)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Carregar perfil do usuário
  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // Not found is OK for new users
        console.error('Erro ao carregar perfil:', error)
        setError(error.message)
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Erro ao carregar perfil:', err)
      setError(err.message)
    }
  }

  // Função de registro
  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await authHelpers.signUp(email, password, userData)
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      return { 
        success: true, 
        message: 'Conta criada! Verifique seu email para ativar a conta.',
        needsVerification: true
      }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao criar conta'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Função de login
  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await authHelpers.signIn(email, password)
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      return { success: true, message: 'Login realizado com sucesso!' }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao fazer login'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Função de logout
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await authHelpers.signOut()
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      setUser(null)
      setProfile(null)
      return { success: true, message: 'Logout realizado com sucesso!' }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao fazer logout'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Reset de senha
  const resetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await authHelpers.resetPassword(email)
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      return { 
        success: true, 
        message: 'Email de recuperação enviado! Verifique sua caixa de entrada.' 
      }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao enviar email de recuperação'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Atualizar perfil
  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      setError(null)

      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      setProfile(data)
      return { success: true, message: 'Perfil atualizado com sucesso!' }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao atualizar perfil'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Verificar se usuário pode gerar QR Code (rate limiting)
  const canGenerateQR = () => {
    if (!profile) return false
    
    if (profile.plan === 'pro') return true
    
    const monthlyLimit = 10
    return (profile.monthly_usage || 0) < monthlyLimit
  }

  // Incrementar uso mensal
  const incrementUsage = async () => {
    if (!user || !profile) return

    try {
      const { error } = await supabase
        .from('users')
        .update({
          monthly_usage: (profile.monthly_usage || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Erro ao incrementar uso:', error)
      } else {
        setProfile(prev => ({
          ...prev,
          monthly_usage: (prev.monthly_usage || 0) + 1
        }))
      }
    } catch (err) {
      console.error('Erro ao incrementar uso:', err)
    }
  }

  // Upgrade para plano PRO
  const upgradeToPro = async (paymentData) => {
    try {
      setLoading(true)
      setError(null)

      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      // Aqui você integraria com o sistema de pagamento
      // Por enquanto, vamos simular o upgrade
      const expiryDate = new Date()
      expiryDate.setFullYear(expiryDate.getFullYear() + 1)

      const { data, error } = await supabase
        .from('users')
        .update({
          plan: 'pro',
          plan_expiry: expiryDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }

      setProfile(data)
      return { success: true, message: 'Upgrade para PRO realizado com sucesso!' }
    } catch (err) {
      const errorMessage = err.message || 'Erro ao fazer upgrade'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    canGenerateQR,
    incrementUsage,
    upgradeToPro,
    isAuthenticated: !!user,
    isPro: profile?.plan === 'pro',
    remainingQRs: profile?.plan === 'pro' ? Infinity : Math.max(0, 10 - (profile?.monthly_usage || 0))
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  
  return context
}

// Hook para proteger rotas
export function useRequireAuth() {
  const auth = useAuth()
  
  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      // Redirecionar para login ou mostrar modal
      console.warn('Usuário não autenticado tentando acessar rota protegida')
    }
  }, [auth.loading, auth.isAuthenticated])
  
  return auth
}

export default useAuth 