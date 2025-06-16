import React, { useState, useMemo } from 'react';

const SmartHistoryPanel = ({ isOpen, onClose, history, onItemSelect, onDeleteItem, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');

  // Filtros disponíveis
  const filters = [
    { value: 'all', label: 'Todos', icon: '📋', count: history.length },
    { value: 'url', label: 'URLs', icon: '🔗', count: history.filter(item => item.template === 'url').length },
    { value: 'text', label: 'Texto', icon: '📝', count: history.filter(item => item.template === 'text').length },
    { value: 'email', label: 'E-mail', icon: '📧', count: history.filter(item => item.template === 'email').length },
    { value: 'phone', label: 'Telefone', icon: '📱', count: history.filter(item => item.template === 'phone').length },
    { value: 'wifi', label: 'WiFi', icon: '📶', count: history.filter(item => item.template === 'wifi').length },
    { value: 'custom', label: 'Personalizado', icon: '⚡', count: history.filter(item => item.template === 'custom').length }
  ];

  const dateFilters = [
    { value: 'all', label: 'Todas as datas' },
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mês' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Mais recentes' },
    { value: 'oldest', label: 'Mais antigos' },
    { value: 'template', label: 'Por tipo' },
    { value: 'content', label: 'Por conteúdo (A-Z)' }
  ];

  // Função de busca inteligente
  const filteredHistory = useMemo(() => {
    let filtered = [...history];

    // Filtrar por busca
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        return (
          item.text.toLowerCase().includes(search) ||
          item.template.toLowerCase().includes(search) ||
          (item.color && item.color.toLowerCase().includes(search))
        );
      });
    }

    // Filtrar por tipo
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.template === selectedFilter);
    }

    // Filtrar por data
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.timestamp);
        
        switch (dateFilter) {
          case 'today':
            return itemDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return itemDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return itemDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'template':
          return a.template.localeCompare(b.template);
        case 'content':
          return a.text.localeCompare(b.text);
        default:
          return b.timestamp - a.timestamp;
      }
    });

    return filtered;
  }, [history, searchTerm, selectedFilter, dateFilter, sortBy]);

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hoje ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ontem ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const getTemplateIcon = (template) => {
    const icons = {
      url: '🔗',
      text: '📝',
      email: '📧',
      phone: '📱',
      wifi: '📶',
      location: '📍',
      event: '📅',
      vcard: '👤',
      custom: '⚡'
    };
    return icons[template] || '📋';
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
        maxWidth: '1000px',
        width: '100%',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
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
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              📊
            </div>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: darkMode ? '#f1f5f9' : '#1f2937',
                margin: 0
              }}>
                Histórico Inteligente
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: darkMode ? '#94a3b8' : '#6b7280',
                margin: 0
              }}>
                {filteredHistory.length} de {history.length} QR Codes
              </p>
            </div>
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

        {/* Search */}
        <div style={{
          position: 'relative',
          marginBottom: '1rem'
        }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar por conteúdo, tipo..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
              borderRadius: '12px',
              fontSize: '1rem',
              background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              color: darkMode ? '#f1f5f9' : '#374151',
              outline: 'none'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '20px',
                border: 'none',
                background: selectedFilter === filter.value
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                  : darkMode 
                    ? 'rgba(71, 85, 105, 0.5)' 
                    : 'rgba(229, 231, 235, 0.5)',
                color: selectedFilter === filter.value
                  ? 'white'
                  : darkMode ? '#cbd5e1' : '#374151',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {filter.icon} {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto'
        }}>
          {filteredHistory.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: darkMode ? '#94a3b8' : '#6b7280'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {searchTerm ? '🔍' : '📭'}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: darkMode ? '#cbd5e1' : '#374151'
              }}>
                {searchTerm ? 'Nenhum resultado encontrado' : 'Histórico vazio'}
              </h3>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {filteredHistory.map((item, index) => (
                <div
                  key={item.id || index}
                  style={{
                    background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => onItemSelect(item)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* QR Code Preview */}
                  <div style={{
                    width: '100%',
                    height: '120px',
                    background: 'white',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <img
                      src={item.dataURL}
                      alt="QR Code"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.25rem' }}>
                        {getTemplateIcon(item.template)}
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: darkMode ? '#f1f5f9' : '#1f2937'
                      }}>
                        {item.template.toUpperCase()}
                      </span>
                    </div>
                    
                    <p style={{
                      fontSize: '0.875rem',
                      color: darkMode ? '#cbd5e1' : '#6b7280',
                      marginBottom: '0.5rem'
                    }}>
                      {truncateText(item.text)}
                    </p>
                    
                    <div style={{
                      fontSize: '0.75rem',
                      color: darkMode ? '#94a3b8' : '#9ca3af',
                      marginBottom: '0.75rem'
                    }}>
                      🕒 {formatDate(item.timestamp)}
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onItemSelect(item);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        ⚡ Usar
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id || index);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
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
      </div>
    </div>
  );
};

export default SmartHistoryPanel; 