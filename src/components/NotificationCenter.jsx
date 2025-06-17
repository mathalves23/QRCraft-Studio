import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { notificationHelpers } from '@/lib/supabase';

const NotificationCenter = ({ isOpen, onClose, darkMode, showNotification }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && isAuthenticated && user) {
      loadNotifications();
    }
  }, [isOpen, isAuthenticated, user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await notificationHelpers.getUserNotifications(user.id);
      
      if (error) {
        console.error('Erro ao carregar notificações:', error);
        showNotification?.('Erro ao carregar notificações', 'error');
      } else {
        setNotifications(data || []);
        
        // Contar não lidas
        const unread = (data || []).filter(n => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      showNotification?.('Erro ao carregar dados', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await notificationHelpers.markAsRead(notificationId, user.id);
      
      if (error) {
        throw error;
      }
      
      // Atualizar estado local
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
      showNotification?.('Erro ao atualizar notificação', 'error');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await notificationHelpers.markAllAsRead(user.id);
      
      if (error) {
        throw error;
      }
      
      // Atualizar estado local
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      
      showNotification?.('Todas as notificações foram marcadas como lidas', 'success');
      
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
      showNotification?.('Erro ao atualizar notificações', 'error');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const { error } = await notificationHelpers.deleteNotification(notificationId, user.id);
      
      if (error) {
        throw error;
      }
      
      // Atualizar estado local
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      showNotification?.('Notificação deletada', 'success');
      
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      showNotification?.('Erro ao deletar notificação', 'error');
    }
  };

  const handleNotificationAction = (notification) => {
    if (!notification.action_type) return;

    switch (notification.action_type) {
      case 'upgrade':
        // Abrir modal de upgrade (implementar depois)
        console.log('Abrir modal de upgrade');
        break;
      case 'feature':
        // Redirecionar para funcionalidade
        console.log('Abrir funcionalidade');
        break;
      case 'link':
        // Abrir link externo
        if (notification.action_data?.url) {
          window.open(notification.action_data.url, '_blank');
        }
        break;
      default:
        break;
    }

    // Marcar como lida automaticamente
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      promotion: '🎉',
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅',
      update: '🚀'
    };
    return icons[type] || 'ℹ️';
  };

  const getNotificationColor = (type) => {
    const colors = {
      promotion: 'linear-gradient(135deg, #f59e0b, #d97706)',
      info: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
      error: 'linear-gradient(135deg, #ef4444, #dc2626)',
      success: 'linear-gradient(135deg, #10b981, #059669)',
      update: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    };
    return colors[type] || colors.info;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) {
      return 'Agora mesmo';
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else if (diffDays < 7) {
      return `${diffDays}d atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
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
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          border: darkMode 
            ? '1px solid rgba(71, 85, 105, 0.5)' 
            : '1px solid rgba(229, 231, 235, 0.5)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: darkMode ? '#cbd5e1' : '#374151'
          }}>
            Faça login para ver notificações
          </h3>
          <p style={{
            color: darkMode ? '#94a3b8' : '#6b7280',
            marginBottom: '1.5rem'
          }}>
            Entre na sua conta para acessar suas notificações
          </p>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

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
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        border: darkMode 
          ? '1px solid rgba(71, 85, 105, 0.5)' 
          : '1px solid rgba(229, 231, 235, 0.5)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              🔔
            </div>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
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
                {unreadCount} não lidas
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}
              >
                Marcar todas como lidas
              </button>
            )}
            
            <button
              onClick={onClose}
              style={{
                background: darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 0.5)',
                border: 'none',
                borderRadius: '12px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: darkMode ? '#cbd5e1' : '#6b7280',
                fontSize: '1.25rem'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          paddingRight: '0.5rem'
        }}>
          {isLoading ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(245, 158, 11, 0.3)',
                borderTop: '3px solid #f59e0b',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <p style={{
                fontSize: '1rem',
                color: darkMode ? '#cbd5e1' : '#374151'
              }}>
                Carregando notificações...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: darkMode ? '#94a3b8' : '#6b7280'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: darkMode ? '#cbd5e1' : '#374151'
              }}>
                Nenhuma notificação
              </h3>
              <p>Você está em dia! 🎉</p>
            </div>
          ) : (
            <div style={{ space: '0.75rem' }}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    background: notification.read 
                      ? (darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)')
                      : (darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    border: notification.read 
                      ? `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`
                      : `2px solid ${darkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleNotificationAction(notification)}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: getNotificationColor(notification.type),
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0
                    }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem'
                      }}>
                        <h4 style={{
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: darkMode ? '#f1f5f9' : '#1f2937',
                          margin: 0
                        }}>
                          {notification.title}
                        </h4>
                        <span style={{
                          fontSize: '0.75rem',
                          color: darkMode ? '#94a3b8' : '#6b7280'
                        }}>
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>
                      
                      <p style={{
                        fontSize: '0.8rem',
                        color: darkMode ? '#cbd5e1' : '#6b7280',
                        lineHeight: '1.4',
                        margin: '0 0 0.75rem 0'
                      }}>
                        {notification.message}
                      </p>
                      
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center'
                      }}>
                        {notification.action_type && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationAction(notification);
                            }}
                            style={{
                              padding: '0.25rem 0.75rem',
                              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            {notification.action_type === 'upgrade' && 'Ver Oferta'}
                            {notification.action_type === 'feature' && 'Experimentar'}
                            {notification.action_type === 'link' && 'Abrir Link'}
                          </button>
                        )}
                        
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            style={{
                              padding: '0.25rem 0.75rem',
                              background: 'rgba(16, 185, 129, 0.1)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Marcar como lida
                          </button>
                        )}
                        
                        {notification.user_id && ( // Só pode deletar notificações próprias
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter; 