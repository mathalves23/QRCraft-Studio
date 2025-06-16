import React, { useState } from 'react';
import { resendVerificationEmail, isEmailVerified } from '../services/emailService';

const EmailVerificationBanner = ({ user, onUserUpdate, darkMode, showNotification }) => {
  const [isResending, setIsResending] = useState(false);

  // Não mostrar banner se email já estiver verificado
  if (!user || isEmailVerified(user)) {
    return null;
  }

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      const result = await resendVerificationEmail(user);
      
      if (result.success) {
        showNotification('📧 Email de verificação reenviado!', 'success');
        
        // Em modo desenvolvimento, mostrar URL diretamente
        if (result.verificationUrl) {
          console.log('🔗 URL de verificação (desenvolvimento):', result.verificationUrl);
          showNotification('🔗 URL de verificação disponível no console', 'info');
        }
      } else {
        showNotification(result.error || 'Erro ao reenviar email', 'error');
      }
    } catch (error) {
      showNotification('Erro ao reenviar email de verificação', 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div style={{
      background: darkMode 
        ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' 
        : 'linear-gradient(135deg, #fef3c7, #fbbf24)',
      border: `1px solid ${darkMode ? '#d97706' : '#f59e0b'}`,
      borderRadius: '12px',
      padding: '1rem',
      margin: '1rem 0',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Ícone */}
      <div style={{
        fontSize: '1.5rem',
        flexShrink: 0
      }}>
        📧
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontWeight: '600',
          color: darkMode ? '#7c2d12' : '#92400e',
          fontSize: '0.875rem',
          marginBottom: '0.25rem'
        }}>
          📨 Confirme seu endereço de email
        </div>
        <div style={{
          color: darkMode ? '#a16207' : '#b45309',
          fontSize: '0.75rem',
          lineHeight: '1.4'
        }}>
          Enviamos um link de verificação para <strong>{user.email}</strong>. 
          Verifique sua caixa de entrada e spam.
        </div>
      </div>

      {/* Botão de reenviar */}
      <button
        onClick={handleResendEmail}
        disabled={isResending}
        style={{
          background: darkMode ? '#7c2d12' : '#92400e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          cursor: isResending ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: isResending ? 0.7 : 1,
          transition: 'all 0.2s',
          flexShrink: 0
        }}
      >
        {isResending ? (
          <>
            <div style={{
              width: '12px',
              height: '12px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Enviando...
          </>
        ) : (
          <>
            🔄 Reenviar
          </>
        )}
      </button>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EmailVerificationBanner; 