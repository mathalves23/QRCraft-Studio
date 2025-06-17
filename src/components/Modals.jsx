import SmartHistoryPanel from './SmartHistoryPanel';
import BatchGenerator from './BatchGenerator';
import QRScanner from './QRScanner';
import URLShortener from './URLShortener';
import AnalyticsDashboard from './AnalyticsDashboard';
import QRCodeTester from './QRCodeTester';
import UserProfile from './UserProfile';
import PlanManager from './PlanManager';
import AuthModal from './AuthModal';

const Modals = ({
  isAuthenticated,
  showSmartHistory,
  setShowSmartHistory,
  history,
  handleSelectHistoryItem,
  showBatchGenerator,
  setShowBatchGenerator,
  showQRScanner,
  setShowQRScanner,
  showURLShortener,
  setShowURLShortener,
  showAnalytics,
  setShowAnalytics,
  showTester,
  setShowTester,
  qrCode,
  generateTemplateText,
  darkMode,
  showNotification,
  showUserProfile,
  setShowUserProfile,
  showPlanManager,
  setShowPlanManager,
  showAuthModal,
  setShowAuthModal,
}) => {
  return (
    <>
      {isAuthenticated && (
        <SmartHistoryPanel
          isOpen={showSmartHistory}
          onClose={() => setShowSmartHistory(false)}
          history={history}
          onSelectItem={handleSelectHistoryItem}
        />
      )}
      
      {showBatchGenerator && <BatchGenerator isOpen={showBatchGenerator} onClose={() => setShowBatchGenerator(false)} />}
      {showQRScanner && <QRScanner isOpen={showQRScanner} onClose={() => setShowQRScanner(false)} />}
      {showURLShortener && <URLShortener isOpen={showURLShortener} onClose={() => setShowURLShortener(false)} showNotification={showNotification} />}
      {showAnalytics && <AnalyticsDashboard isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} darkMode={darkMode} showNotification={showNotification} />}
      {showTester && <QRCodeTester isOpen={showTester} onClose={() => setShowTester(false)} qrCode={qrCode} qrData={generateTemplateText()} darkMode={darkMode} showNotification={showNotification} />}
      {showUserProfile && <UserProfile isOpen={showUserProfile} onClose={() => setShowUserProfile(false)} />}
      {showPlanManager && <PlanManager isOpen={showPlanManager} onClose={() => setShowPlanManager(false)} />}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        darkMode={darkMode}
      />
    </>
  );
};

export default Modals; 