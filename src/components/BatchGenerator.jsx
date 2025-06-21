import React from 'react';

const BatchGenerator = ({ 
  batchTexts = [''], 
  setBatchTexts = () => {}, 
  onGenerate, 
  isGenerating, 
  darkMode, 
  showNotification = () => {},
  onClose,
  isOpen = true
}) => {
  if (!isOpen) return null;

  const addTextInput = () => {
    setBatchTexts([...batchTexts, '']);
  };

  const removeTextInput = (index) => {
    if (batchTexts.length > 1) {
      setBatchTexts(batchTexts.filter((_, i) => i !== index));
    }
  };

  const updateText = (index, value) => {
    const newTexts = [...batchTexts];
    newTexts[index] = value;
    setBatchTexts(newTexts);
  };

  const fillSampleData = () => {
    const samples = [
      'https://www.google.com',
      'https://www.github.com',
      'https://www.youtube.com',
      'Texto de exemplo 1',
      'Texto de exemplo 2'
    ];
    setBatchTexts(samples);
    showNotification('Dados de exemplo preenchidos!', 'success');
  };

  const clearAll = () => {
    setBatchTexts(['']);
    showNotification('Todos os campos limpos!', 'info');
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        setBatchTexts(lines);
        showNotification(`${lines.length} itens colados da área de transferência!`, 'success');
      }
    } catch (error) {
      showNotification('Erro ao acessar área de transferência', 'error');
    }
  };

  const validTexts = (batchTexts || []).filter(text => text.trim());

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '2rem',
        border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'hidden',
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem'
            }}>
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              margin: 0
            }}>
              📦 Geração em Lote
            </h2>
          </div>
          
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: darkMode ? '#9ca3af' : '#6b7280',
              padding: '0.5rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={addTextInput}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            ➕ Adicionar Campo
          </button>
          
          <button
            onClick={fillSampleData}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            📝 Exemplo
          </button>
          
          <button
            onClick={pasteFromClipboard}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            📋 Colar
          </button>
          
          <button
            onClick={clearAll}
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

        {/* Status */}
        <div style={{
          background: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
          border: `1px solid ${darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(229, 231, 235, 0.5)'}`,
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: darkMode ? '#cbd5e1' : '#6b7280'
          }}>
            📊 Status: {validTexts.length} de {batchTexts.length} campos válidos
          </div>
        </div>

        {/* Text Inputs */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {batchTexts.map((text, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                minWidth: '2rem',
                height: '2rem',
                background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                color: 'white',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {index + 1}
              </div>
              
              <input
                type="text"
                value={text}
                onChange={(e) => updateText(index, e.target.value)}
                placeholder={`Digite o texto ${index + 1}...`}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  color: darkMode ? '#f1f5f9' : '#374151',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
              
              {batchTexts.length > 1 && (
                <button
                  onClick={() => removeTextInput(index)}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              background: darkMode ? 'rgba(71, 85, 105, 0.8)' : 'rgba(156, 163, 175, 0.8)',
              color: darkMode ? '#f1f5f9' : '#374151',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Cancelar
          </button>
          
          <button
            onClick={onGenerate}
            disabled={isGenerating || validTexts.length === 0}
            style={{
              background: isGenerating || validTexts.length === 0
                ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: isGenerating || validTexts.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isGenerating ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Gerando...
              </>
            ) : (
              <>
                🚀 Gerar {validTexts.length} QR Codes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchGenerator; 