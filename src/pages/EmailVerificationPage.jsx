import React, { useState, useEffect } from 'react';
import { verifyEmailToken } from '../services/emailService';

const EmailVerificationPage = ({ darkMode, showNotification, onUserUpdate }) => {
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Extrair parâmetros da URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');

        if (!token || !email) {
          setVerificationStatus('error');
          setMessage('Link de verificação inválido');
          return;
        }

        // Verificar token
        const result = verifyEmailToken(email, token);

        if (result.success) {
          setVerificationStatus('success');
          setMessage(result.message);
          showNotification('✅ Email verificado com sucesso!', 'success');
          
          // Atualizar usuário logado se necessário
          const currentUser = JSON.parse(localStorage.getItem('qrcraft-currentUser') || 'null');
          if (currentUser && currentUser.email === email) {
            currentUser.emailVerified = true;
            localStorage.setItem('qrcraft-currentUser', JSON.stringify(currentUser));
            if (onUserUpdate) {
              onUserUpdate(currentUser);
            }
          }
          
          // Redirecionar para home após 3 segundos
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
          
        } else {
          setVerificationStatus('error');
          setMessage(result.error);
          showNotification(result.error, 'error');
        }

      } catch (error) {
        console.error('❌ Erro na verificação:', error);
        setVerificationStatus('error');
        setMessage('Erro interno na verificação');
        showNotification('Erro na verificação de email', 'error');
      }
    };

    verifyEmail();
  }, [showNotification, onUserUpdate]);

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verifying':
        return '🔄';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📧';
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'verifying':
        return darkMode ? '#3b82f6' : '#2563eb';
      case 'success':
        return darkMode ? '#10b981' : '#059669';
      case 'error':
        return darkMode ? '#ef4444' : '#dc2626';
      default:
        return darkMode ? '#6b7280' : '#4b5563';
    }
  };

  const getStatusText = () => {
    switch (verificationStatus) {
      case 'verifying':
        return 'Verificando seu email...';
      case 'success':
        return 'Email verificado com sucesso!';
      case 'error':
        return 'Falha na verificação';
      default:
        return 'Verificação de email';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '24px',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: darkMode 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: darkMode 
          ? '1px solid rgba(71, 85, 105, 0.5)' 
          : '1px solid rgba(229, 231, 235, 0.8)'
      }}>
        {/* Ícone de status */}
        <div style={{
          fontSize: '4rem',
          marginBottom: '1.5rem',
          animation: verificationStatus === 'verifying' ? 'spin 2s linear infinite' : 'none'
        }}>
          {getStatusIcon()}
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: getStatusColor(),
          marginBottom: '1rem',
          margin: 0
        }}>
          {getStatusText()}
        </h1>

        {/* Mensagem */}
        <p style={{
          fontSize: '1.125rem',
          color: darkMode ? '#94a3b8' : '#6b7280',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          {message || 'Processando sua verificação de email...'}
        </p>

        {/* Status específico */}
        {verificationStatus === 'success' && (
          <div style={{
            background: darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(219, 234, 254, 0.8)',
            border: `1px solid ${darkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(147, 197, 253, 0.5)'}`,
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: darkMode ? '#6ee7b7' : '#059669',
              fontWeight: '500'
            }}>
              🎉 Seu email foi verificado com sucesso!<br />
              Redirecionando para a página inicial em 3 segundos...
            </div>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div style={{
            background: darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 242, 242, 0.8)',
            border: `1px solid ${darkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(252, 165, 165, 0.5)'}`,
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: darkMode ? '#fca5a5' : '#dc2626',
              fontWeight: '500'
            }}>
              {message}
            </div>
          </div>
        )}

        {verificationStatus === 'verifying' && (
          <div style={{
            background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(219, 234, 254, 0.8)',
            border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(147, 197, 253, 0.5)'}`,
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: darkMode ? '#93c5fd' : '#2563eb',
              fontWeight: '500'
            }}>
              ⏳ Validando seu token de verificação...
            </div>
          </div>
        )}

        {/* Botão de voltar */}
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🏠 Voltar ao QRCraft Studio
        </button>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default EmailVerificationPage; 