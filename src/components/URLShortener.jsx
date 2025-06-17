import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { urlShortenerHelpers } from '@/lib/supabase';

const URLShortener = ({ isOpen, onClose, onShortenResult, darkMode, showNotification }) => {
  const { user, isAuthenticated } = useAuth();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [activeTab, setActiveTab] = useState('shorten');

  // Carregar URLs do Supabase
  useEffect(() => {
    if (isOpen && isAuthenticated && user) {
      loadUserUrls();
    }
  }, [isOpen, isAuthenticated, user]);

  const loadUserUrls = async () => {
    try {
      const { data, error } = await urlShortenerHelpers.getUserUrls(user.id);
      if (error) {
        console.error('Erro ao carregar URLs:', error);
        showNotification('Erro ao carregar URLs encurtadas', 'error');
      } else {
        setShortenedUrls(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar URLs:', error);
      showNotification('Erro ao carregar URLs', 'error');
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shortenUrl = async () => {
    if (!url.trim()) {
      showNotification('Por favor, insira uma URL', 'error');
      return;
    }

    if (!validateUrl(url)) {
      showNotification('URL inválida', 'error');
      return;
    }

    if (!isAuthenticated) {
      showNotification('Faça login para encurtar URLs', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await urlShortenerHelpers.saveShortUrl(url, {
        title: url,
        description: `URL encurtada em ${new Date().toLocaleDateString()}`
      });

      if (error) {
        throw error;
      }

      // Atualizar lista
      await loadUserUrls();
      
      setUrl('');
      showNotification('URL encurtada com sucesso!', 'success');
      
      if (onShortenResult) {
        onShortenResult(data);
      }

    } catch (error) {
      console.error('Erro ao encurtar URL:', error);
      showNotification('Erro ao encurtar URL', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('URL copiada para a área de transferência!', 'success');
    } catch (error) {
      showNotification('Erro ao copiar URL', 'error');
    }
  };

  const deleteUrl = async (urlId) => {
    try {
      const { error } = await urlShortenerHelpers.deleteUrl(urlId);
      if (error) {
        throw error;
      }
      
      await loadUserUrls();
      showNotification('URL deletada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao deletar URL:', error);
      showNotification('Erro ao deletar URL', 'error');
    }
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
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: darkMode 
          ? '1px solid rgba(71, 85, 105, 0.5)' 
          : '1px solid rgba(229, 231, 235, 0.5)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              🔗
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              margin: 0
            }}>
              Encurtador de URLs
            </h2>
          </div>
          
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

        {/* Tabs */}
        <div style={{
          display: 'flex',
          marginBottom: '1.5rem',
          background: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
          borderRadius: '12px',
          padding: '0.25rem'
        }}>
          {['shorten', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab 
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                  : 'transparent',
                color: activeTab === tab 
                  ? 'white' 
                  : darkMode ? '#cbd5e1' : '#374151',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab === 'shorten' ? '🔗 Encurtar' : '📝 Histórico'}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'shorten' ? (
          <div>
            {!isAuthenticated && (
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                <p style={{ 
                  color: darkMode ? '#93c5fd' : '#1d4ed8',
                  margin: 0,
                  fontSize: '0.9rem'
                }}>
                  ℹ️ Faça login para salvar e gerenciar suas URLs encurtadas
                </p>
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: darkMode ? '#cbd5e1' : '#374151',
                marginBottom: '0.5rem'
              }}>
                URL para Encurtar
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com/uma-url-muito-longa"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: `2px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  color: darkMode ? '#f1f5f9' : '#374151',
                  outline: 'none'
                }}
              />
            </div>

            <button
              onClick={shortenUrl}
              disabled={isLoading || !isAuthenticated}
              style={{
                width: '100%',
                background: isLoading || !isAuthenticated
                  ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                  : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading || !isAuthenticated ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Encurtando...
                </>
              ) : (
                '🚀 Encurtar URL'
              )}
            </button>
          </div>
        ) : (
          <div>
            {!isAuthenticated ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: darkMode ? '#94a3b8' : '#6b7280'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: darkMode ? '#cbd5e1' : '#374151'
                }}>
                  Faça login para ver o histórico
                </h3>
              </div>
            ) : shortenedUrls.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: darkMode ? '#94a3b8' : '#6b7280'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: darkMode ? '#cbd5e1' : '#374151'
                }}>
                  Nenhuma URL encurtada ainda
                </h3>
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {shortenedUrls.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      padding: '1rem',
                      marginBottom: '0.75rem',
                      border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`
                    }}
                  >
                    <div style={{ 
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: darkMode ? '#f1f5f9' : '#1f2937',
                      marginBottom: '0.5rem'
                    }}>
                      {item.short_url}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: darkMode ? '#94a3b8' : '#6b7280',
                      marginBottom: '0.5rem',
                      wordBreak: 'break-all'
                    }}>
                      Original: {item.original_url}
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      color: darkMode ? '#94a3b8' : '#6b7280'
                    }}>
                      <span>
                        {item.click_count} cliques • {formatDate(item.created_at)}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => copyToClipboard(item.short_url)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          📋 Copiar
                        </button>
                        <button
                          onClick={() => deleteUrl(item.id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default URLShortener; 