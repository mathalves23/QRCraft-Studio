import { useState } from 'react';

const Analytics = ({ isOpen, onClose, darkMode, user }) => {
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
          ? 'linear-gradient(135deg, #1e293b, #334155)' 
          : 'linear-gradient(135deg, #ffffff, #f8fafc)',
        borderRadius: '24px',
        padding: '2rem',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: darkMode ? '#f1f5f9' : '#1f2937',
            margin: 0
          }}>
            📊 Analytics Dashboard
          </h2>
          
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: darkMode ? '#cbd5e1' : '#6b7280'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>247</h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#6b7280', margin: 0 }}>QR Codes Gerados</p>
          </div>

          <div style={{
            background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⬇️</div>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>156</h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#6b7280', margin: 0 }}>Downloads</p>
          </div>

          <div style={{
            background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>63%</h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#6b7280', margin: 0 }}>Taxa de Conversão</p>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '16px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#8b5cf6',
            marginBottom: '0.5rem'
          }}>
            🚀 Analytics Avançados no Plano PRO
          </h4>
          <p style={{
            fontSize: '0.875rem',
            color: darkMode ? '#c4b5fd' : '#7c3aed',
            marginBottom: '1rem'
          }}>
            Tenha acesso a relatórios detalhados, gráficos interativos e insights profissionais!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 