import React from 'react';

const HistoryPanel = ({ history, darkMode, onReuse, onClear, showNotification }) => {
  if (history.length === 0) {
    return (
      <div style={{
        background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '2rem',
        border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: darkMode ? '#f1f5f9' : '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Histórico Vazio
        </h3>
        <p style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
          Seus QR Codes gerados aparecerão aqui
        </p>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const truncateText = (text, maxLength = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const downloadFromHistory = (item) => {
    const link = document.createElement('a');
    link.download = `qrcraft-history-${item.id}.png`;
    link.href = item.dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('QR Code do histórico baixado!', 'success');
  };

  return (
    <div style={{
      background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      padding: '2rem',
      border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.75rem'
          }}>
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: darkMode ? '#f1f5f9' : '#1f2937',
            margin: 0
          }}>
            📝 Histórico ({history.length})
          </h3>
        </div>
        
        <button
          onClick={onClear}
          style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          🗑️ Limpar
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {history.map((item) => (
          <div
            key={item.id}
            style={{
              background: darkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.8)',
              border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.5)'}`,
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* QR Code Preview */}
            <div style={{
              width: '60px',
              height: '60px',
              background: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img
                src={item.dataURL}
                alt="QR Code"
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: darkMode ? '#f1f5f9' : '#374151',
                marginBottom: '0.25rem'
              }}>
                {item.template !== 'custom' ? `📋 ${item.template.toUpperCase()}` : '✏️ Personalizado'}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: darkMode ? '#cbd5e1' : '#6b7280',
                marginBottom: '0.25rem'
              }}>
                {truncateText(item.text)}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: darkMode ? '#9ca3af' : '#9ca3af'
              }}>
                🕒 {formatDate(item.timestamp)}
              </div>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <button
                onClick={() => onReuse(item)}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.375rem 0.5rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}
              >
                🔄 Reutilizar
              </button>
              <button
                onClick={() => downloadFromHistory(item)}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.375rem 0.5rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}
              >
                💾 Baixar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel; 