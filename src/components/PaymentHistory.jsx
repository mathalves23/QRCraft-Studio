import React, { useState } from 'react';

const PaymentHistory = ({ user, darkMode, isOpen, onClose }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  if (!isOpen) return null;

  const paymentHistory = user?.paymentHistory || [];

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'pix': return '🔗';
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'elo': return '💳';
      case 'credit_card': return '💳';
      default: return '💰';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'pending': return 'Pendente';
      case 'rejected': return 'Rejeitado';
      default: return 'Desconhecido';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '24px',
        padding: '2rem',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: darkMode 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: darkMode 
          ? '1px solid rgba(71, 85, 105, 0.5)' 
          : '1px solid rgba(229, 231, 235, 0.8)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '1.875rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              💳 Histórico de Pagamentos
            </h2>
            <p style={{
              margin: '0.5rem 0 0 0',
              color: darkMode ? '#94a3b8' : '#6b7280',
              fontSize: '0.875rem'
            }}>
              Todas as suas transações e upgrades de plano
            </p>
          </div>
          
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: darkMode ? '#94a3b8' : '#6b7280',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s'
            }}
          >
            ✕
          </button>
        </div>

        {/* Resumo */}
        {paymentHistory.length > 0 && (
          <div style={{
            background: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(248, 250, 252, 0.8)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: darkMode 
              ? '1px solid rgba(71, 85, 105, 0.5)' 
              : '1px solid rgba(229, 231, 235, 0.8)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: darkMode ? '#e2e8f0' : '#1f2937',
              marginBottom: '1rem'
            }}>
              📊 Resumo
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: darkMode ? '#94a3b8' : '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Total pago
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  {formatCurrency(
                    paymentHistory
                      .filter(p => p.status === 'approved')
                      .reduce((sum, p) => sum + p.amount, 0)
                  )}
                </div>
              </div>
              
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: darkMode ? '#94a3b8' : '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Transações
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: darkMode ? '#e2e8f0' : '#1f2937'
                }}>
                  {paymentHistory.length}
                </div>
              </div>
              
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: darkMode ? '#94a3b8' : '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Último pagamento
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: darkMode ? '#e2e8f0' : '#1f2937'
                }}>
                  {paymentHistory.length > 0 
                    ? formatDate(paymentHistory[0].date).split(' ')[0]
                    : 'Nunca'
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Pagamentos */}
        {paymentHistory.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: darkMode ? '#94a3b8' : '#6b7280'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💳</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: darkMode ? '#e2e8f0' : '#1f2937'
            }}>
              Nenhuma transação ainda
            </h3>
            <p>
              Quando você fizer upgrade para PRO ou renovar seu plano,
              o histórico aparecerá aqui.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                onClick={() => setSelectedPayment(payment)}
                style={{
                  background: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: darkMode 
                    ? '1px solid rgba(71, 85, 105, 0.5)' 
                    : '1px solid rgba(229, 231, 235, 0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  hover: {
                    transform: 'translateY(-2px)',
                    boxShadow: darkMode 
                      ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                      : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = darkMode 
                    ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                    : '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{ fontSize: '1.5rem' }}>
                      {getPaymentMethodIcon(payment.method)}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: darkMode ? '#e2e8f0' : '#1f2937',
                        marginBottom: '0.25rem'
                      }}>
                        {formatCurrency(payment.amount)}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: darkMode ? '#94a3b8' : '#6b7280'
                      }}>
                        {payment.plan.toUpperCase()} - {payment.duration}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      background: getStatusColor(payment.status),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {getStatusText(payment.status)}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: darkMode ? '#94a3b8' : '#6b7280'
                    }}>
                      {formatDate(payment.date)}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.875rem',
                  color: darkMode ? '#94a3b8' : '#6b7280'
                }}>
                  <div>
                    ID: {payment.id.slice(0, 16)}...
                  </div>
                  <div>
                    👆 Clique para ver detalhes
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalhes do Pagamento */}
        {selectedPayment && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}>
            <div style={{
              background: darkMode ? '#1e293b' : '#ffffff',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: darkMode ? '#e2e8f0' : '#1f2937'
                }}>
                  Detalhes da Transação
                </h3>
                <button
                  onClick={() => setSelectedPayment(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    color: darkMode ? '#94a3b8' : '#6b7280'
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                fontSize: '0.875rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.5)'}`
                }}>
                  <span style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>ID da Transação:</span>
                  <span style={{ color: darkMode ? '#e2e8f0' : '#1f2937', fontFamily: 'monospace' }}>
                    {selectedPayment.id}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.5)'}`
                }}>
                  <span style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>Valor:</span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>
                    {formatCurrency(selectedPayment.amount)}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.5)'}`
                }}>
                  <span style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>Método:</span>
                  <span style={{ color: darkMode ? '#e2e8f0' : '#1f2937' }}>
                    {getPaymentMethodIcon(selectedPayment.method)} {selectedPayment.method.toUpperCase()}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.5)'}`
                }}>
                  <span style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>Status:</span>
                  <div style={{
                    background: getStatusColor(selectedPayment.status),
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {getStatusText(selectedPayment.status)}
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.5)'}`
                }}>
                  <span style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>Data:</span>
                  <span style={{ color: darkMode ? '#e2e8f0' : '#1f2937' }}>
                    {formatDate(selectedPayment.date)}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0'
                }}>
                  <span style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>Plano:</span>
                  <span style={{ color: darkMode ? '#e2e8f0' : '#1f2937', fontWeight: '600' }}>
                    {selectedPayment.plan.toUpperCase()} ({selectedPayment.duration})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory; 