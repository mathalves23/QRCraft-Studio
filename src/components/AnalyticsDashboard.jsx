import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { analyticsHelpers } from '@/lib/supabase';

const AnalyticsDashboard = ({ isOpen, onClose, darkMode, showNotification }) => {
  const { user, isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y
  const [selectedMetric, setSelectedMetric] = useState('generated');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
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
    if (isOpen && isAuthenticated && user) {
      loadAnalyticsData();
    }
  }, [isOpen, timeRange, isAuthenticated, user]);

  const loadAnalyticsData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const days = getDaysFromRange(timeRange);
      
      // Carregar dados em paralelo
      const [generalStats, typeStats, dailyActivity] = await Promise.all([
        analyticsHelpers.getGeneralStats(user.id),
        analyticsHelpers.getQRStatsByType(user.id, days),
        analyticsHelpers.getDailyActivity(user.id, days)
      ]);

      if (generalStats.error || typeStats.error || dailyActivity.error) {
        throw new Error('Erro ao carregar dados de analytics');
      }

      setStats({
        totalGenerated: generalStats.data.totalGenerated,
        totalDownloads: generalStats.data.totalDownloads,
        favoriteTemplates: typeStats.data || [],
        deviceStats: {
          mobile: 65,
          desktop: 28,
          tablet: 7
        }, // TODO: Implementar tracking de device
        formatStats: {
          png: 78,
          svg: 15,
          pdf: 7
        }, // TODO: Implementar tracking de formato
        dailyActivity: dailyActivity.data || [],
        popularColors: [
          { color: '#000000', count: 45, percentage: 35 },
          { color: '#3B82F6', count: 32, percentage: 25 },
          { color: '#10B981', count: 25, percentage: 20 },
          { color: '#8B5CF6', count: 15, percentage: 12 },
          { color: '#F59E0B', count: 10, percentage: 8 }
        ], // TODO: Implementar tracking de cores
        averageSize: 256,
        topQRs: generalStats.data.topQRs || []
      });

    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
      showNotification?.('Erro ao carregar dados de analytics', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysFromRange = (range) => {
    const ranges = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    return ranges[range] || 7;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const getMetricColor = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    if (percentage >= 40) return '#3b82f6';
    return '#8b5cf6';
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: darkMode ? '#cbd5e1' : '#374151'
          }}>
            Faça login para ver analytics
          </h3>
          <p style={{
            color: darkMode ? '#94a3b8' : '#6b7280',
            marginBottom: '1.5rem'
          }}>
            Entre na sua conta para acessar dados detalhados
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
        maxWidth: '1000px',
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
              📊
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              margin: 0
            }}>
              Analytics Dashboard
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

        {/* Time Range Selector */}
        <div style={{
          display: 'flex',
          marginBottom: '2rem',
          background: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
          borderRadius: '12px',
          padding: '0.25rem'
        }}>
          {[
            { key: '7d', label: '7 dias' },
            { key: '30d', label: '30 dias' },
            { key: '90d', label: '90 dias' },
            { key: '1y', label: '1 ano' }
          ].map(range => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: timeRange === range.key 
                  ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                  : 'transparent',
                color: timeRange === range.key 
                  ? 'white' 
                  : darkMode ? '#cbd5e1' : '#374151',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {range.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(139, 92, 246, 0.3)',
              borderTop: '3px solid #8b5cf6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{
              fontSize: '1rem',
              color: darkMode ? '#cbd5e1' : '#374151'
            }}>
              Carregando analytics...
            </p>
          </div>
        ) : (
          <>
            {/* Main Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#10b981',
                  marginBottom: '0.5rem'
                }}>
                  {stats.totalGenerated}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: darkMode ? '#94a3b8' : '#6b7280'
                }}>
                  QR Codes Gerados
                </div>
              </div>

              <div style={{
                background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  marginBottom: '0.5rem'
                }}>
                  {stats.totalDownloads}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: darkMode ? '#94a3b8' : '#6b7280'
                }}>
                  Downloads Totais
                </div>
              </div>

              <div style={{
                background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#8b5cf6',
                  marginBottom: '0.5rem'
                }}>
                  {stats.totalDownloads > 0 ? Math.round((stats.totalDownloads / stats.totalGenerated) * 100) : 0}%
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: darkMode ? '#94a3b8' : '#6b7280'
                }}>
                  Taxa de Download
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {/* Templates Favoritos */}
              <div style={{
                background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: darkMode ? '#f1f5f9' : '#1f2937',
                  marginBottom: '1rem'
                }}>
                  Templates Mais Usados
                </h3>
                
                {stats.favoriteTemplates.length === 0 ? (
                  <p style={{
                    color: darkMode ? '#94a3b8' : '#6b7280',
                    textAlign: 'center',
                    padding: '2rem'
                  }}>
                    Nenhum dado disponível
                  </p>
                ) : (
                  <div style={{ space: '0.75rem' }}>
                    {stats.favoriteTemplates.map((template, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem'
                      }}>
                        <div>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: darkMode ? '#f1f5f9' : '#1f2937'
                          }}>
                            {template.name}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: darkMode ? '#94a3b8' : '#6b7280'
                          }}>
                            {template.count} usos
                          </div>
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: getMetricColor(template.count, stats.favoriteTemplates[0]?.count || 1)
                        }}>
                          {template.percentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Atividade Diária */}
              <div style={{
                background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: darkMode ? '#f1f5f9' : '#1f2937',
                  marginBottom: '1rem'
                }}>
                  Atividade Diária
                </h3>
                
                {stats.dailyActivity.length === 0 ? (
                  <p style={{
                    color: darkMode ? '#94a3b8' : '#6b7280',
                    textAlign: 'center',
                    padding: '2rem'
                  }}>
                    Nenhum dado disponível
                  </p>
                ) : (
                  <div style={{ space: '0.5rem' }}>
                    {stats.dailyActivity.map((day, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        background: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{
                          fontSize: '0.875rem',
                          color: darkMode ? '#cbd5e1' : '#374151'
                        }}>
                          {formatDate(day.date)}
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '0.75rem'
                        }}>
                          <span style={{ color: '#10b981' }}>
                            📱 {day.generated}
                          </span>
                          <span style={{ color: '#3b82f6' }}>
                            ⬇️ {day.downloaded}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top QR Codes */}
            {stats.topQRs && stats.topQRs.length > 0 && (
              <div style={{
                background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: darkMode ? '#f1f5f9' : '#1f2937',
                  marginBottom: '1rem'
                }}>
                  QR Codes Mais Baixados
                </h3>
                
                <div style={{ space: '0.75rem' }}>
                  {stats.topQRs.map((qr, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      borderRadius: '12px',
                      background: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: darkMode ? '#f1f5f9' : '#1f2937',
                          marginBottom: '0.25rem'
                        }}>
                          {qr.template_type.toUpperCase()}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: darkMode ? '#94a3b8' : '#6b7280',
                          wordBreak: 'break-all'
                        }}>
                          {qr.content.length > 50 ? qr.content.substring(0, 50) + '...' : qr.content}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#10b981'
                      }}>
                        {qr.download_count || 0} downloads
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 