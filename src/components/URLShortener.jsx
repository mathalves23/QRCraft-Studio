import React, { useState, useEffect } from 'react';

const URLShortener = ({ isOpen, onClose, onShortenResult, darkMode, showNotification, user, isFeatureAvailable }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [activeTab, setActiveTab] = useState('shorten');

  // Carregar URLs do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('shortenedUrls');
    if (saved) {
      setShortenedUrls(JSON.parse(saved));
    }
  }, []);

  // Salvar URLs no localStorage
  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
  }, [shortenedUrls]);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shortenWithRealApi = async (url) => {
    console.log('🔄 Tentando encurtar URL:', url);
    
    // Primeira tentativa: is.gd via proxy
    try {
      console.log('🌐 Tentando is.gd via proxy...');
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`)}`;
      const response = await fetch(proxyUrl);
      
      if (response.ok) {
        const data = await response.json();
        const shortUrl = data.contents.trim();
        
        if (shortUrl && shortUrl.startsWith('https://is.gd/')) {
          console.log('✅ is.gd funcionou:', shortUrl);
          return { shortUrl, provider: 'is.gd' };
        }
      }
    } catch (error) {
      console.log('❌ is.gd falhou:', error.message);
    }

    // Segunda tentativa: v.gd
    try {
      console.log('🌐 Tentando v.gd...');
      const response = await fetch('https://v.gd/create.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `format=simple&url=${encodeURIComponent(url)}`
      });
      
      if (response.ok) {
        const shortUrl = await response.text();
        if (shortUrl && shortUrl.startsWith('https://v.gd/')) {
          console.log('✅ v.gd funcionou:', shortUrl);
          return { shortUrl, provider: 'v.gd' };
        }
      }
    } catch (error) {
      console.log('❌ v.gd falhou:', error.message);
    }

    throw new Error('Todas as APIs de encurtamento falharam');
  };

  const generateShortUrl = async () => {
    if (!url.trim()) {
      showNotification('Por favor, insira uma URL', 'error');
      return;
    }

    if (!validateUrl(url)) {
      showNotification('Por favor, insira uma URL válida', 'error');
      return;
    }

    // Verificar limites do plano
    const currentPlan = user?.plan || 'standard';
    const maxUrls = currentPlan === 'pro' ? Infinity : 10;
    
    if (shortenedUrls.length >= maxUrls) {
      showNotification(`Limite de ${maxUrls} URLs atingido. Faça upgrade para PRO!`, 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await shortenWithRealApi(url);
      
      const urlTitle = await getUrlTitle(url);
      
      const newShortUrl = {
        id: Date.now(),
        original: url,
        shortened: result.shortUrl,
        title: urlTitle,
        clicks: 0,
        created: new Date().toISOString(),
        provider: result.provider
      };

      setShortenedUrls(prev => [newShortUrl, ...prev]);
      
      showNotification(`URL encurtada com sucesso via ${result.provider}! 🎉`, 'success');
      
      if (onShortenResult) {
        onShortenResult(result.shortUrl);
      }
      
      setUrl('');
      setActiveTab('history');
      
    } catch (error) {
      console.error('❌ Erro ao encurtar URL:', error);
      showNotification('Erro ao encurtar URL. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getUrlTitle = async (url) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch {
      return 'Link Encurtado';
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Copiado para a área de transferência! 📋', 'success');
    } catch (error) {
      showNotification('Erro ao copiar para a área de transferência', 'error');
    }
  };

  const generateQRForShortUrl = (shortUrl) => {
    if (onShortenResult) {
      onShortenResult(shortUrl);
    }
    onClose();
  };

  const deleteShortUrl = (id) => {
    setShortenedUrls(prev => prev.filter(url => url.id !== id));
    showNotification('URL removida com sucesso! 🗑️', 'success');
  };

  const testShortUrl = async (shortUrl) => {
    try {
      window.open(shortUrl, '_blank');
      // Incrementar contador de cliques
      setShortenedUrls(prev => prev.map(url => 
        url.shortened === shortUrl 
          ? { ...url, clicks: url.clicks + 1 }
          : url
      ));
    } catch (error) {
      showNotification('Erro ao abrir URL', 'error');
    }
  };

  if (!isOpen) return null;

  const currentPlan = user?.plan || 'standard';
  const maxUrls = currentPlan === 'pro' ? 'Ilimitado' : '10';

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
        maxWidth: '600px',
        maxHeight: '80vh',
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
              🔗 Encurtador de URLs
            </h2>
            <p style={{
              margin: '0.5rem 0 0 0',
              color: darkMode ? '#94a3b8' : '#6b7280',
              fontSize: '0.875rem'
            }}>
              Encurte suas URLs usando APIs reais (is.gd, v.gd) • Limite: {maxUrls} URLs
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

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(243, 244, 246, 0.8)',
          borderRadius: '16px',
          padding: '0.5rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setActiveTab('shorten')}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeTab === 'shorten' 
                ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                : 'transparent',
              color: activeTab === 'shorten' 
                ? 'white' 
                : (darkMode ? '#e2e8f0' : '#374151')
            }}
          >
            🔗 Encurtar URL
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeTab === 'history' 
                ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                : 'transparent',
              color: activeTab === 'history' 
                ? 'white' 
                : (darkMode ? '#e2e8f0' : '#374151'),
              position: 'relative'
            }}
          >
            📚 Histórico
            {shortenedUrls.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-0.25rem',
                right: '-0.25rem',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '1.25rem',
                height: '1.25rem',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700'
              }}>
                {shortenedUrls.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'shorten' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: darkMode ? '#e2e8f0' : '#374151',
                marginBottom: '0.5rem'
              }}>
                URL para encurtar
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com/minha-url-muito-longa"
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: darkMode 
                    ? '2px solid rgba(71, 85, 105, 0.5)' 
                    : '2px solid rgba(229, 231, 235, 0.8)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'white',
                  color: darkMode ? '#e2e8f0' : '#1f2937',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    generateShortUrl();
                  }
                }}
              />
            </div>

            <button
              onClick={generateShortUrl}
              disabled={isLoading || !url.trim()}
              style={{
                width: '100%',
                padding: '1rem',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading || !url.trim() ? 'not-allowed' : 'pointer',
                background: isLoading || !url.trim() 
                  ? (darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(156, 163, 175, 0.5)')
                  : 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
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
                <>
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  🚀 Encurtar URL
                </>
              )}
            </button>
          </div>
        ) : (
          <div>
            {shortenedUrls.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: darkMode ? '#94a3b8' : '#6b7280'
              }}>
                <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem' }}>
                  <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  Nenhuma URL encurtada ainda
                </h3>
                <p>Comece encurtando sua primeira URL!</p>
                <button
                  onClick={() => setActiveTab('shorten')}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Encurtar URL
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {shortenedUrls.map((url) => (
                  <div key={url.id} style={{
                    padding: '1.5rem',
                    background: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '16px',
                    border: darkMode 
                      ? '1px solid rgba(71, 85, 105, 0.5)' 
                      : '1px solid rgba(229, 231, 235, 0.8)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: darkMode ? '#e2e8f0' : '#1f2937',
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          {url.title}
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            background: '#10b981',
                            color: 'white',
                            fontWeight: '500'
                          }}>
                            🌐 {url.provider || 'API REAL'}
                          </span>
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: darkMode ? '#94a3b8' : '#6b7280',
                          marginBottom: '0.25rem',
                          wordBreak: 'break-all'
                        }}>
                          <strong>Original:</strong> {url.original}
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: darkMode ? '#94a3b8' : '#6b7280',
                          fontFamily: 'monospace',
                          wordBreak: 'break-all'
                        }}>
                          <strong>Encurtada:</strong> {url.shortened}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteShortUrl(url.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#ef4444',
                          fontSize: '0.875rem'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: darkMode ? '#94a3b8' : '#6b7280' }}>
                        <span>📊 {url.clicks} cliques</span>
                        <span>📅 {new Date(url.created).toLocaleDateString('pt-BR')}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => testShortUrl(url.shortened)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: darkMode ? 'rgba(34, 197, 94, 0.8)' : '#22c55e',
                            color: 'white',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          🔗 Testar
                        </button>
                        
                        <button
                          onClick={() => copyToClipboard(url.shortened)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: darkMode ? 'rgba(59, 130, 246, 0.8)' : '#3b82f6',
                            color: 'white',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          📋 Copiar
                        </button>
                        
                        <button
                          onClick={() => generateQRForShortUrl(url.shortened)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: darkMode ? 'rgba(16, 185, 129, 0.8)' : '#10b981',
                            color: 'white',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          📱 QR Code
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
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default URLShortener; 