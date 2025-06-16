import React, { useState, useEffect } from 'react';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { 
  MERCADOPAGO_CONFIG,
  createPaymentPreference,
  createPixPayment,
  processCardPayment,
  upgradeUserPlan
} from '../utils/mercadoPagoConfig';

const PaymentModal = ({ isOpen, onClose, user, onPaymentSuccess, darkMode, showNotification }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [mercadoPago, setMercadoPago] = useState(null);
  const [cardForm, setCardForm] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [pixData, setPixData] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Produto/Plano PRO (usando configuração centralizada)
  const planDetails = MERCADOPAGO_CONFIG.PRODUCTS.PRO_ANNUAL;

  useEffect(() => {
    if (isOpen) {
      initializeMercadoPago();
    }
  }, [isOpen]);

  const initializeMercadoPago = async () => {
    try {
      console.log('🔧 Inicializando Mercado Pago...', MERCADOPAGO_CONFIG);
      await loadMercadoPago();
      const mp = new window.MercadoPago(MERCADOPAGO_CONFIG.PUBLIC_KEY, { locale: 'pt-BR' });
      setMercadoPago(mp);
      console.log('✅ Mercado Pago inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao carregar Mercado Pago:', error);
      showNotification('Erro ao carregar sistema de pagamento', 'error');
    }
  };

  const createMercadoPagoPreference = async () => {
    try {
      setIsLoading(true);
      
      const response = await createPaymentPreference(user);
      
      if (response.success) {
        setPaymentData(response.data);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      showNotification('Erro ao processar pagamento', 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };



  const processPixPayment = async () => {
    try {
      setProcessing(true);
      
      const response = await createPixPayment(user, planDetails.price);
      
      if (response.success) {
        setPixData(response.data);
        showNotification('PIX gerado com sucesso! Escaneie o QR Code para pagar.', 'success');
        // Pagamento será confirmado via webhook quando o usuário pagar
      } else {
        throw new Error(response.error);
      }
      
    } catch (error) {
      console.error('Erro no PIX:', error);
      showNotification('Erro ao gerar PIX', 'error');
    } finally {
      setProcessing(false);
    }
  };



  const processCreditCardPayment = async (formData) => {
    try {
      setProcessing(true);
      
      const response = await processCardPayment(formData, user, planDetails.price);
      
      if (response.success) {
        handlePaymentSuccess(response.data);
      } else {
        throw new Error(response.error);
      }
      
    } catch (error) {
      console.error('Erro no cartão:', error);
      showNotification(`Pagamento rejeitado: ${error.message}`, 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    console.log('✅ Pagamento aprovado:', paymentResult);
    
    // Usar função centralizada para upgrade
    const updatedUser = upgradeUserPlan(user, paymentResult);
    
    onPaymentSuccess(updatedUser);
    showNotification('🎉 Pagamento aprovado! Bem-vindo ao QRCraft PRO!', 'success');
    onClose();
  };

  const openMercadoPagoCheckout = async () => {
    const preference = await createMercadoPagoPreference();
    if (preference) {
      window.open(preference.init_point, '_blank');
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
        maxWidth: '500px',
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
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              💳 Upgrade para PRO
            </h2>
            <p style={{
              margin: '0.5rem 0 0 0',
              color: darkMode ? '#94a3b8' : '#6b7280',
              fontSize: '0.875rem'
            }}>
              Desbloqueie todas as funcionalidades premium
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

        {/* Plano Details */}
        <div style={{
          background: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(248, 250, 252, 0.8)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: darkMode 
            ? '1px solid rgba(71, 85, 105, 0.5)' 
            : '1px solid rgba(229, 231, 235, 0.8)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: '600',
              color: darkMode ? '#e2e8f0' : '#1f2937'
            }}>
              👑 QRCraft Studio PRO
            </h3>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#f59e0b'
            }}>
              R$ {planDetails.price.toFixed(2)}
            </div>
          </div>
          
          <div style={{
            fontSize: '0.875rem',
            color: darkMode ? '#94a3b8' : '#6b7280',
            marginBottom: '1rem'
          }}>
            {planDetails.description}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: darkMode ? '#cbd5e1' : '#374151'
          }}>
            <div>✅ QR Codes ilimitados</div>
            <div>✅ Todos os templates</div>
            <div>✅ Geração em lote</div>
            <div>✅ Scanner QR Code</div>
            <div>✅ Múltiplos formatos</div>
            <div>✅ Analytics avançado</div>
          </div>
        </div>

        {/* Métodos de Pagamento */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: darkMode ? '#e2e8f0' : '#1f2937',
            marginBottom: '1rem'
          }}>
            💰 Escolha o método de pagamento
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {/* PIX */}
            <button
              onClick={() => setPaymentMethod('pix')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                border: paymentMethod === 'pix' 
                  ? '2px solid #10b981' 
                  : `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 0.8)'}`,
                borderRadius: '12px',
                background: paymentMethod === 'pix'
                  ? 'rgba(16, 185, 129, 0.1)'
                  : (darkMode ? 'rgba(71, 85, 105, 0.3)' : 'white'),
                cursor: 'pointer',
                width: '100%',
                fontSize: '1rem',
                fontWeight: '500',
                color: darkMode ? '#e2e8f0' : '#1f2937',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '1.5rem' }}>🔗</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div>PIX</div>
                <div style={{ fontSize: '0.75rem', color: darkMode ? '#94a3b8' : '#6b7280' }}>
                  Pagamento instantâneo
                </div>
              </div>
              {paymentMethod === 'pix' && (
                <div style={{ color: '#10b981', fontSize: '1.25rem' }}>✓</div>
              )}
            </button>

            {/* Cartão de Crédito */}
            <button
              onClick={() => setPaymentMethod('credit_card')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                border: paymentMethod === 'credit_card' 
                  ? '2px solid #3b82f6' 
                  : `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 0.8)'}`,
                borderRadius: '12px',
                background: paymentMethod === 'credit_card'
                  ? 'rgba(59, 130, 246, 0.1)'
                  : (darkMode ? 'rgba(71, 85, 105, 0.3)' : 'white'),
                cursor: 'pointer',
                width: '100%',
                fontSize: '1rem',
                fontWeight: '500',
                color: darkMode ? '#e2e8f0' : '#1f2937',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '1.5rem' }}>💳</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div>Cartão de Crédito</div>
                <div style={{ fontSize: '0.75rem', color: darkMode ? '#94a3b8' : '#6b7280' }}>
                  Até 12x sem juros
                </div>
              </div>
              {paymentMethod === 'credit_card' && (
                <div style={{ color: '#3b82f6', fontSize: '1.25rem' }}>✓</div>
              )}
            </button>


          </div>
        </div>

        {/* PIX Display */}
        {paymentMethod === 'pix' && pixData && (
          <div style={{
            background: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(248, 250, 252, 0.8)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: darkMode ? '#e2e8f0' : '#1f2937',
              marginBottom: '1rem'
            }}>
              🔗 QR Code PIX
            </h4>
            
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1rem',
              display: 'inline-block'
            }}>
              <img 
                src={`data:image/png;base64,${pixData.qr_code_base64}`}
                alt="QR Code PIX"
                style={{ width: '200px', height: '200px' }}
              />
            </div>
            
            <div style={{
              fontSize: '0.875rem',
              color: darkMode ? '#94a3b8' : '#6b7280',
              marginBottom: '1rem'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                Valor: R$ {pixData.amount.toFixed(2)}
              </div>
              <div>
                Escaneie o QR Code ou copie o código PIX
              </div>
            </div>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(pixData.qr_code);
                showNotification('Código PIX copiado!', 'success');
              }}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              📋 Copiar Código PIX
            </button>
          </div>
        )}

        {/* Botão de Pagamento */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '1rem',
              border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 0.8)'}`,
              borderRadius: '12px',
              background: 'transparent',
              color: darkMode ? '#e2e8f0' : '#374151',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Cancelar
          </button>
          
          <button
            onClick={() => {
              if (paymentMethod === 'pix') {
                processPixPayment();
              } else if (paymentMethod === 'credit_card') {
                // Implementar formulário de cartão real em produção
                showNotification('Cartão de crédito será implementado em breve!', 'info');
              }
            }}
            disabled={processing || isLoading}
            style={{
              flex: 2,
              padding: '1rem',
              border: 'none',
              borderRadius: '12px',
              background: processing || isLoading
                ? (darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(156, 163, 175, 0.5)')
                : 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: processing || isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            {processing || isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Processando...
              </>
            ) : (
              <>
                🚀 Pagar R$ {planDetails.price.toFixed(2)}
              </>
            )}
          </button>
        </div>

        {/* Loading/Processing State */}
        {(processing || isLoading) && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(219, 234, 254, 0.8)',
            border: darkMode ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(147, 197, 253, 0.5)',
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: darkMode ? '#93c5fd' : '#1d4ed8'
          }}>
            {paymentMethod === 'pix' && processing && (
              <>
                ⏳ Aguardando confirmação do PIX...<br />
                <small>Isso pode levar alguns segundos após o pagamento</small>
              </>
            )}
            {paymentMethod === 'credit_card' && processing && (
              '💳 Processando pagamento no cartão...'
            )}
            {isLoading && (
              '🔄 Preparando sistema de pagamento...'
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentModal; 