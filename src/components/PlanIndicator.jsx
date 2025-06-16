import React, { useState } from 'react';

const PlanIndicator = ({ user, onUpgradeClick, darkMode, analytics }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!user) return null;

  const getUsageStatus = () => {
    const monthlyLimit = user.plan === 'standard' ? 10 : Infinity;
    const used = user.monthlyUsage || 0;
    const remaining = user.plan === 'standard' ? Math.max(0, monthlyLimit - used) : Infinity;
    const percentage = user.plan === 'standard' ? (used / monthlyLimit) * 100 : 0;
    
    return { used, remaining, limit: monthlyLimit, percentage };
  };

  const isFeatureLocked = (feature) => {
    if (user.plan === 'pro') return false;
    
    const proFeatures = [
      'batch-generation',
      'advanced-templates',
      'multiple-formats',
      'qr-scanner',
      'unlimited-history'
    ];
    
    return proFeatures.includes(feature);
  };

  const usage = getUsageStatus();

  return (
    <div style={{
      position: 'fixed',
      top: '5rem',
      right: '1rem',
      background: darkMode 
        ? 'rgba(15, 23, 42, 0.95)' 
        : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
      borderRadius: '16px',
      padding: isExpanded ? '1rem' : '0.75rem',
      minWidth: isExpanded ? '280px' : 'auto',
      maxWidth: isExpanded ? '320px' : '200px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      zIndex: 50,
      transition: 'all 0.3s ease'
    }}>
      {/* Clickable Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: isExpanded ? '1rem' : '0'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            background: user.plan === 'pro' ? '#f59e0b' : '#6b7280',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {user.plan === 'pro' ? '👑 PRO' : '📦 STANDARD'}
          </div>
          
          <div style={{
            fontSize: '0.875rem',
            color: darkMode ? '#cbd5e1' : '#6b7280'
          }}>
            {user.name?.split(' ')[0] || 'Usuário'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {!isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpgradeClick();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: darkMode ? '#94a3b8' : '#9ca3af',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0.25rem'
              }}
              title="Gerenciar plano"
            >
              ⚙️
            </button>
          )}
          
          <div style={{
            fontSize: '0.875rem',
            color: darkMode ? '#94a3b8' : '#9ca3af',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}>
            ▼
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div>
          {/* Settings Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '1rem'
          }}>
            <button
              onClick={onUpgradeClick}
              style={{
                background: 'none',
                border: 'none',
                color: darkMode ? '#94a3b8' : '#9ca3af',
                cursor: 'pointer',
                fontSize: '1.25rem',
                padding: '0.25rem'
              }}
              title="Gerenciar plano"
            >
              ⚙️
            </button>
          </div>

          {/* Usage Meter for Standard Users */}
          {user.plan === 'standard' && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{
                  fontSize: '0.875rem',
                  color: darkMode ? '#cbd5e1' : '#374151',
                  fontWeight: '500'
                }}>
                  QR Codes este mês
                </span>
                <span style={{
                  fontSize: '0.875rem',
                  color: usage.used >= usage.limit ? '#ef4444' : darkMode ? '#94a3b8' : '#6b7280',
                  fontWeight: '600'
                }}>
                  {usage.used}/{usage.limit}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '8px',
                background: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.8)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(usage.percentage, 100)}%`,
                  height: '100%',
                  background: usage.percentage >= 90 
                    ? '#ef4444'
                    : usage.percentage >= 70
                    ? '#f59e0b'
                    : '#10b981',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              
              {usage.used >= usage.limit && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  marginTop: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#dc2626',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  ⚠️ Limite atingido! Faça upgrade para continuar
                </div>
              )}
            </div>
          )}

          {/* PRO Benefits */}
          {user.plan === 'pro' && (
            <div style={{ marginBottom: '1rem' }}>
                          <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.75rem',
                color: '#065f46',
                fontWeight: '500',
                textAlign: 'center'
              }}>
                ✨ QR Codes ilimitados + todas as funcionalidades
              </div>
              
              {user.planExpiry && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: darkMode ? '#94a3b8' : '#6b7280',
                  textAlign: 'center'
                }}>
                  Renovação: {new Date(user.planExpiry).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          )}

          {/* Analytics for logged users */}
          {analytics && (
            <div style={{
              background: darkMode ? 'rgba(51, 65, 85, 0.6)' : 'rgba(248, 250, 252, 0.8)',
              border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.5)'}`,
              borderRadius: '12px',
              padding: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: darkMode ? '#94a3b8' : '#6b7280',
                marginBottom: '0.25rem'
              }}>
                📊 Suas estatísticas
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: darkMode ? '#cbd5e1' : '#374151',
                fontWeight: '600'
              }}>
                {analytics.generated} gerados | {analytics.downloaded} baixados
              </div>
            </div>
          )}

          {/* Quick Upgrade Button for Standard */}
          {user.plan === 'standard' && (
            <button
              onClick={onUpgradeClick}
              style={{
                width: '100%',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              🚀 Upgrade PRO - R$ 20/ano
            </button>
          )}

          {/* Locked Features Alert */}
          {user.plan === 'standard' && (
            <div style={{
              marginTop: '1rem',
              fontSize: '0.75rem',
              color: darkMode ? '#94a3b8' : '#6b7280',
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              🔒 Texto personalizado, templates avançados e geração em lote disponíveis no PRO
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Component for Feature Lock Overlay
export const FeatureLockOverlay = ({ feature, onUpgradeClick, darkMode }) => {
  const featureNames = {
    'batch-generation': 'Geração em Lote',
    'advanced-templates': 'Templates Avançados',
    'multiple-formats': 'Múltiplos Formatos',
    'qr-scanner': 'Scanner de QR Code',
    'unlimited-history': 'Histórico Completo'
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'inherit',
      zIndex: 10
    }}>
      <div style={{
        background: darkMode ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        maxWidth: '300px',
        border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          🔒
        </div>
        
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: darkMode ? '#f1f5f9' : '#1f2937',
          marginBottom: '0.5rem'
        }}>
          {featureNames[feature] || 'Funcionalidade Premium'}
        </h3>
        
        <p style={{
          color: darkMode ? '#94a3b8' : '#6b7280',
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
          lineHeight: '1.5'
        }}>
          Esta funcionalidade está disponível apenas no plano PRO. Faça upgrade por apenas R$ 20/ano!
        </p>
        
        <button
          onClick={onUpgradeClick}
                        style={{
                background: '#f59e0b',
                color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          🚀 Fazer Upgrade
        </button>
      </div>
    </div>
  );
};

export default PlanIndicator; 