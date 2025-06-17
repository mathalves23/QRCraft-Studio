import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import Header from './components/Header';
import MainPanel from './components/MainPanel';
import Modals from './components/Modals';
import './App.css';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useTheme } from "@/components/theme-provider";
import { qrHelpers, analyticsHelpers } from '@/lib/supabase';

function App() {
  const { t } = useTranslation();
  const { showNotification } = useNotifications();
  const { user, profile, loading, canGenerateQR, incrementUsage, isAuthenticated } = useAuth();
  const { trackEvent, identifyUser } = useAnalytics();
  const { theme } = useTheme();
  const darkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // State
  const [selectedTemplate, setSelectedTemplate] = useState('url');
  const [templateData, setTemplateData] = useState({ url: 'https://qrcraft.studio' });
  const [size, setSize] = useState('256');
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [qrCode, setQrCode] = useState('');
  const [history, setHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // UI State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showPlanManager, setShowPlanManager] = useState(false);
  const [showSmartHistory, setShowSmartHistory] = useState(false);
  const [showBatchGenerator, setShowBatchGenerator] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showURLShortener, setShowURLShortener] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTester, setShowTester] = useState(false);

  // Identify user for analytics once profile is loaded
  useEffect(() => {
    if (user && profile) {
      identifyUser()
    }
  }, [user, profile, identifyUser])

  // Load user's QR code history from Supabase
  const loadHistory = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setHistory([])
      return
    }
    const { data, error } = await qrHelpers.getUserQRCodes(user.id)
    if (error) {
      showNotification(t('notifications.error'), 'error')
      console.error('Error loading history:', error)
    } else {
      setHistory(data || [])
    }
  }, [isAuthenticated, user, showNotification, t])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const handleSelectHistoryItem = (item) => {
    if (!item) return;

    // Set the state based on the selected history item
    setSelectedTemplate(item.template_type);
    setTemplateData(item.template_data || {});
    if (item.settings) {
      setSize(item.settings.size || '256');
      setColor(item.settings.color || '#000000');
      setBackgroundColor(item.settings.backgroundColor || '#ffffff');
    }
    setQrCode(item.qr_data_url);

    // Close the history panel and show a notification
    setShowSmartHistory(false);
    showNotification('QR Code carregado do histórico!', 'success');
    trackEvent('qr_loaded_from_history', { template: item.template_type });
  };

  const generateTemplateText = useCallback(() => {
    // This function will be updated to generate text from templateData
    return templateData.url || 'https://qrcraft.studio'
  }, [templateData])

  const generateQRCode = async (inputText = null, skipNotification = false) => {
    if (!canGenerateQR()) {
      showNotification('Limite de QR Codes atingido para o plano free.', 'error')
      setShowPlanManager(true)
      return null
    }

    const textToEncode = inputText || generateTemplateText()
    
    if (!textToEncode.trim()) {
      showNotification(t('generator.errorEmpty'), 'error')
      return null
    }

    setIsGenerating(true)
    try {
      const qrCodeDataURL = await QRCode.toDataURL(textToEncode, {
        width: parseInt(size),
        color: { dark: color, light: backgroundColor },
        errorCorrectionLevel: 'H',
        margin: 2,
      })
      
      setQrCode(qrCodeDataURL)

      if (isAuthenticated) {
        // Save to Supabase
        const qrDataToSave = {
          content: textToEncode,
          template_type: selectedTemplate,
          template_data: templateData,
          qr_data_url: qrCodeDataURL,
          settings: { size, color, backgroundColor }
        }
        const { error: saveError } = await qrHelpers.saveQRCode(qrDataToSave)
        
        if (saveError) {
          showNotification('Erro ao salvar QR Code.', 'error')
        } else {
          await loadHistory() // Refresh history from DB
          await incrementUsage() // Increment usage for free users
        }
      } else {
        // Handle history for anonymous users (e.g., in localStorage, optional)
      }
      
      trackEvent('qr_generated', { template: selectedTemplate, size: parseInt(size) })
      
      if (!skipNotification) {
        showNotification(t('notifications.qrGenerated'), 'success')
      }
      
      return qrCodeDataURL
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
      showNotification(t('generator.errorGeneric'), 'error')
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  // Rest of the component logic...
  // The download function should also be updated to use the real data and track analytics
  const downloadQRCode = async (format) => {
    // ... download logic
    trackEvent('qr_downloaded', { format })
  }

  return (
    <div className="app-container">
      <Header
        isAuthenticated={isAuthenticated}
        profile={profile}
        onShowAuthModal={() => setShowAuthModal(true)}
        onShowUserProfile={() => setShowUserProfile(true)}
        onShowSmartHistory={() => setShowSmartHistory(true)}
        onShowBatchGenerator={() => setShowBatchGenerator(true)}
        onShowQRScanner={() => setShowQRScanner(true)}
        onShowURLShortener={() => setShowURLShortener(true)}
        onShowAnalytics={() => setShowAnalytics(true)}
        onShowTester={() => setShowTester(true)}
      />

      <MainPanel
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
        templateData={templateData}
        onTemplateDataChange={setTemplateData}
        generateQRCode={() => generateQRCode()}
        isGenerating={isGenerating}
        qrCode={qrCode}
      />

      <Modals
        isAuthenticated={isAuthenticated}
        showSmartHistory={showSmartHistory}
        setShowSmartHistory={setShowSmartHistory}
        history={history}
        handleSelectHistoryItem={handleSelectHistoryItem}
        showBatchGenerator={showBatchGenerator}
        setShowBatchGenerator={setShowBatchGenerator}
        showQRScanner={showQRScanner}
        setShowQRScanner={setShowQRScanner}
        showURLShortener={showURLShortener}
        setShowURLShortener={setShowURLShortener}
        showAnalytics={showAnalytics}
        setShowAnalytics={setShowAnalytics}
        showTester={showTester}
        setShowTester={setShowTester}
        qrCode={qrCode}
        generateTemplateText={generateTemplateText}
        darkMode={darkMode}
        showNotification={showNotification}
        showUserProfile={showUserProfile}
        setShowUserProfile={setShowUserProfile}
        showPlanManager={showPlanManager}
        setShowPlanManager={setShowPlanManager}
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
      />
    </div>
  )
}

export default App;

