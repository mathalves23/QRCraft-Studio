import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const AuthModal = ({ isOpen, onClose, darkMode }) => {
  const { signIn, signUp, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email e senha são obrigatórios');
      return false;
    }

    if (!isLoginMode && !formData.name) {
      setError('Nome é obrigatório');
      return false;
    }

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setError('');

    try {
      if (isLoginMode) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setError(error.message || 'Erro ao fazer login');
          return;
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          setError(error.message || 'Erro ao criar conta');
          return;
        }
      }
      
      // Close modal on success
      onClose();
      setFormData({ email: '', password: '', name: '', confirmPassword: '' });
      
    } catch (error) {
      console.error('Erro de autenticação:', error);
      setError('Erro interno. Tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div style={{
        background: darkMode ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '2.5rem',
        border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '450px',
        width: '100%',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: darkMode ? '#9ca3af' : '#6b7280',
            padding: '0.5rem'
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem'
          }}>
            🏭
          </div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: darkMode ? '#f1f5f9' : '#1f2937',
            marginBottom: '0.5rem'
          }}>
            {isLoginMode ? 'Entrar no QRCraft' : 'Criar Conta'}
          </h2>
          <p style={{
            color: darkMode ? '#94a3b8' : '#6b7280',
            fontSize: '0.95rem'
          }}>
            {isLoginMode 
              ? 'Entre para acessar seus QR Codes salvos' 
              : 'Comece gratuitamente e upgrade quando precisar'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLoginMode && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: darkMode ? '#cbd5e1' : '#374151',
                marginBottom: '0.5rem'
              }}>
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Digite seu nome completo"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: `2px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  color: darkMode ? '#f1f5f9' : '#374151',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>
          )}

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: darkMode ? '#cbd5e1' : '#374151',
              marginBottom: '0.5rem'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: `2px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
                borderRadius: '12px',
                fontSize: '1rem',
                background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                color: darkMode ? '#f1f5f9' : '#374151',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: darkMode ? '#cbd5e1' : '#374151',
              marginBottom: '0.5rem'
            }}>
              Senha
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: `2px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
                borderRadius: '12px',
                fontSize: '1rem',
                background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                color: darkMode ? '#f1f5f9' : '#374151',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>

          {!isLoginMode && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: darkMode ? '#cbd5e1' : '#374151',
                marginBottom: '0.5rem'
              }}>
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirme sua senha"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: `2px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  color: darkMode ? '#f1f5f9' : '#374151',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#dc2626',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading 
                ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                {isLoginMode ? 'Entrando...' : 'Criando conta...'}
              </>
            ) : (
              <>
                {isLoginMode ? '🔓 Entrar' : '🚀 Criar Conta Gratuita'}
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{
            color: darkMode ? '#94a3b8' : '#6b7280',
            fontSize: '0.9rem'
          }}>
            {isLoginMode ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
                setFormData({ email: '', password: '', name: '', confirmPassword: '' });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontWeight: '600',
                marginLeft: '0.5rem'
              }}
            >
              {isLoginMode ? 'Criar conta gratuita' : 'Fazer login'}
            </button>
          </p>
        </div>

        {!isLoginMode && (
          <div style={{
            background: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
            border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.5)'}`,
            borderRadius: '12px',
            padding: '1rem',
            marginTop: '1.5rem'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: darkMode ? '#cbd5e1' : '#6b7280',
              lineHeight: '1.5'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>✨ Conta Gratuita:</div>
              <div>• QR Codes ilimitados</div>
              <div>• Todos os templates</div>
              <div>• Histórico completo</div>
              <div style={{ marginTop: '0.5rem', fontWeight: '600', color: '#3b82f6' }}>
                🎉 Totalmente gratuito com Supabase!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal; 