import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

const Header = ({
  isAuthenticated,
  profile,
  onShowAuthModal,
  onShowUserProfile,
  onShowSmartHistory,
  onShowBatchGenerator,
  onShowQRScanner,
  onShowURLShortener,
  onShowAnalytics,
  onShowTester
}) => {
  const { t } = useTranslation();

  return (
    <header>
      <div className="logo-area">
        <h1>{t('app.title')}</h1>
      </div>
      <div className="tools-area">
        <button onClick={onShowSmartHistory}>{t('tools.history')}</button>
        <button onClick={onShowBatchGenerator}>{t('tools.batch')}</button>
        <button onClick={onShowQRScanner}>{t('tools.scanner')}</button>
        <button onClick={onShowURLShortener}>{t('tools.shortener')}</button>
        <button onClick={onShowAnalytics}>{t('tools.analytics')}</button>
        <button onClick={onShowTester}>{t('tools.tester')}</button>
      </div>
      <div className="user-area">
        <LanguageSwitcher />
        {isAuthenticated ? (
          <button onClick={onShowUserProfile}>{profile?.username || 'Perfil'}</button>
        ) : (
          <button onClick={onShowAuthModal}>{t('auth.login')}</button>
        )}
      </div>
    </header>
  );
};

export default Header; 