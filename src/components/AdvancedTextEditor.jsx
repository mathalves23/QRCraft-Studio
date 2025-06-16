import { useState, useRef } from 'react';

const AdvancedTextEditor = ({ isOpen, onClose, onTextResult, darkMode, showNotification, user }) => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textAlign, setTextAlign] = useState('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [lineHeight, setLineHeight] = useState(1.4);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textTransform, setTextTransform] = useState('none');
  const textareaRef = useRef(null);

  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 
    'Verdana', 'Tahoma', 'Impact', 'Courier New', 
    'Comic Sans MS', 'Trebuchet MS', 'Palatino', 'Garamond'
  ];

  const templates = [
    {
      name: 'Cartão de Visita',
      text: 'João Silva\nDesenvolvedor Full Stack\n📧 joao@email.com\n📱 (11) 99999-9999\n🌐 www.joaosilva.dev'
    },
    {
      name: 'Evento',
      text: 'WORKSHOP REACT AVANÇADO\n📅 15 de Janeiro, 2024\n🕐 14:00 - 18:00\n📍 São Paulo Tech Hub\n🎟️ Inscrições: evento.com/react'
    },
    {
      name: 'Menu Restaurante',
      text: '🍕 PIZZA MARGHERITA - R$ 25,00\nMussarela, tomate, manjericão\n\n🍔 BURGER ARTESANAL - R$ 22,00\nCarne 180g, queijo, bacon\n\n🥗 SALADA CAESAR - R$ 18,00\nAlface, croutons, parmesão'
    },
    {
      name: 'Promoção',
      text: '🎉 OFERTA ESPECIAL 🎉\n\n50% OFF\nEM TODOS OS PRODUTOS\n\nVálido até 31/12/2024\nCódigo: SAVE50\n\nwww.loja.com.br'
    }
  ];

  const applyTemplate = (template) => {
    setText(template.text);
    showNotification(`Template "${template.name}" aplicado!`, 'success');
  };

  const formatText = (command, value = null) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    
    let newText = text;
    
    switch (command) {
      case 'bold':
        if (selectedText) {
          newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
        }
        break;
      case 'italic':
        if (selectedText) {
          newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
        }
        break;
      case 'uppercase':
        if (selectedText) {
          newText = text.substring(0, start) + selectedText.toUpperCase() + text.substring(end);
        }
        break;
      case 'lowercase':
        if (selectedText) {
          newText = text.substring(0, start) + selectedText.toLowerCase() + text.substring(end);
        }
        break;
      case 'center':
        const lines = text.split('\n');
        const currentLine = text.substring(0, start).split('\n').length - 1;
        lines[currentLine] = `      ${lines[currentLine].trim()}      `;
        newText = lines.join('\n');
        break;
    }
    
    setText(newText);
  };

  const insertSymbol = (symbol) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = text.substring(0, start) + symbol + text.substring(end);
    setText(newText);
    
    // Mover cursor para depois do símbolo
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + symbol.length, start + symbol.length);
    }, 0);
  };

  const symbols = [
    '📱', '📧', '🌐', '📍', '📞', '💼', '🏢', '🎉', '🎊', '🔥',
    '⭐', '💰', '🎯', '📅', '🕐', '✅', '❌', '🔔', '🎁', '🏆',
    '→', '←', '↑', '↓', '✓', '✗', '♠', '♥', '♦', '♣'
  ];

  const getPreviewStyle = () => ({
    fontFamily,
    fontSize: `${fontSize}px`,
    textAlign,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    color: textColor,
    backgroundColor: backgroundColor,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    textTransform,
    padding: '1rem',
    borderRadius: '8px',
    minHeight: '150px',
    whiteSpace: 'pre-wrap',
    border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
    background: backgroundColor
  });

  const handleSave = () => {
    if (!text.trim()) {
      showNotification('Digite algum texto antes de salvar', 'error');
      return;
    }

    const formattedText = text;
    onTextResult(formattedText);
    showNotification('Texto formatado aplicado!', 'success');
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
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              margin: 0
            }}>
              Editor de Texto Avançado
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem'
        }}>
          {/* Editor Panel */}
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              marginBottom: '1rem'
            }}>
              ✏️ Editor
            </h3>

            {/* Templates */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: darkMode ? '#cbd5e1' : '#374151',
                marginBottom: '0.5rem'
              }}>
                📝 Templates Rápidos
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '0.5rem'
              }}>
                {templates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => applyTemplate(template)}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Toolbar */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
              padding: '0.75rem',
              background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
              borderRadius: '8px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => formatText('bold')}
                style={{
                  background: isBold ? '#3b82f6' : 'transparent',
                  color: isBold ? 'white' : darkMode ? '#cbd5e1' : '#374151',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                B
              </button>
              <button
                onClick={() => formatText('italic')}
                style={{
                  background: isItalic ? '#3b82f6' : 'transparent',
                  color: isItalic ? 'white' : darkMode ? '#cbd5e1' : '#374151',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontStyle: 'italic'
                }}
              >
                I
              </button>
              <button
                onClick={() => formatText('uppercase')}
                style={{
                  background: 'transparent',
                  color: darkMode ? '#cbd5e1' : '#374151',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                ABC
              </button>
              <button
                onClick={() => formatText('center')}
                style={{
                  background: 'transparent',
                  color: darkMode ? '#cbd5e1' : '#374151',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                ⚌
              </button>
            </div>

            {/* Symbols */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: darkMode ? '#cbd5e1' : '#374151',
                marginBottom: '0.5rem'
              }}>
                😀 Símbolos e Emojis
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 1fr)',
                gap: '0.25rem',
                padding: '0.75rem',
                background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                borderRadius: '8px'
              }}>
                {symbols.map((symbol, index) => (
                  <button
                    key={index}
                    onClick={() => insertSymbol(symbol)}
                    style={{
                      background: 'transparent',
                      border: '1px solid transparent',
                      borderRadius: '4px',
                      padding: '0.25rem',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.borderColor = 'transparent';
                    }}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Area */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite seu texto aqui..."
              style={{
                width: '100%',
                height: '300px',
                padding: '1rem',
                border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'monospace',
                background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                color: darkMode ? '#f1f5f9' : '#374151',
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>

          {/* Settings and Preview Panel */}
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              marginBottom: '1rem'
            }}>
              🎨 Formatação & Preview
            </h3>

            {/* Formatting Controls */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: darkMode ? '#cbd5e1' : '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Fonte
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
                    borderRadius: '6px',
                    background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    color: darkMode ? '#f1f5f9' : '#374151'
                  }}
                >
                  {fonts.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: darkMode ? '#cbd5e1' : '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Tamanho: {fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="48"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  style={{
                    width: '100%',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>

            {/* Preview */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: darkMode ? '#cbd5e1' : '#374151',
                marginBottom: '0.5rem'
              }}>
                👁️ Preview
              </label>
              <div style={getPreviewStyle()}>
                {text || 'Digite algo para ver o preview...'}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                onClick={handleSave}
                disabled={!text.trim()}
                style={{
                  flex: 1,
                  background: !text.trim()
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: !text.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                ✅ Aplicar Texto
              </button>
              
              <button
                onClick={() => setText('')}
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                🗑️ Limpar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTextEditor; 