import { useTranslation } from 'react-i18next';
import TemplateSelector from './TemplateSelector';

const MainPanel = ({
  selectedTemplate,
  onTemplateChange,
  templateData,
  onTemplateDataChange,
  generateQRCode,
  isGenerating,
  qrCode,
}) => {
  const { t } = useTranslation();

  return (
    <main>
      <TemplateSelector
        selectedTemplate={selectedTemplate}
        onTemplateChange={onTemplateChange}
        templateData={templateData}
        onTemplateDataChange={onTemplateDataChange}
      />
      <button onClick={generateQRCode} disabled={isGenerating}>
        {isGenerating ? t('generator.generatingButton') : t('generator.generateButton')}
      </button>

      {qrCode && <img src={qrCode} alt="Generated QR Code" />}
    </main>
  );
};

export default MainPanel; 