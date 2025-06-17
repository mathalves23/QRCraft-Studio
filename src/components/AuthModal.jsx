import React, { useState } from 'react';
import { sendVerificationEmail } from '../services/emailService';

const AuthModal = ({ isOpen, onClose, onLogin, darkMode }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email e senha são obrigatórios');
      return false;
    }

    if (!isLoginMode) {
      if (!formData.name) {
        setError('Nome é obrigatório');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Senhas não coincidem');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Senha deve ter pelo menos 6 caracteres');
        return false;
      }
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

    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isLoginMode) {
        let users = JSON.parse(localStorage.getItem('qrcraft-users') || '[]');
        
        // Verificar se é login demo e criar usuário demo se não existir
        if (formData.email === 'demo@qrcraft.com' && formData.password === 'demo123') {
          let demoUser = users.find(u => u.email === 'demo@qrcraft.com');
          
          if (!demoUser) {
            console.log('🚀 Criando usuário demo PRO automaticamente...');
            // Criar usuário demo automaticamente
            demoUser = {
              id: 'demo-user-pro-id',
              name: 'Demo PRO User',
              email: 'demo@qrcraft.com',
              password: 'demo123',
              plan: 'pro', // Plano PRO com todos os recursos
              planExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano
              qrCodesGenerated: 152, // Histórico de uso
              monthlyUsage: 0, // Reset para teste
              lastUsageReset: new Date().toISOString(),
              createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 meses atrás
              lastLogin: new Date().toISOString(),
              preferences: {
                defaultTemplate: 'url',
                defaultSize: '512',
                defaultFormat: 'png',
                autoGenerate: true,
                darkMode: false
              }
            };
            
            users.push(demoUser);
            localStorage.setItem('qrcraft-users', JSON.stringify(users));
            console.log('✅ Usuário Demo PRO criado com sucesso! 👑 Todos os recursos disponíveis.');
          } else {
            console.log('✅ Usuário Demo PRO encontrado! Fazendo login...');
            // Atualizar último login
            demoUser.lastLogin = new Date().toISOString();
            const userIndex = users.findIndex(u => u.email === 'demo@qrcraft.com');
            if (userIndex !== -1) {
              users[userIndex] = demoUser;
              localStorage.setItem('qrcraft-users', JSON.stringify(users));
            }
          }
        }
        
        // Verificar se é usuário admin/teste
        if (formData.email === 'admin@qrcraft.com' && formData.password === 'admin123') {
          let adminUser = users.find(u => u.email === 'admin@qrcraft.com');
          
          if (!adminUser) {
            console.log('🔥 Criando usuário ADMIN PRO automaticamente...');
            adminUser = {
              id: 'admin-user-pro-id',
              name: 'Admin QRCraft Studio',
              email: 'admin@qrcraft.com',
              password: 'admin123',
              plan: 'pro',
              planExpiry: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 10 anos
              qrCodesGenerated: 999,
              monthlyUsage: 0,
              lastUsageReset: new Date().toISOString(),
              createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano atrás
              lastLogin: new Date().toISOString(),
              isAdmin: true,
              preferences: {
                defaultTemplate: 'custom',
                defaultSize: '1024',
                defaultFormat: 'svg',
                autoGenerate: true,
                darkMode: true
              }
            };
            
            users.push(adminUser);
            localStorage.setItem('qrcraft-users', JSON.stringify(users));
            console.log('✅ Usuário ADMIN PRO criado! 🔥 Acesso total ao sistema.');
          } else {
            console.log('✅ Usuário ADMIN PRO encontrado! Fazendo login...');
            adminUser.lastLogin = new Date().toISOString();
            const userIndex = users.findIndex(u => u.email === 'admin@qrcraft.com');
            if (userIndex !== -1) {
              users[userIndex] = adminUser;
              localStorage.setItem('qrcraft-users', JSON.stringify(users));
            }
          }
        }
        
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        
        if (!user) {
          setError('Email ou senha incorretos');
          setIsLoading(false);
          return;
        }

        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          planExpiry: user.planExpiry,
          qrCodesGenerated: user.qrCodesGenerated || 0,
          monthlyUsage: user.monthlyUsage || 0,
          lastUsageReset: user.lastUsageReset || new Date().toISOString()
        };

        localStorage.setItem('qrcraft-currentUser', JSON.stringify(userData));
        onLogin(userData);
        
      } else {
        const users = JSON.parse(localStorage.getItem('qrcraft-users') || '[]');
        
        if (users.find(u => u.email === formData.email)) {
          setError('Email já cadastrado');
          setIsLoading(false);
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          password: formData.password,
          plan: 'standard',
          planExpiry: null,
          qrCodesGenerated: 0,
          monthlyUsage: 0,
          lastUsageReset: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          emailVerified: false, // Novo campo para verificação
          emailVerifiedAt: null
        };

        users.push(newUser);
        localStorage.setItem('qrcraft-users', JSON.stringify(users));

        // Enviar email de verificação
        const emailResult = await sendVerificationEmail(newUser);
        
        if (emailResult.success) {
          console.log('📧 Email de verificação enviado com sucesso!');
          // Em desenvolvimento, mostrar URL no console
          if (emailResult.verificationUrl) {
            console.log('🔗 URL de verificação (desenvolvimento):', emailResult.verificationUrl);
          }
        } else {
          console.error('❌ Falha ao enviar email de verificação:', emailResult.error);
        }

        const userData = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          plan: newUser.plan,
          planExpiry: newUser.planExpiry,
          qrCodesGenerated: newUser.qrCodesGenerated,
          monthlyUsage: newUser.monthlyUsage,
          lastUsageReset: newUser.lastUsageReset,
          emailVerified: newUser.emailVerified,
          emailVerifiedAt: newUser.emailVerifiedAt
        };

        localStorage.setItem('qrcraft-currentUser', JSON.stringify(userData));
        onLogin(userData);
      }

    } catch (error) {
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };



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
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading 
                ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}
          >
            {isLoading ? (
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
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>✨ Conta Standard (Gratuita):</div>
              <div>• 10 QR Codes por mês</div>
              <div>• Apenas URLs/Links</div>
              <div>• Histórico limitado</div>
              <div style={{ marginTop: '0.5rem', fontWeight: '600', color: '#3b82f6' }}>
                🚀 Upgrade para PRO por apenas R$ 20/ano!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal; 