import React, { useState } from 'react';
import PaymentModal from './PaymentModal';

const PlanManager = ({ isOpen, user, onPlanUpdate, onClose, darkMode, showNotification }) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const planFeatures = {
    standard: {
      name: 'Standard',
      price: 'Gratuito',
      color: '#6b7280',
      features: [
        '10 QR Codes por mês',
        'Apenas URLs/Links',
        'Histórico limitado (5 itens)',
        'Formato PNG apenas',
        'Suporte por email'
      ],
      limitations: [
        'Sem texto personalizado',
        'Sem templates avançados (WiFi, vCard, etc.)',
        'Sem geração em lote',
        'Sem múltiplos formatos',
        'Sem scanner QR'
      ]
    },
    pro: {
      name: 'PRO',
      price: 'R$ 20/ano',
      color: '#f59e0b',
      features: [
        'QR Codes ilimitados',
        'Todos os templates (WiFi, vCard, SMS, etc.)',
        'Histórico completo',
        'Múltiplos formatos (PNG, SVG, PDF)',
        'Geração em lote',
        'Scanner de QR Code',
        'Preview em tempo real',
        'Prioridade no suporte',
        'Sem anúncios',
        'Backup na nuvem'
      ],
      limitations: []
    }
  };

  const getUsageStatus = () => {
    if (!user) return { used: 0, remaining: 0, limit: 0 };
    
    const monthlyLimit = user.plan === 'standard' ? 10 : Infinity;
    const used = user.monthlyUsage || 0;
    const remaining = user.plan === 'standard' ? Math.max(0, monthlyLimit - used) : Infinity;
    
    return { used, remaining, limit: monthlyLimit };
  };

  const isFeatureAvailable = (feature) => {
    if (!user) return false;
    if (user.plan === 'pro') return true;
    
    const standardFeatures = [
      'custom-qr',
      'url-template', 
      'basic-download',
      'basic-colors',
      'basic-sizes'
    ];
    
    return standardFeatures.includes(feature);
  };

  const handleUpgradeClick = () => {
    if (!user) {
      showNotification('Erro: usuário não encontrado!', 'error');
      return;
    }
    if (user.plan === 'pro') {
      showNotification('Você já é um usuário PRO!', 'info');
      return;
    }
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (updatedUser) => {
    onPlanUpdate(updatedUser);
    setIsPaymentOpen(false);
  };



  const usage = getUsageStatus();

  if (!isOpen) return null;

  if (isPaymentOpen) {
    return (
      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        user={user}
        onPaymentSuccess={handlePaymentSuccess}
        darkMode={darkMode}
        showNotification={showNotification}
      />
    );
  }

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
        padding: '2rem',
        border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: darkMode ? '#f1f5f9' : '#1f2937',
            margin: 0
          }}>
            🏆 Gerenciar Plano
          </h2>
          
          <button
            onClick={onClose}
            style={{
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
        </div>

        <div style={{
          background: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
          border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.5)'}`,
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: darkMode ? '#f1f5f9' : '#1f2937',
            marginBottom: '1rem'
          }}>
            📊 Uso atual
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <div style={{
                fontSize: '0.875rem',
                color: darkMode ? '#94a3b8' : '#6b7280',
                marginBottom: '0.25rem'
              }}>
                Plano atual
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: user.plan === 'pro' ? '#f59e0b' : '#6b7280'
              }}>
                {planFeatures[user.plan].name}
              </div>
            </div>
            
            <div>
              <div style={{
                fontSize: '0.875rem',
                color: darkMode ? '#94a3b8' : '#6b7280',
                marginBottom: '0.25rem'
              }}>
                QR Codes este mês
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: user.plan === 'standard' && usage.used >= usage.limit 
                  ? '#ef4444' 
                  : darkMode ? '#f1f5f9' : '#1f2937'
              }}>
                {usage.used} / {user.plan === 'standard' ? usage.limit : '∞'}
              </div>
            </div>
            
            {user.plan === 'pro' && user.planExpiry && (
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: darkMode ? '#94a3b8' : '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Renovação
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: darkMode ? '#f1f5f9' : '#1f2937'
                }}>
                  {new Date(user.planExpiry).toLocaleDateString('pt-BR')}
                </div>
              </div>
            )}
          </div>
          
          {user.plan === 'standard' && usage.used >= usage.limit && (
            <div style={{
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '1rem',
              color: '#dc2626',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              ⚠️ Você atingiu o limite de QR Codes do plano Standard. Faça upgrade para continuar gerando!
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {Object.entries(planFeatures).map(([planKey, plan]) => (
            <div
              key={planKey}
              style={{
                background: user.plan === planKey
                  ? `linear-gradient(135deg, ${plan.color}15, ${plan.color}10)`
                  : darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                border: user.plan === planKey 
                  ? `2px solid ${plan.color}`
                  : `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.5)'}`,
                borderRadius: '20px',
                padding: '2rem',
                position: 'relative'
              }}
            >
              {user.plan === planKey && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: plan.color,
                  color: 'white',
                  padding: '0.25rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  ATUAL
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: plan.color,
                  marginBottom: '0.5rem'
                }}>
                  {plan.name}
                </h3>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: darkMode ? '#f1f5f9' : '#1f2937'
                }}>
                  {plan.price}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: darkMode ? '#f1f5f9' : '#1f2937',
                  marginBottom: '0.75rem'
                }}>
                  ✅ Incluído:
                </h4>
                {plan.features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      color: darkMode ? '#cbd5e1' : '#6b7280'
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✓</span>
                    {feature}
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: darkMode ? '#f1f5f9' : '#1f2937',
                    marginBottom: '0.75rem'
                  }}>
                    ❌ Limitações:
                  </h4>
                  {plan.limitations.map((limitation, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        color: darkMode ? '#94a3b8' : '#9ca3af'
                      }}
                    >
                      <span style={{ color: '#ef4444' }}>✗</span>
                      {limitation}
                    </div>
                  ))}
                </div>
              )}

              {planKey === 'pro' && user.plan !== 'pro' && (
                <button
                  onClick={handleUpgradeClick}
                  style={{
                    width: '100%',
                    background: `linear-gradient(135deg, ${plan.color}, #f97316)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  🚀 Fazer Upgrade
                </button>
              )}

              {planKey === 'pro' && user.plan === 'pro' && (
                <div style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  ✅ Plano Ativo
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Pagamento */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        user={user}
        onPaymentSuccess={handlePaymentSuccess}
        darkMode={darkMode}
        showNotification={showNotification}
      />
    </div>
  );
};

export default PlanManager; 