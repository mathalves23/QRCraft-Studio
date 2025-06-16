import React, { useState } from 'react';
import PaymentHistory from './PaymentHistory';

const UserProfile = ({ isOpen, onClose, user, onUpdate, darkMode, showNotification }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validações
      if (!formData.name.trim()) {
        showNotification('Nome é obrigatório', 'error');
        return;
      }

      if (showPasswordFields) {
        if (!formData.currentPassword) {
          showNotification('Senha atual é obrigatória', 'error');
          return;
        }
        if (formData.newPassword.length < 6) {
          showNotification('Nova senha deve ter pelo menos 6 caracteres', 'error');
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          showNotification('Nova senha e confirmação não coincidem', 'error');
          return;
        }
      }

      // Simular atualização do perfil
      const updatedUser = {
        ...user,
        name: formData.name.trim(),
        lastUpdated: new Date().toISOString()
      };

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      onUpdate(updatedUser);
      showNotification(
        showPasswordFields ? 'Perfil e senha atualizados com sucesso!' : 'Perfil atualizado com sucesso!', 
        'success'
      );
      
      // Limpar campos de senha
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setShowPasswordFields(false);
      onClose();

    } catch (error) {
      showNotification('Erro ao atualizar perfil. Tente novamente.', 'error');
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
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: darkMode ? '#1e293b' : '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        border: darkMode ? '1px solid #475569' : '1px solid #e5e7eb',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#3b82f6',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: darkMode ? '#f1f5f9' : '#1f2937',
                margin: 0
              }}>
                Meu Perfil
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: darkMode ? '#94a3b8' : '#6b7280',
                margin: 0
              }}>
                Gerencie suas informações pessoais
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: darkMode ? '#94a3b8' : '#6b7280',
              padding: '0.5rem',
              borderRadius: '8px'
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Informações básicas */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: darkMode ? '#f1f5f9' : '#374151',
              marginBottom: '0.5rem'
            }}>
              Nome completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: darkMode ? '1px solid #475569' : '1px solid #d1d5db',
                background: darkMode ? '#374151' : '#ffffff',
                color: darkMode ? '#f1f5f9' : '#1f2937',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
              placeholder="Digite seu nome completo"
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: darkMode ? '#f1f5f9' : '#374151',
              marginBottom: '0.5rem'
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: darkMode ? '1px solid #475569' : '1px solid #d1d5db',
                background: darkMode ? '#2d3748' : '#f9fafb',
                color: darkMode ? '#94a3b8' : '#6b7280',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
                cursor: 'not-allowed'
              }}
            />
            <p style={{
              fontSize: '0.75rem',
              color: darkMode ? '#94a3b8' : '#6b7280',
              margin: '0.25rem 0 0 0'
            }}>
              O email não pode ser alterado
            </p>
          </div>

          {/* Plano atual */}
          <div style={{
            background: darkMode ? '#374151' : '#f9fafb',
            borderRadius: '12px',
            padding: '1rem',
            border: darkMode ? '1px solid #475569' : '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{
                background: user.plan === 'pro' ? '#f59e0b' : '#6b7280',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                {user.plan === 'pro' ? '👑 PRO' : '📦 STANDARD'}
              </div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: darkMode ? '#f1f5f9' : '#374151'
              }}>
                Plano atual
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              {user.plan === 'standard' && (
                <p style={{
                  fontSize: '0.75rem',
                  color: darkMode ? '#94a3b8' : '#6b7280',
                  margin: 0
                }}>
                  {user.monthlyUsage || 0}/10 QR Codes este mês
                </p>
              )}
              
              {user.plan === 'pro' && user.paymentHistory && user.paymentHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPaymentHistory(true)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  💳 Histórico de Pagamentos
                </button>
              )}
            </div>
          </div>

          {/* Seção de senha */}
          <div style={{
            borderTop: darkMode ? '1px solid #475569' : '1px solid #e5e7eb',
            paddingTop: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: darkMode ? '#f1f5f9' : '#1f2937',
                margin: 0
              }}>
                Alterar Senha
              </h3>
              <button
                type="button"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                style={{
                  background: 'none',
                  border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
                  borderRadius: '8px',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.75rem',
                  color: darkMode ? '#94a3b8' : '#6b7280',
                  cursor: 'pointer'
                }}
              >
                {showPasswordFields ? 'Cancelar' : 'Alterar'}
              </button>
            </div>

            {showPasswordFields && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: darkMode ? '#f1f5f9' : '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Senha atual
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: darkMode ? '1px solid #475569' : '1px solid #d1d5db',
                      background: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#f1f5f9' : '#1f2937',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Digite sua senha atual"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: darkMode ? '#f1f5f9' : '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Nova senha
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: darkMode ? '1px solid #475569' : '1px solid #d1d5db',
                      background: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#f1f5f9' : '#1f2937',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Digite sua nova senha (mín. 6 caracteres)"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: darkMode ? '#f1f5f9' : '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Confirmar nova senha
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: darkMode ? '1px solid #475569' : '1px solid #d1d5db',
                      background: darkMode ? '#374151' : '#ffffff',
                      color: darkMode ? '#f1f5f9' : '#1f2937',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Confirme sua nova senha"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: darkMode ? '1px solid #475569' : '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: darkMode ? '1px solid #475569' : '1px solid #d1d5db',
                background: 'transparent',
                color: darkMode ? '#94a3b8' : '#6b7280',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: isLoading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isLoading && (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              )}
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Histórico de Pagamentos */}
      <PaymentHistory
        user={user}
        darkMode={darkMode}
        isOpen={showPaymentHistory}
        onClose={() => setShowPaymentHistory(false)}
      />
    </div>
  );
};

export default UserProfile; 