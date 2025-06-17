import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import TemplateSelector from './components/TemplateSelector';
import HistoryPanel from './components/HistoryPanel';
import SmartHistoryPanel from './components/SmartHistoryPanel';
import BatchGenerator from './components/BatchGenerator';
import QRScanner from './components/QRScanner';
import URLShortener from './components/URLShortener';
import Analytics from './components/Analytics';
import NotificationCenter, { useNotifications } from './components/NotificationCenter';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import PlanManager from './components/PlanManager';
import EmailVerificationBanner from './components/EmailVerificationBanner';
import EmailVerificationPage from './pages/EmailVerificationPage';
import Onboarding from './components/Onboarding';
import QRCodeTester from './components/QRCodeTester';
import { initEmailJS, cleanupExpiredTokens } from './services/emailService';
import './App.css';

function App() {
  // Estados principais
  const [text, setText] = useState('https://example.com');
  const [qrCode, setQrCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [size, setSize] = useState('256');
  
  // Novos estados para funcionalidades avançadas
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [format, setFormat] = useState('png');
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [analytics, setAnalytics] = useState({ generated: 0, downloaded: 0 });
  const [showBatch, setShowBatch] = useState(false);
  const [batchTexts, setBatchTexts] = useState(['']);
  const [showURLShortener, setShowURLShortener] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  
  // Estados de Autenticação
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showPlanManager, setShowPlanManager] = useState(false);

  // Estados dos novos componentes implementados
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQRTester, setShowQRTester] = useState(false);
  const [showSmartHistory, setShowSmartHistory] = useState(false);

  
  // Templates pré-definidos
  const templates = {
    custom: { name: 'Personalizado', fields: ['text'] },
    wifi: { name: 'WiFi', fields: ['ssid', 'password', 'security'] },
    vcard: { name: 'vCard', fields: ['name', 'phone', 'email', 'organization'] },
    sms: { name: 'SMS', fields: ['phone', 'message'] },
    email: { name: 'Email', fields: ['email', 'subject', 'body'] },
    maps: { name: 'Localização', fields: ['latitude', 'longitude'] },
    url: { name: 'URL', fields: ['url'] },
    social: { name: 'Redes Sociais', fields: ['platform', 'username'] }
  };
  
  const [templateData, setTemplateData] = useState({
    ssid: '', password: '', security: 'WPA',
    name: '', phone: '', email: '', organization: '',
    message: '', subject: '', body: '',
    latitude: '', longitude: '', url: '',
    platform: 'instagram', username: ''
  });

  // Sistema de notificações modernas
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => setNotification(null), 4000);
  }, []);
  
  const { unreadCount } = useNotifications();

  // Função para verificar recursos disponíveis baseado no plano
  const isFeatureAvailable = useCallback((feature) => {
    if (!user) return false;
    if (user.plan === 'pro') return true;
    
    const standardFeatures = ['url-qr', 'basic-templates'];
    const proFeatures = ['custom-qr', 'advanced-templates', 'batch-generation', 'analytics', 'url-shortener'];
    
    return standardFeatures.includes(feature);
  }, [user]);

  // Função de logout
  const handleLogout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('qrcraft-user');
    showNotification('Logout realizado com sucesso!', 'success');
  }, [showNotification]);

  // Função para carregar usuário do localStorage
  const loadUser = useCallback(() => {
    const savedUser = localStorage.getItem('qrcraft-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('qrcraft-user');
      }
    }
  }, []);

  // Verificar se deve mostrar onboarding
  const checkOnboarding = useCallback(() => {
    const hasCompletedOnboarding = localStorage.getItem('qrcraft-onboarding-completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Função para gerar texto baseado no template
  const generateTemplateText = useCallback(() => {
    switch (selectedTemplate) {
      case 'wifi':
        return `WIFI:T:${templateData.security};S:${templateData.ssid};P:${templateData.password};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${templateData.name}\nN:${templateData.name};;;;\nORG:${templateData.organization}\nTEL:${templateData.phone}\nEMAIL:${templateData.email}\nEND:VCARD`;
      case 'sms':
        return `SMS:${templateData.phone}:${templateData.message}`;
      case 'email':
        return `mailto:${templateData.email}?subject=${encodeURIComponent(templateData.subject)}&body=${encodeURIComponent(templateData.body)}`;
      case 'maps':
        return `geo:${templateData.latitude},${templateData.longitude}`;
      case 'url':
        return templateData.url;
      case 'social':
        // Mapear diferentes plataformas para URLs corretas
        const platformUrls = {
          instagram: `https://instagram.com/${templateData.username.replace('@', '')}`,
          twitter: `https://twitter.com/${templateData.username.replace('@', '')}`,
          linkedin: `https://linkedin.com/in/${templateData.username.replace('@', '')}`,
          tiktok: `https://tiktok.com/@${templateData.username.replace('@', '')}`,
          youtube: `https://youtube.com/@${templateData.username.replace('@', '')}`
        };
        return platformUrls[templateData.platform] || `https://${templateData.platform}.com/${templateData.username.replace('@', '')}`;
      case 'custom':
        return text;
      default:
        return text;
    }
  }, [selectedTemplate, templateData, text]);

  // Função principal para gerar QR Code
  const generateQRCode = async (inputText = null, skipNotification = false) => {
    const textToEncode = inputText || generateTemplateText();
    
    if (!textToEncode.trim()) {
      showNotification('Por favor, insira um texto ou preencha os campos necessários', 'error');
      return null;
    }

    setIsGenerating(true);
    try {
      const qrCodeDataURL = await QRCode.toDataURL(textToEncode, {
        width: parseInt(size),
        color: { dark: color, light: backgroundColor },
        errorCorrectionLevel: 'H',
        margin: 2,
      });
      
      setQrCode(qrCodeDataURL);
      
      // Adicionar ao histórico
      const historyItem = {
        id: Date.now(),
        text: textToEncode,
        template: selectedTemplate,
        size: parseInt(size),
        color,
        backgroundColor,
        timestamp: new Date().toISOString(),
        dataURL: qrCodeDataURL
      };
      
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Manter apenas 10 itens
      
      // Atualizar analytics
      setAnalytics(prev => ({ ...prev, generated: prev.generated + 1 }));
      

      
      // Salvar no localStorage
      localStorage.setItem('qrcraft-history', JSON.stringify([historyItem, ...history.slice(0, 9)]));
      localStorage.setItem('qrcraft-analytics', JSON.stringify({ ...analytics, generated: analytics.generated + 1 }));
      
      if (!skipNotification) {
        showNotification('QR Code gerado com sucesso!', 'success');
      }
      
      return qrCodeDataURL;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      showNotification('Erro ao gerar QR Code. Verifique os dados inseridos.', 'error');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Download com múltiplos formatos
  const downloadQRCode = async (selectedFormat = format) => {
    if (!qrCode) {
      showNotification('Gere um QR Code primeiro', 'error');
      return;
    }

    try {
      let downloadData = qrCode;
      let fileName = `qrcraft-${Date.now()}`;
      
      if (selectedFormat === 'svg') {
        // Gerar SVG
        const svgString = await QRCode.toString(generateTemplateText(), {
          type: 'svg',
          width: parseInt(size),
          color: { dark: color, light: backgroundColor },
          errorCorrectionLevel: 'H',
          margin: 2,
        });
        downloadData = 'data:image/svg+xml;base64,' + btoa(svgString);
        fileName += '.svg';
      } else if (selectedFormat === 'pdf') {
        // Para PDF, usaremos canvas para converter
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        await new Promise((resolve) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            resolve();
          };
          img.src = qrCode;
        });
        
        downloadData = canvas.toDataURL('image/png');
        fileName += '.png'; // Por simplicidade, mantemos PNG para PDF básico
      } else {
        fileName += '.png';
      }

      const link = document.createElement('a');
      link.download = fileName;
      link.href = downloadData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Atualizar analytics
      setAnalytics(prev => ({ ...prev, downloaded: prev.downloaded + 1 }));
      localStorage.setItem('qrcraft-analytics', JSON.stringify({ ...analytics, downloaded: analytics.downloaded + 1 }));
      
      showNotification(`QR Code baixado como ${selectedFormat.toUpperCase()}!`, 'success');
    } catch (error) {
      console.error('Erro ao baixar:', error);
      showNotification('Erro ao baixar o arquivo', 'error');
    }
  };

  // Geração em lote
  const generateBatchQRCodes = async () => {
    const validTexts = batchTexts.filter(t => t.trim());
    if (validTexts.length === 0) {
      showNotification('Adicione pelo menos um texto válido', 'error');
      return;
    }

    setIsGenerating(true);
    const results = [];
    
    for (let i = 0; i < validTexts.length; i++) {
      const result = await generateQRCode(validTexts[i], true);
      if (result) {
        results.push({ text: validTexts[i], dataURL: result, index: i });
      }
    }
    
    showNotification(`${results.length} QR Codes gerados com sucesso!`, 'success');
    setIsGenerating(false);
  };

  // Auto-geração (preview em tempo real)
  useEffect(() => {
    if (autoGenerate && (text.trim() || selectedTemplate !== 'custom')) {
      const timer = setTimeout(() => {
        generateQRCode(null, true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [text, color, backgroundColor, size, selectedTemplate, templateData, autoGenerate]);

  // Carregar dados salvos
  useEffect(() => {
    const savedHistory = localStorage.getItem('qrcraft-history');
    const savedAnalytics = localStorage.getItem('qrcraft-analytics');
    const savedDarkMode = localStorage.getItem('qrcraft-darkmode');
    
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    if (savedAnalytics) {
      setAnalytics(JSON.parse(savedAnalytics));
    }
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    
    // Carregar usuário logado
    loadUser();
    
    // Inicializar serviço de email
    initEmailJS();
    
    // Limpar tokens expirados
    cleanupExpiredTokens();
    
    // Verificar onboarding após carregamento inicial
    setTimeout(checkOnboarding, 2000);
  }, [loadUser, checkOnboarding]);

  // Salvar tema
  useEffect(() => {
    localStorage.setItem('qrcraft-darkmode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyboard = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generateQRCode();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        downloadQRCode();
      }
      if (e.key === 'Escape') {
        setShowScanner(false);
        setShowBatch(false);
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [qrCode]);



  // Funções para gerenciar histórico
  const reuseFromHistory = (item) => {
    setSelectedTemplate(item.template);
    setText(item.text);
    setColor(item.color);
    setBackgroundColor(item.backgroundColor);
    setSize(item.size.toString());
    setQrCode(item.dataURL);
    showNotification('Configurações restauradas do histórico!', 'success');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qrcraft-history');
    showNotification('Histórico limpo!', 'info');
  };

  // Callback para resultado do Scanner
  const handleScanResult = (scannedData) => {
    setText(scannedData);
    setSelectedTemplate('custom');
    showNotification('Dados do QR Code carregados!', 'success');
    if (autoGenerate) {
      generateQRCode(scannedData);
    }
  };

  // Callback para URL encurtada
  const handleShortenResult = (shortenedUrl) => {
    setText(shortenedUrl);
    setSelectedTemplate('url');
    setTemplateData(prev => ({ ...prev, url: shortenedUrl }));
    showNotification('URL encurtada carregada!', 'success');
    if (autoGenerate) {
      generateQRCode(shortenedUrl);
    }
  };

  // Logo Component com IDs únicos
  const QRCraftLogo = ({ size = 40 }) => {
    const logoId = `logo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toolId = `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id={logoId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id={toolId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
                </defs>
        
        {/* Base rounded square */}
        <rect x="2" y="2" width="44" height="44" rx="8" fill={`url(#${logoId})`} />
      
      {/* QR Code pattern */}
      <g fill="white" opacity="0.9">
        {/* Corner markers */}
        <rect x="6" y="6" width="8" height="8" rx="1" />
        <rect x="34" y="6" width="8" height="8" rx="1" />
        <rect x="6" y="34" width="8" height="8" rx="1" />
        
        {/* Inner squares */}
        <rect x="8" y="8" width="4" height="4" rx="0.5" fill={`url(#${logoId})`} />
        <rect x="36" y="8" width="4" height="4" rx="0.5" fill={`url(#${logoId})`} />
        <rect x="8" y="36" width="4" height="4" rx="0.5" fill={`url(#${logoId})`} />
        
        {/* Data pattern */}
        <rect x="18" y="8" width="2" height="2" rx="0.5" />
        <rect x="22" y="8" width="2" height="2" rx="0.5" />
        <rect x="26" y="8" width="2" height="2" rx="0.5" />
        
        <rect x="18" y="12" width="2" height="2" rx="0.5" />
        <rect x="26" y="12" width="2" height="2" rx="0.5" />
        
        <rect x="18" y="16" width="2" height="2" rx="0.5" />
        <rect x="22" y="16" width="2" height="2" rx="0.5" />
        
        <rect x="26" y="20" width="2" height="2" rx="0.5" />
        <rect x="30" y="20" width="2" height="2" rx="0.5" />
        
        <rect x="18" y="24" width="2" height="2" rx="0.5" />
        <rect x="26" y="24" width="2" height="2" rx="0.5" />
        
        <rect x="22" y="28" width="2" height="2" rx="0.5" />
        <rect x="30" y="28" width="2" height="2" rx="0.5" />
        
        <rect x="18" y="32" width="2" height="2" rx="0.5" />
        <rect x="26" y="32" width="2" height="2" rx="0.5" />
        <rect x="30" y="32" width="2" height="2" rx="0.5" />
      </g>
      
      {/* Craft tool (stylized brush/pen) */}
      <g transform="translate(32, 26)">
        <path 
          d="M2 2 L10 10 L8 12 L0 4 Z" 
          fill={`url(#${toolId})`}
          opacity="0.95"
        />
        <circle cx="1" cy="3" r="1.5" fill={`url(#${toolId})`} opacity="0.8" />
        <path 
          d="M8 12 L10 14 L8 16 L6 14 Z" 
          fill="#ef4444" 
          opacity="0.9"
        />
      </g>
    </svg>
    );
  };

  // Componente de Notificação
  const NotificationToast = () => {
    if (!notification) return null;
    
    const bgColor = {
      success: '#10b981',
      error: '#ef4444',
      info: '#3b82f6'
    }[notification.type];

    return (
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: bgColor,
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        fontWeight: '500',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out'
      }}>
        {notification.message}
      </div>
    );
  };

  // Verificar se é página de verificação de email
  const isEmailVerificationPage = window.location.search.includes('token=') && window.location.search.includes('email=');
  
  if (isEmailVerificationPage) {
    return (
      <EmailVerificationPage 
        darkMode={darkMode}
        showNotification={showNotification}
        onUserUpdate={setUser}
      />
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: darkMode ? '#0f172a' : '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: darkMode ? '#f1f5f9' : '#1f2937',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <header style={{
        background: darkMode ? '#1e293b' : '#ffffff',
        borderBottom: darkMode 
          ? '1px solid #475569'
          : '1px solid #e5e7eb',
        // Removido position: 'sticky' para melhor UX mobile
        zIndex: 10,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <QRCraftLogo size={40} />
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              margin: 0
            }}>
              QRCraft Studio
            </h1>
          </div>
          
          {/* Controles do Header - Reorganizados para mobile */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', // Reduzido o gap para economizar espaço
            flexShrink: 0,
            flexWrap: 'wrap'
          }}>
            {/* Container para botões de controle lado a lado */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexShrink: 0
            }}>
              {/* Sino de Notificações */}
              {isLoggedIn && (
                <button
                  onClick={() => setShowNotificationCenter(true)}
                  style={{
                    background: darkMode ? '#475569' : '#f3f4f6',
                    border: darkMode ? '1px solid #64748b' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    transition: 'all 0.2s ease',
                    color: darkMode ? '#f1f5f9' : '#374151',
                    flexShrink: 0,
                    position: 'relative',
                    width: '44px', // Tamanho fixo para consistência
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Notificações"
                >
                  🔔
                  {unreadCount > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </button>
              )}

              {/* Toggle Tema */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  background: darkMode ? '#475569' : '#f3f4f6',
                  border: darkMode ? '1px solid #64748b' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  transition: 'all 0.2s ease',
                  color: darkMode ? '#f1f5f9' : '#374151',
                  flexShrink: 0,
                  width: '44px', // Tamanho fixo para consistência
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>

            {/* Botões de Autenticação */}
            {isLoggedIn ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', // Reduzido para economizar espaço
                flexWrap: 'wrap',
                minWidth: 'max-content'
              }}>
                {/* Informações do Plano */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: darkMode ? 'rgba(51, 65, 85, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                  borderRadius: '12px',
                  padding: '0.5rem 0.75rem',
                  border: darkMode ? '1px solid #475569' : '1px solid #e5e7eb',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onClick={() => setShowPlanManager(true)}
                title="Clique para gerenciar seu plano"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = darkMode ? 'rgba(71, 85, 105, 0.9)' : 'rgba(241, 245, 249, 0.95)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = darkMode ? 'rgba(51, 65, 85, 0.8)' : 'rgba(248, 250, 252, 0.9)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  <div style={{
                    background: user.plan === 'pro' ? '#f59e0b' : '#6b7280',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {user.plan === 'pro' ? '👑 PRO' : '📦 STANDARD'}
                  </div>
                  
                  {user.plan === 'standard' && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: (user.monthlyUsage || 0) >= 8 
                        ? '#ef4444' 
                        : (user.monthlyUsage || 0) >= 6 
                        ? '#f59e0b' 
                        : darkMode ? '#94a3b8' : '#6b7280',
                      whiteSpace: 'nowrap',
                      fontWeight: (user.monthlyUsage || 0) >= 8 ? 'bold' : 'normal'
                    }}>
                      {user.monthlyUsage || 0}/10
                      {(user.monthlyUsage || 0) >= 8 && ' ⚠️'}
                    </div>
                  )}
                  
                  <div style={{
                    fontSize: '0.75rem',
                    color: darkMode ? '#94a3b8' : '#9ca3af'
                  }}>
                    ⚙️
                  </div>
                </div>

                <button
                  onClick={() => setShowUserProfile(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.875rem',
                    color: darkMode ? '#cbd5e1' : '#6b7280',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    minWidth: 'max-content',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    padding: '0.25rem 0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = darkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(243, 244, 246, 0.8)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                  title="Clique para ver seu perfil"
                >
                  👤 {user?.name?.split(' ')[0]}
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  🚪 Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                🔐 Entrar / Criar Conta
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Email Verification Banner */}
      {isLoggedIn && user && (
        <EmailVerificationBanner 
          user={user}
          onUserUpdate={setUser}
          darkMode={darkMode}
          showNotification={showNotification}
        />
      )}

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <QRCraftLogo size={80} />
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 'bold',
            color: darkMode ? '#f1f5f9' : '#1f2937',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Craft Your Perfect
            <br />
            <span style={{
              color: '#3b82f6'
            }}>
              QR Code
            </span>
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Ferramenta profissional para criar QR Codes personalizados com design único e qualidade superior
          </p>
        </div>



        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {/* Configuration Panel */}
          <div style={{
            background: darkMode ? '#1e293b' : '#ffffff',
            borderRadius: '24px',
            padding: '2rem',
            border: darkMode 
              ? '1px solid #475569' 
              : '1px solid #e5e7eb',
            boxShadow: darkMode 
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#3b82f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.75rem'
              }}>
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: darkMode ? '#f1f5f9' : '#1f2937', margin: 0 }}>
                Configurações
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Configurações Avançadas */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  <input
                    type="checkbox"
                    checked={autoGenerate}
                    onChange={(e) => setAutoGenerate(e.target.checked)}
                    style={{ marginRight: '0.25rem' }}
                  />
                  🔄 Preview em tempo real
                </label>
                
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => {
                      if (!isFeatureAvailable('batch-generation')) {
                        showNotification('Geração em lote disponível apenas no plano PRO', 'error');
                        setShowPlanManager(true);
                        return;
                      }
                      setShowBatch(!showBatch);
                    }}
                    disabled={!isLoggedIn}
                    style={{
                      background: isFeatureAvailable('batch-generation')
                        ? '#8b5cf6'
                        : '#9ca3af',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      cursor: isFeatureAvailable('batch-generation') ? 'pointer' : 'not-allowed',
                      fontWeight: '500',
                      opacity: !isLoggedIn ? 0.5 : 1
                    }}
                  >
                    📦 Geração em Lote
                    {!isFeatureAvailable('batch-generation') && user && (
                      <span style={{ fontSize: '0.75rem', marginLeft: '0.25rem' }}>🔒</span>
                    )}
                  </button>
                  {!isFeatureAvailable('batch-generation') && user && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      pointerEvents: 'none'
                    }}>
                      🔒 PRO
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowScanner(true)}
                  disabled={!isLoggedIn}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                    fontWeight: '500',
                    opacity: !isLoggedIn ? 0.5 : 1
                  }}
                >
                  📷 Scanner QR
                </button>

                <button
                  onClick={() => setShowURLShortener(true)}
                  disabled={!isLoggedIn}
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                    fontWeight: '500',
                    opacity: !isLoggedIn ? 0.5 : 1
                  }}
                >
                  🔗 Encurtar URL
                </button>

                <button
                  onClick={() => setShowSmartHistory(true)}
                  disabled={!isLoggedIn}
                  style={{
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                    fontWeight: '500',
                    opacity: !isLoggedIn ? 0.5 : 1
                  }}
                >
                  🗃️ Histórico
                </button>

                <button
                  onClick={() => setShowAnalytics(true)}
                  disabled={!isLoggedIn}
                  style={{
                    background: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                    fontWeight: '500',
                    opacity: !isLoggedIn ? 0.5 : 1
                  }}
                >
                  📊 Analytics
                </button>
              </div>

              {/* Templates */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: darkMode ? '#cbd5e1' : '#374151',
                  marginBottom: '0.75rem'
                }}>
                  📋 Escolha um Template
                </label>
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  templateData={templateData}
                  setTemplateData={setTemplateData}
                  darkMode={darkMode}
                  showNotification={showNotification}
                  user={user}
                  isFeatureAvailable={isFeatureAvailable}
                  onUpgradeClick={() => setShowPlanManager(true)}
                />
              </div>

              {/* Content Input - apenas para template personalizado e usuários PRO */}
              {selectedTemplate === 'custom' && isFeatureAvailable('custom-qr') && (
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: darkMode ? '#cbd5e1' : '#374151',
                    marginBottom: '0.75rem'
                  }}>
                    Conteúdo do QR Code
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Digite o texto, URL ou dados para o QR Code..."
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      resize: 'none',
                      background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                      color: darkMode ? '#f1f5f9' : '#374151',
                      backdropFilter: 'blur(5px)',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    rows={4}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = darkMode ? '#475569' : '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              )}

              {/* Mensagem para usuários Standard no template Custom */}
              {selectedTemplate === 'custom' && !isFeatureAvailable('custom-qr') && (
                <div style={{
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  border: '1px solid #f59e0b',
                  borderRadius: '12px',
                  padding: '1rem',
                  color: '#92400e',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  🔒 O plano Standard permite apenas QR Codes de URLs. 
                  <br />
                  Use o template "URL" ou faça upgrade para PRO para texto personalizado!
                </div>
              )}

              {/* Colors */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: darkMode ? '#cbd5e1' : '#374151',
                    marginBottom: '0.75rem'
                  }}>
                    🎨 Cor do QR Code
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      style={{
                        width: '48px',
                        height: '48px',
                        border: '2px solid #d1d5db',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        background: 'none'
                      }}
                    />
                                          <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.75rem',
                          border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                          color: darkMode ? '#f1f5f9' : '#374151',
                          fontFamily: 'inherit',
                          outline: 'none'
                        }}
                      />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: darkMode ? '#cbd5e1' : '#374151',
                    marginBottom: '0.75rem'
                  }}>
                    🖼️ Cor de Fundo
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      style={{
                        width: '48px',
                        height: '48px',
                        border: '2px solid #d1d5db',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        background: 'none'
                      }}
                    />
                                          <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.75rem',
                          border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                          color: darkMode ? '#f1f5f9' : '#374151',
                          fontFamily: 'inherit',
                          outline: 'none'
                        }}
                      />
                  </div>
                </div>
              </div>

              {/* Configurações de Tamanho e Formato */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: darkMode ? '#cbd5e1' : '#374151',
                    marginBottom: '0.75rem'
                  }}>
                    📏 Tamanho (pixels)
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                      color: darkMode ? '#f1f5f9' : '#374151',
                      fontFamily: 'inherit',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="128">128 × 128</option>
                    <option value="256">256 × 256</option>
                    <option value="512">512 × 512</option>
                    <option value="1024">1024 × 1024</option>
                    <option value="2048">2048 × 2048</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: darkMode ? '#cbd5e1' : '#374151',
                    marginBottom: '0.75rem'
                  }}>
                    💾 Formato de Download
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                      color: darkMode ? '#f1f5f9' : '#374151',
                      fontFamily: 'inherit',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="png">PNG (Recomendado)</option>
                    <option value="svg">SVG (Vetorial)</option>
                    <option value="pdf">PDF (Documento)</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateQRCode}
                disabled={isGenerating}
                style={{
                  width: '100%',
                  background: isGenerating 
                    ? '#9ca3af' 
                    : '#3b82f6',
                  color: 'white',
                  fontWeight: '600',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onMouseOver={(e) => {
                  if (!isGenerating) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 12px -2px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                {isGenerating ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Criando QR Code...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    Craft QR Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div style={{
            background: darkMode 
              ? 'rgba(15, 23, 42, 0.9)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: '2rem',
            border: darkMode 
              ? '1px solid rgba(71, 85, 105, 0.5)' 
              : '1px solid rgba(229, 231, 235, 0.5)',
            boxShadow: darkMode 
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            height: 'fit-content',
            position: 'sticky',
            top: '120px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: '#10b981',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem'
                }}>
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: darkMode ? '#f1f5f9' : '#1f2937', 
                  margin: 0 
                }}>
                  Preview do QR Code
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <div>
                {qrCode ? (
                  <div style={{
                    padding: '1.5rem',
                    background: darkMode 
                      ? '#1e293b' 
                      : '#f9fafb',
                    borderRadius: '16px',
                    border: darkMode 
                      ? '2px solid rgba(71, 85, 105, 0.5)' 
                      : '2px solid rgba(229, 231, 235, 0.5)',
                    boxShadow: darkMode 
                      ? 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)' 
                      : 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)'
                  }}>
                    <img 
                      src={qrCode} 
                      alt="QR Code crafted by QRCraft Studio" 
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        width: '280px'
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '320px',
                    height: '320px',
                    maxWidth: '100%',
                    background: darkMode 
                      ? '#1e293b' 
                      : '#f3f4f6',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: darkMode 
                      ? '2px dashed #475569' 
                      : '2px dashed #d1d5db'
                  }}>
                    <div style={{ textAlign: 'center', color: darkMode ? '#94a3b8' : '#6b7280', padding: '1rem' }}>
                      <QRCraftLogo size={64} />
                      <p style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: '600', 
                        marginBottom: '0.5rem', 
                        marginTop: '1rem',
                        color: darkMode ? '#cbd5e1' : '#1f2937'
                      }}>
                        Seu QR Code aparecerá aqui
                      </p>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: darkMode ? '#64748b' : '#9ca3af' 
                      }}>
                        Configure os dados e clique em "Craft QR Code"
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {qrCode && (
                <div style={{ width: '100%', maxWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button 
                    onClick={() => setShowQRTester(true)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      fontWeight: '600',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 12px -2px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    🧪 Testar QR Code
                  </button>

                  <button 
                    onClick={downloadQRCode}
                    style={{
                      width: '100%',
                      background: '#10b981',
                      color: 'white',
                      fontWeight: '600',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 12px -2px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PNG
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Features Section - Recursos Principais */}
        <div style={{ marginTop: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: darkMode ? '#f1f5f9' : '#1f2937',
              marginBottom: '1rem'
            }}>
              🚀 Recursos Profissionais
            </h3>
            <p style={{
              fontSize: '1.125rem',
              color: darkMode ? '#94a3b8' : '#6b7280'
            }}>
              Tudo que você precisa para criar QR Codes únicos e profissionais
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: darkMode ? '#1e293b' : '#ffffff',
              borderRadius: '16px',
              border: darkMode 
                ? '1px solid #475569' 
                : '1px solid #e5e7eb',
              boxShadow: darkMode 
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = darkMode 
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = darkMode 
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: '#dbeafe',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <svg width="32" height="32" fill="#2563eb" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                color: darkMode ? '#f1f5f9' : '#1f2937', 
                marginBottom: '0.5rem' 
              }}>
                Criação Instantânea
              </h4>
              <p style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                Craft QR Codes em segundos com nossa tecnologia otimizada
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: darkMode ? '#1e293b' : '#ffffff',
              borderRadius: '16px',
              border: darkMode 
                ? '1px solid #475569' 
                : '1px solid #e5e7eb',
              boxShadow: darkMode 
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = darkMode 
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = darkMode 
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: '#ede9fe',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <svg width="32" height="32" fill="#7c3aed" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h4 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                color: darkMode ? '#f1f5f9' : '#1f2937', 
                marginBottom: '0.5rem' 
              }}>
                Design Personalizado
              </h4>
              <p style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                Cores e estilos únicos para sua marca se destacar
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: darkMode ? '#1e293b' : '#ffffff',
              borderRadius: '16px',
              border: darkMode 
                ? '1px solid #475569' 
                : '1px solid #e5e7eb',
              boxShadow: darkMode 
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = darkMode 
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = darkMode 
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: '#dcfce7',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <svg width="32" height="32" fill="#16a34a" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                color: darkMode ? '#f1f5f9' : '#1f2937', 
                marginBottom: '0.5rem' 
              }}>
                Qualidade Premium
              </h4>
              <p style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                Alta resolução e compatibilidade universal
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: '#1f2937',
        color: 'white',
        padding: '3rem 1rem',
        marginTop: '5rem'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <QRCraftLogo size={32} />
            <span style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#60a5fa'
            }}>
              QRCraft Studio
            </span>
          </div>
          <p style={{
            color: '#d1d5db',
            marginBottom: '1.5rem'
          }}>
            Craft your perfect QR Code - Rápido, elegante e profissional
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: '#9ca3af'
          }}>
            © 2025 QRCraft Studio. Todos os direitos reservados.
          </p>
        </div>
      </footer>



      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={(userData) => {
          setUser(userData);
          setIsLoggedIn(true);
          localStorage.setItem('qrcraft-user', JSON.stringify(userData));
          setShowAuthModal(false); // Fechar o modal após login
          showNotification('Login realizado com sucesso!', 'success');
        }}
        darkMode={darkMode}
        showNotification={showNotification}
      />

      <UserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        user={user}
        darkMode={darkMode}
        showNotification={showNotification}
      />

      <PlanManager
        isOpen={showPlanManager}
        onClose={() => setShowPlanManager(false)}
        user={user}
        onPlanUpdate={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem('qrcraft-user', JSON.stringify(updatedUser));
        }}
        darkMode={darkMode}
        showNotification={showNotification}
      />

      <NotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        user={user}
        darkMode={darkMode}
        showNotification={showNotification}
      />

      {/* Novos Modais */}
      <QRScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanResult={handleScanResult}
        darkMode={darkMode}
        showNotification={showNotification}
      />

      <URLShortener
        isOpen={showURLShortener}
        onClose={() => setShowURLShortener(false)}
        onShortenResult={handleShortenResult}
        darkMode={darkMode}
        showNotification={showNotification}
        user={user}
        isFeatureAvailable={isFeatureAvailable}
      />

      <Analytics
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        darkMode={darkMode}
        user={user}
      />

      <SmartHistoryPanel
        isOpen={showSmartHistory}
        onClose={() => setShowSmartHistory(false)}
        history={history}
        onReuseFromHistory={reuseFromHistory}
        onClearHistory={clearHistory}
        darkMode={darkMode}
        showNotification={showNotification}
      />

      <Onboarding
        isOpen={showOnboarding}
        onClose={() => {
          setShowOnboarding(false);
          localStorage.setItem('qrcraft-onboarding-completed', 'true');
        }}
        darkMode={darkMode}
        showNotification={showNotification}
      />

      <QRCodeTester
        isOpen={showQRTester}
        onClose={() => setShowQRTester(false)}
        qrCode={qrCode}
        qrData={generateTemplateText()}
        darkMode={darkMode}
        showNotification={showNotification}
      />

      {/* Sistema de Notificações */}
      <NotificationToast />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from { 
            transform: translateX(100%);
            opacity: 0;
          }
          to { 
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .dark {
          color-scheme: dark;
        }
        
        *:focus {
          outline: 2px solid #3b82f6 !important;
          outline-offset: 2px !important;
        }
        
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.8);
        }
        
        .dark .glass-effect {
          background: rgba(30, 41, 59, 0.8);
        }
        
        /* Header responsive fixes */
        @media (max-width: 768px) {
          header > div {
            flex-direction: column !important;
            gap: 1rem !important;
            align-items: center !important;
          }
          
          header > div > div:last-child {
            width: 100% !important;
            justify-content: center !important;
          }
        }
        
        @media (max-width: 640px) {
          header > div > div:last-child {
            flex-direction: column !important;
            gap: 1rem !important;
            align-items: center !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;

