import React, { useState, useEffect } from 'react';

const NotificationCenter = ({ isOpen, onClose, user, darkMode, showNotification }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulação de notificações do sistema
  useEffect(() => {
    const systemNotifications = [
      {
        id: 1,
        type: 'promotion',
        title: '🎉 Promoção Especial PRO',
        message: 'Upgrade para PRO por apenas R$ 15/ano! Oferta limitada até o final do mês.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        read: false,
        action: {
          label: 'Ver Oferta',
          type: 'upgrade'
        }
      },
      {
        id: 2,
        type: 'info',
        title: '✨ Nova Funcionalidade',
        message: 'Agora você pode criar QR Codes para redes sociais! Teste o novo template.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
        read: user?.plan === 'pro' ? true : false,
        action: {
          label: 'Experimentar',
          type: 'feature'
        }
      },
      {
        id: 3,
        type: 'warning',
        title: '⚠️ Limite de Uso',
        message: user?.plan === 'standard' ? 
          `Você já usou ${user?.monthlyUsage || 0}/10 QR Codes este mês. Considere fazer upgrade.` :
          'Parabéns! Como usuário PRO, você tem QR Codes ilimitados.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
        read: true
      },
      {
        id: 4,
        type: 'update',
        title: '🚀 QRCraft Studio 2025',
        message: 'Bem-vindo à nova versão! Melhorias de performance e nova interface.',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 semana atrás
        read: true
      }
    ];

    setNotifications(systemNotifications);
    setUnreadCount(systemNotifications.filter(n => !n.read).length);
  }, [user]);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const handleAction = (notification) => {
    markAsRead(notification.id);
    
    switch (notification.action?.type) {
      case 'upgrade':
        showNotification('Redirecionando para upgrade...', 'info');
        onClose();
        break;
      case 'feature':
        showNotification('Experimentando nova funcionalidade!', 'success');
        onClose();
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      promotion: '🎉',
      info: 'ℹ️',
      warning: '⚠️',
      update: '🚀',
      success: '✅',
      error: '❌'
    };
    return icons[type] || 'ℹ️';
  };

  const getNotificationColor = (type) => {
    const colors = {
      promotion: '#f59e0b',
      info: '#3b82f6',
      warning: '#f97316',
      update: '#8b5cf6',
      success: '#10b981',
      error: '#ef4444'
    };
    return colors[type] || '#6b7280';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div style={{
        background: darkMode ? '#1e293b' : '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflow: 'hidden',
        border: darkMode ? '1px solid #475569' : '1px solid #e5e7eb',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        marginTop: '2rem'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: darkMode ? '1px solid #475569' : '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#3b82f6',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {unreadCount}
                </div>
              )}
            </div>
            
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: darkMode ? '#f1f5f9' : '#1f2937',
                margin: 0
              }}>
                Notificações
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: darkMode ? '#94a3b8' : '#6b7280',
                margin: 0
              }}>
                {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas lidas'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
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
                Marcar todas como lidas
              </button>
            )}
            
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
        </div>

        {/* Notifications List */}
        <div style={{
          maxHeight: 'calc(80vh - 120px)',
          overflow: 'auto',
          padding: '0.5rem'
        }}>
          {notifications.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: darkMode ? '#94a3b8' : '#6b7280'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
              <p>Nenhuma notificação por enquanto</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                style={{
                  background: notification.read 
                    ? 'transparent' 
                    : darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                  borderRadius: '12px',
                  padding: '1rem',
                  margin: '0.5rem',
                  border: notification.read 
                    ? 'none' 
                    : darkMode ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(59, 130, 246, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: getNotificationColor(notification.type),
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0
                  }}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h3 style={{
                        fontSize: '0.875rem',
                        fontWeight: notification.read ? '500' : 'bold',
                        color: darkMode ? '#f1f5f9' : '#1f2937',
                        margin: 0,
                        flex: 1
                      }}>
                        {notification.title}
                      </h3>
                      
                      {!notification.read && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          background: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                      )}
                    </div>

                    <p style={{
                      fontSize: '0.875rem',
                      color: darkMode ? '#94a3b8' : '#6b7280',
                      margin: '0 0 0.5rem 0',
                      lineHeight: '1.4'
                    }}>
                      {notification.message}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: darkMode ? '#64748b' : '#9ca3af'
                      }}>
                        {formatTimestamp(notification.timestamp)}
                      </span>

                      {notification.action && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(notification);
                          }}
                          style={{
                            background: getNotificationColor(notification.type),
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Hook para gerenciar notificações
export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(3); // Simulação inicial

  const getUnreadCount = () => unreadCount;
  
  const markAsRead = () => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return { unreadCount: getUnreadCount(), markAsRead };
};

export default NotificationCenter; 