import React, { useState, useEffect } from 'react';
import jsQR from 'jsqr';

const QRCodeTester = ({ isOpen, qrCode, qrData, darkMode, onClose, showNotification }) => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [testScore, setTestScore] = useState(0);
  const [testDetails, setTestDetails] = useState([]);

  // Testar QR Code automaticamente quando receber um novo
  useEffect(() => {
    if (qrCode) {
      testQRCode();
    }
  }, [qrCode]);

  const testQRCode = async () => {
    if (!qrCode) return;
    
    setIsLoading(true);
    setTestResult(null);
    
    try {
      // Criar um canvas para testar o QR Code
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Tentar ler o QR Code
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        const details = [];
        let score = 0;
        
        if (code) {
          setScanResult(code.data);
          
          // Teste 1: Leitura bem-sucedida
          details.push({
            test: 'Leitura do QR Code',
            status: 'success',
            message: 'QR Code pode ser lido perfeitamente',
            points: 25
          });
          score += 25;
          
          // Teste 2: Conteúdo correto
          const contentMatches = code.data === qrData;
          details.push({
            test: 'Validação de Conteúdo',
            status: contentMatches ? 'success' : 'warning',
            message: contentMatches 
              ? 'Conteúdo codificado corretamente' 
              : 'Conteúdo pode ter sido modificado durante a codificação',
            points: contentMatches ? 25 : 15
          });
          score += contentMatches ? 25 : 15;
          
          // Teste 3: Detecção de qualidade (baseado na confiança do jsQR)
          const hasLocation = code.location && code.location.topLeftCorner;
          details.push({
            test: 'Qualidade de Detecção',
            status: hasLocation ? 'success' : 'warning',
            message: hasLocation 
              ? 'QR Code bem definido e fácil de detectar' 
              : 'QR Code detectado mas pode ter problemas de nitidez',
            points: hasLocation ? 20 : 10
          });
          score += hasLocation ? 20 : 10;
          
          // Teste 4: Análise do tamanho
          const size = Math.min(img.width, img.height);
          let sizeStatus = 'success';
          let sizeMessage = 'Tamanho ideal para impressão e leitura';
          let sizePoints = 15;
          
          if (size < 100) {
            sizeStatus = 'error';
            sizeMessage = 'QR Code muito pequeno - pode ser difícil de ler';
            sizePoints = 5;
          } else if (size < 200) {
            sizeStatus = 'warning';
            sizeMessage = 'QR Code pequeno - considere aumentar o tamanho';
            sizePoints = 10;
          }
          
          details.push({
            test: 'Análise de Tamanho',
            status: sizeStatus,
            message: `${sizeMessage} (${size}x${size}px)`,
            points: sizePoints
          });
          score += sizePoints;
          
          // Teste 5: Teste de URL (se aplicável)
          if (qrData && qrData.startsWith('http')) {
            details.push({
              test: 'Validação de URL',
              status: 'info',
              message: 'URL será testada quando escaneada por um dispositivo',
              points: 15
            });
            score += 15;
          } else {
            details.push({
              test: 'Tipo de Conteúdo',
              status: 'success',
              message: detectContentType(qrData || ''),
              points: 15
            });
            score += 15;
          }
          
        } else {
          // QR Code não pôde ser lido
          details.push({
            test: 'Leitura do QR Code',
            status: 'error',
            message: 'Não foi possível ler o QR Code - verifique contraste e qualidade',
            points: 0
          });
          
          details.push({
            test: 'Diagnóstico',
            status: 'info',
            message: 'Tente aumentar o contraste ou o tamanho do QR Code',
            points: 0
          });
        }
        
        setTestDetails(details);
        setTestScore(Math.min(score, 100));
        setTestResult(code ? 'success' : 'error');
        setIsLoading(false);
      };
      
      img.src = qrCode;
      
    } catch (error) {
      console.error('Erro ao testar QR Code:', error);
      setTestResult('error');
      setTestDetails([{
        test: 'Erro no Teste',
        status: 'error',
        message: 'Erro interno ao testar o QR Code',
        points: 0
      }]);
      setIsLoading(false);
    }
  };

  const detectContentType = (content) => {
    if (content.startsWith('mailto:')) return 'E-mail detectado corretamente';
    if (content.startsWith('tel:')) return 'Número de telefone detectado';
    if (content.startsWith('WIFI:')) return 'Configuração WiFi detectada';
    if (content.startsWith('geo:')) return 'Coordenadas geográficas detectadas';
    if (content.startsWith('BEGIN:VCARD')) return 'Cartão de visita (vCard) detectado';
    if (content.startsWith('BEGIN:VEVENT')) return 'Evento de calendário detectado';
    return 'Conteúdo de texto livre detectado';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // verde
    if (score >= 60) return '#f59e0b'; // amarelo
    return '#ef4444'; // vermelho
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Muito Bom';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Precisa Melhorar';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📋';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
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
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
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
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              🧪
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              margin: 0
            }}>
              Teste do QR Code
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
              fontSize: '1.25rem',
              transition: 'all 0.2s ease'
            }}
          >
            ✕
          </button>
        </div>

        {/* Score */}
        {!isLoading && testResult && (
          <div style={{
            background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'center',
            border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: getScoreColor(testScore),
              marginBottom: '0.5rem'
            }}>
              {testScore}%
            </div>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: darkMode ? '#cbd5e1' : '#374151',
              marginBottom: '0.25rem'
            }}>
              {getScoreLabel(testScore)}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: darkMode ? '#94a3b8' : '#6b7280'
            }}>
              Pontuação geral do QR Code
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div style={{
            textAlign: 'center',
            padding: '3rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(59, 130, 246, 0.3)',
              borderTop: '3px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{
              fontSize: '1rem',
              color: darkMode ? '#cbd5e1' : '#374151'
            }}>
              Testando QR Code...
            </p>
          </div>
        )}

        {/* Test Results */}
        {!isLoading && testDetails.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              marginBottom: '1rem'
            }}>
              Resultados dos Testes
            </h3>
            
            <div style={{ space: '0.75rem' }}>
              {testDetails.map((detail, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: darkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                  borderRadius: '12px',
                  marginBottom: '0.75rem',
                  border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.3)'}`
                }}>
                  <div style={{ fontSize: '1.25rem', flexShrink: 0 }}>
                    {getStatusIcon(detail.status)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: darkMode ? '#f1f5f9' : '#1f2937',
                      marginBottom: '0.25rem'
                    }}>
                      {detail.test}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: darkMode ? '#94a3b8' : '#6b7280',
                      lineHeight: '1.4'
                    }}>
                      {detail.message}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: getScoreColor(detail.points),
                    flexShrink: 0
                  }}>
                    +{detail.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scanned Content */}
        {scanResult && (
          <div style={{
            background: darkMode 
              ? 'rgba(59, 130, 246, 0.1)' 
              : 'rgba(59, 130, 246, 0.05)',
            border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: darkMode ? '#93c5fd' : '#1d4ed8',
              marginBottom: '0.5rem'
            }}>
              Conteúdo Escaneado:
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: darkMode ? '#bfdbfe' : '#1e40af',
              wordBreak: 'break-all',
              margin: 0,
              fontFamily: 'monospace',
              background: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)',
              padding: '0.5rem',
              borderRadius: '6px'
            }}>
              {scanResult}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={testQRCode}
            disabled={isLoading}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '0.75rem 1rem',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            🔄 Testar Novamente
          </button>
          
          <button
            onClick={onClose}
            style={{
              flex: 1,
              minWidth: '120px',
              padding: '0.75rem 1rem',
              background: 'transparent',
              color: darkMode ? '#cbd5e1' : '#374151',
              border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Fechar
          </button>
        </div>

        {/* Tips */}
        <div style={{
          background: darkMode 
            ? 'rgba(16, 185, 129, 0.1)' 
            : 'rgba(16, 185, 129, 0.05)',
          border: `1px solid ${darkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
          borderRadius: '12px',
          padding: '1rem',
          marginTop: '1.5rem'
        }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: darkMode ? '#6ee7b7' : '#047857',
            marginBottom: '0.5rem'
          }}>
            💡 Dicas para QR Codes perfeitos:
          </h4>
          <ul style={{
            fontSize: '0.75rem',
            color: darkMode ? '#a7f3d0' : '#065f46',
            margin: 0,
            paddingLeft: '1rem'
          }}>
            <li>Use alto contraste entre cores (preto/branco é ideal)</li>
            <li>Mantenha tamanho mínimo de 200x200px para impressão</li>
            <li>Evite cores muito claras ou muito escuras demais</li>
            <li>Teste sempre em diferentes dispositivos</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default QRCodeTester; 