import { useState, useEffect } from 'react';

const AnalyticsDashboard = ({ isOpen, onClose, darkMode, user, analytics }) => {
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y
  const [selectedMetric, setSelectedMetric] = useState('generated');
  const [detailedStats, setDetailedStats] = useState({
    totalGenerated: 0,
    totalDownloads: 0,
    favoriteTemplates: [],
    deviceStats: {},
    formatStats: {},
    dailyActivity: [],
    popularColors: [],
    averageSize: 0
  });

  useEffect(() => {
    if (isOpen) {
      loadAnalyticsData();
    }
  }, [isOpen, timeRange]);

  const loadAnalyticsData = () => {
    // Simular carregamento de dados analytics
    const mockData = {
      totalGenerated: 1247,
      totalDownloads: 856,
      favoriteTemplates: [
        { name: 'URL', count: 524, percentage: 42 },
        { name: 'WiFi', count: 312, percentage: 25 },
        { name: 'vCard', count: 186, percentage: 15 },
        { name: 'Custom', count: 149, percentage: 12 },
        { name: 'Email', count: 76, percentage: 6 }
      ],
      deviceStats: {
        mobile: 65,
        desktop: 28,
        tablet: 7
      },
      formatStats: {
        png: 78,
        svg: 15,
        pdf: 7
      },
      dailyActivity: [
        { date: '2024-01-01', generated: 45, downloaded: 32 },
        { date: '2024-01-02', generated: 52, downloaded: 38 },
        { date: '2024-01-03', generated: 38, downloaded: 28 },
        { date: '2024-01-04', generated: 61, downloaded: 45 },
        { date: '2024-01-05', generated: 49, downloaded: 35 },
        { date: '2024-01-06', generated: 56, downloaded: 41 },
        { date: '2024-01-07', generated: 43, downloaded: 31 }
      ],
      popularColors: [
        { color: '#000000', name: 'Preto', usage: 35 },
        { color: '#3b82f6', name: 'Azul', usage: 22 },
        { color: '#dc2626', name: 'Vermelho', usage: 18 },
        { color: '#059669', name: 'Verde', usage: 15 },
        { color: '#7c3aed', name: 'Roxo', usage: 10 }
      ],
      averageSize: 512
    };

    setDetailedStats(mockData);
  };

  const timeRangeOptions = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 3 meses' },
    { value: '1y', label: 'Último ano' }
  ];

  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <div style={{
      background: darkMode 
        ? 'rgba(15, 23, 42, 0.8)' 
        : 'rgba(255, 255, 255, 0.8)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: darkMode 
        ? '1px solid rgba(71, 85, 105, 0.5)' 
        : '1px solid rgba(229, 231, 235, 0.5)',
      boxShadow: darkMode 
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' 
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: color,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          {icon}
        </div>
        {trend && (
          <div style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '8px',
            background: trend > 0 
              ? 'rgba(16, 185, 129, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            color: trend > 0 ? '#10b981' : '#ef4444',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            {trend > 0 ? '↗️' : '↘️'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: darkMode ? '#f1f5f9' : '#1f2937',
        margin: '0 0 0.25rem 0'
      }}>
        {value.toLocaleString()}
      </h3>
      <p style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        color: darkMode ? '#cbd5e1' : '#374151',
        margin: '0 0 0.25rem 0'
      }}>
        {title}
      </p>
      {subtitle && (
        <p style={{
          fontSize: '0.75rem',
          color: darkMode ? '#94a3b8' : '#6b7280',
          margin: 0
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );

  const ProgressBar = ({ label, value, max, color, percentage }) => (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: '500',
          color: darkMode ? '#cbd5e1' : '#374151'
        }}>
          {label}
        </span>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: darkMode ? '#f1f5f9' : '#1f2937'
        }}>
          {value} ({percentage}%)
        </span>
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        background: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.5)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );

  const ColorSwatch = ({ color, name, usage }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      background: darkMode 
        ? 'rgba(15, 23, 42, 0.5)' 
        : 'rgba(248, 250, 252, 0.5)',
      borderRadius: '8px',
      marginBottom: '0.5rem'
    }}>
      <div style={{
        width: '24px',
        height: '24px',
        backgroundColor: color,
        borderRadius: '4px',
        border: '2px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }} />
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: '0.875rem',
          fontWeight: '500',
          color: darkMode ? '#cbd5e1' : '#374151',
          margin: 0
        }}>
          {name}
        </p>
        <p style={{
          fontSize: '0.75rem',
          color: darkMode ? '#94a3b8' : '#6b7280',
          margin: 0
        }}>
          {usage}% de uso
        </p>
      </div>
    </div>
  );

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
        maxWidth: '1200px',
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
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: darkMode ? '#f1f5f9' : '#1f2937',
                margin: 0
              }}>
                Analytics Dashboard
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: darkMode ? '#94a3b8' : '#6b7280',
                margin: 0
              }}>
                Insights detalhados sobre seus QR Codes
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
                borderRadius: '8px',
                background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                color: darkMode ? '#f1f5f9' : '#374151',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
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
                fontSize: '1.25rem',
                transition: 'all 0.2s ease'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <StatCard
            title="QR Codes Gerados"
            value={detailedStats.totalGenerated}
            icon="📱"
            color="linear-gradient(135deg, #3b82f6, #1d4ed8)"
            subtitle="Total criado"
            trend={12}
          />
          <StatCard
            title="Downloads"
            value={detailedStats.totalDownloads}
            icon="⬇️"
            color="linear-gradient(135deg, #10b981, #059669)"
            subtitle="Arquivos baixados"
            trend={8}
          />
          <StatCard
            title="Taxa de Conversão"
            value={Math.round((detailedStats.totalDownloads / detailedStats.totalGenerated) * 100)}
            icon="📊"
            color="linear-gradient(135deg, #f59e0b, #d97706)"
            subtitle="Downloads/Gerados"
            trend={-2}
          />
          <StatCard
            title="Tamanho Médio"
            value={detailedStats.averageSize}
            icon="📏"
            color="linear-gradient(135deg, #8b5cf6, #7c3aed)"
            subtitle="Pixels"
            trend={5}
          />
        </div>

        {/* Charts and Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {/* Templates Mais Usados */}
          <div style={{
            background: darkMode 
              ? 'rgba(15, 23, 42, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: darkMode 
              ? '1px solid rgba(71, 85, 105, 0.5)' 
              : '1px solid rgba(229, 231, 235, 0.5)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📋 Templates Favoritos
            </h3>
            
            {detailedStats.favoriteTemplates.map((template, index) => (
              <ProgressBar
                key={template.name}
                label={template.name}
                value={template.count}
                max={detailedStats.favoriteTemplates[0]?.count || 1}
                percentage={template.percentage}
                color={[
                  'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  'linear-gradient(135deg, #10b981, #059669)',
                  'linear-gradient(135deg, #f59e0b, #d97706)',
                  'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  'linear-gradient(135deg, #ef4444, #dc2626)'
                ][index]}
              />
            ))}
          </div>

          {/* Dispositivos */}
          <div style={{
            background: darkMode 
              ? 'rgba(15, 23, 42, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: darkMode 
              ? '1px solid rgba(71, 85, 105, 0.5)' 
              : '1px solid rgba(229, 231, 235, 0.5)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📱 Dispositivos Utilizados
            </h3>
            
            <ProgressBar
              label="📱 Mobile"
              value={detailedStats.deviceStats.mobile}
              percentage={detailedStats.deviceStats.mobile}
              color="linear-gradient(135deg, #3b82f6, #1d4ed8)"
            />
            <ProgressBar
              label="💻 Desktop"
              value={detailedStats.deviceStats.desktop}
              percentage={detailedStats.deviceStats.desktop}
              color="linear-gradient(135deg, #10b981, #059669)"
            />
            <ProgressBar
              label="📱 Tablet"
              value={detailedStats.deviceStats.tablet}
              percentage={detailedStats.deviceStats.tablet}
              color="linear-gradient(135deg, #f59e0b, #d97706)"
            />
          </div>

          {/* Formatos */}
          <div style={{
            background: darkMode 
              ? 'rgba(15, 23, 42, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: darkMode 
              ? '1px solid rgba(71, 85, 105, 0.5)' 
              : '1px solid rgba(229, 231, 235, 0.5)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              💾 Formatos Preferidos
            </h3>
            
            <ProgressBar
              label="PNG"
              value={detailedStats.formatStats.png}
              percentage={detailedStats.formatStats.png}
              color="linear-gradient(135deg, #3b82f6, #1d4ed8)"
            />
            <ProgressBar
              label="SVG"
              value={detailedStats.formatStats.svg}
              percentage={detailedStats.formatStats.svg}
              color="linear-gradient(135deg, #10b981, #059669)"
            />
            <ProgressBar
              label="PDF"
              value={detailedStats.formatStats.pdf}
              percentage={detailedStats.formatStats.pdf}
              color="linear-gradient(135deg, #f59e0b, #d97706)"
            />
          </div>

          {/* Cores Populares */}
          <div style={{
            background: darkMode 
              ? 'rgba(15, 23, 42, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: darkMode 
              ? '1px solid rgba(71, 85, 105, 0.5)' 
              : '1px solid rgba(229, 231, 235, 0.5)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🎨 Cores Mais Usadas
            </h3>
            
            {detailedStats.popularColors.map((colorData) => (
              <ColorSwatch
                key={colorData.color}
                color={colorData.color}
                name={colorData.name}
                usage={colorData.usage}
              />
            ))}
          </div>
        </div>

        {/* Pro Features Notice */}
        {user?.plan !== 'pro' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#8b5cf6',
              marginBottom: '0.5rem'
            }}>
              🚀 Desbloqueie Analytics Avançados
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: darkMode ? '#c4b5fd' : '#7c3aed',
              marginBottom: '1rem'
            }}>
              Upgrade para PRO e tenha acesso a relatórios em tempo real, exportação de dados,
              análise de performance e muito mais!
            </p>
            <button style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              ⬆️ Fazer Upgrade
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 