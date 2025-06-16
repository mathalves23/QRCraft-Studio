import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';

const QRScanner = ({ isOpen, onClose, onScanResult, darkMode, showNotification }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [scanMethod, setScanMethod] = useState('camera'); // 'camera' ou 'file'
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Verificar se há câmera disponível
  useEffect(() => {
    if (isOpen) {
      checkCameraAvailability();
    }
    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setHasCamera(videoDevices.length > 0);
      
      if (videoDevices.length === 0) {
        setCameraError('Nenhuma câmera encontrada');
        setScanMethod('file');
      }
    } catch (error) {
      console.error('Erro ao verificar câmeras:', error);
      setHasCamera(false);
      setCameraError('Erro ao acessar câmeras');
      setScanMethod('file');
    }
  };

  const startCamera = async () => {
    if (!hasCamera) {
      showNotification('Câmera não disponível', 'error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Preferir câmera traseira
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        setCameraError('');
        
        // Iniciar escaneamento contínuo
        scanIntervalRef.current = setInterval(scanFrame, 100);
      }
    } catch (error) {
      console.error('Erro ao iniciar câmera:', error);
      setCameraError('Erro ao acessar a câmera. Verifique as permissões.');
      showNotification('Erro ao acessar a câmera', 'error');
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    setIsScanning(false);
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        handleScanSuccess(code.data);
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          handleScanSuccess(code.data);
        } else {
          showNotification('Nenhum QR Code encontrado na imagem', 'error');
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleScanSuccess = (data) => {
    stopScanning();
    onScanResult(data);
    showNotification('QR Code lido com sucesso!', 'success');
    onClose();
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
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              margin: 0
            }}>
              Scanner de QR Code
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
            onMouseOver={(e) => {
              e.target.style.background = darkMode ? 'rgba(71, 85, 105, 0.8)' : 'rgba(229, 231, 235, 0.8)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 0.5)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Método de Scan */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.5rem',
            background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(241, 245, 249, 0.8)',
            borderRadius: '12px'
          }}>
            <button
              onClick={() => setScanMethod('camera')}
              disabled={!hasCamera}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: scanMethod === 'camera' && hasCamera
                  ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                  : 'transparent',
                color: scanMethod === 'camera' && hasCamera
                  ? 'white'
                  : darkMode ? '#cbd5e1' : '#374151',
                cursor: hasCamera ? 'pointer' : 'not-allowed',
                fontWeight: '500',
                opacity: !hasCamera ? 0.5 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              📹 Câmera
            </button>
            <button
              onClick={() => setScanMethod('file')}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: scanMethod === 'file'
                  ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                  : 'transparent',
                color: scanMethod === 'file'
                  ? 'white'
                  : darkMode ? '#cbd5e1' : '#374151',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              📂 Arquivo
            </button>
          </div>
        </div>

        {/* Scanner Content */}
        <div style={{ textAlign: 'center' }}>
          {scanMethod === 'camera' ? (
            <div>
              {cameraError ? (
                <div style={{
                  background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
                  border: '1px solid #f87171',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  color: '#dc2626',
                  marginBottom: '1rem'
                }}>
                  <strong>⚠️ {cameraError}</strong>
                  <p style={{ margin: '0.5rem 0 0' }}>
                    Tente usar o upload de arquivo em vez da câmera.
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{
                    position: 'relative',
                    background: darkMode ? '#1e293b' : '#f3f4f6',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    marginBottom: '1.5rem'
                  }}>
                    <video
                      ref={videoRef}
                      style={{
                        width: '100%',
                        maxHeight: '300px',
                        objectFit: 'cover'
                      }}
                      playsInline
                      muted
                    />
                    
                    {isScanning && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '200px',
                        height: '200px',
                        border: '3px solid #3b82f6',
                        borderRadius: '16px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          color: '#3b82f6',
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          textAlign: 'center'
                        }}>
                          🔍<br/>Posicione o QR Code<br/>dentro desta área
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={isScanning ? stopScanning : startCamera}
                    style={{
                      background: isScanning 
                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isScanning ? '⏹️ Parar Scanner' : '▶️ Iniciar Scanner'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${darkMode ? '#475569' : '#d1d5db'}`,
                  borderRadius: '16px',
                  padding: '3rem 2rem',
                  cursor: 'pointer',
                  background: darkMode 
                    ? 'rgba(15, 23, 42, 0.5)' 
                    : 'rgba(248, 250, 252, 0.5)',
                  transition: 'all 0.2s ease',
                  marginBottom: '1.5rem'
                }}
                onMouseOver={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = darkMode 
                    ? 'rgba(59, 130, 246, 0.1)' 
                    : 'rgba(59, 130, 246, 0.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = darkMode ? '#475569' : '#d1d5db';
                  e.target.style.background = darkMode 
                    ? 'rgba(15, 23, 42, 0.5)' 
                    : 'rgba(248, 250, 252, 0.5)';
                }}
              >
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  📂
                </div>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: darkMode ? '#cbd5e1' : '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Clique para selecionar uma imagem
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: darkMode ? '#94a3b8' : '#6b7280'
                }}>
                  Suporta JPG, PNG, GIF e outros formatos de imagem
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>

        {/* Canvas oculto para processamento */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />

        {/* Info */}
        <div style={{
          background: darkMode 
            ? 'rgba(59, 130, 246, 0.1)' 
            : 'rgba(59, 130, 246, 0.05)',
          border: `1px solid ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
          borderRadius: '12px',
          padding: '1rem',
          marginTop: '1.5rem'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: darkMode ? '#93c5fd' : '#1d4ed8',
            margin: 0,
            textAlign: 'center'
          }}>
            💡 Dica: Para melhores resultados, certifique-se de que o QR Code esteja bem iluminado e nítido
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner; 