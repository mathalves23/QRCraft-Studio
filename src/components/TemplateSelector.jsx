import React from 'react';

const TemplateSelector = ({ 
  selectedTemplate, 
  setSelectedTemplate, 
  templateData, 
  setTemplateData, 
  darkMode,
  showNotification,
  user,
  isFeatureAvailable,
  onUpgradeClick
}) => {
  const templates = {
    custom: { name: 'Personalizado', icon: '✏️', fields: ['text'] },
    wifi: { name: 'WiFi', icon: '📶', fields: ['ssid', 'password', 'security'] },
    vcard: { name: 'vCard', icon: '👤', fields: ['name', 'phone', 'email', 'organization'] },
    sms: { name: 'SMS', icon: '💬', fields: ['phone', 'message'] },
    email: { name: 'Email', icon: '✉️', fields: ['email', 'subject', 'body'] },
    maps: { name: 'Localização', icon: '📍', fields: ['latitude', 'longitude'] },
    url: { name: 'URL', icon: '🔗', fields: ['url'] },
    social: { name: 'Redes Sociais', icon: '📱', fields: ['platform', 'username'] }
  };

  const updateTemplateData = (field, value) => {
    setTemplateData(prev => ({ ...prev, [field]: value }));
  };

  const fillSampleData = () => {
    const samples = {
      wifi: { ssid: 'MinhaRede', password: 'senha123', security: 'WPA' },
      vcard: { name: 'João Silva', phone: '+5511999999999', email: 'joao@email.com', organization: 'Empresa XYZ' },
      sms: { phone: '+5511999999999', message: 'Olá! Esta é uma mensagem de exemplo.' },
      email: { email: 'exemplo@email.com', subject: 'Assunto do Email', body: 'Corpo da mensagem aqui...' },
      maps: { latitude: '-23.5505', longitude: '-46.6333' },
      url: { url: 'https://www.exemplo.com' },
      social: { platform: 'instagram', username: 'meu_usuario' }
    };

    if (samples[selectedTemplate]) {
      setTemplateData(prev => ({ ...prev, ...samples[selectedTemplate] }));
      showNotification('Dados de exemplo preenchidos!', 'success');
    }
  };

  const renderTemplateFields = () => {
    const template = templates[selectedTemplate];
    if (!template || selectedTemplate === 'custom') return null;

    return (
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '1rem' 
        }}>
          <h4 style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            color: darkMode ? '#f1f5f9' : '#374151',
            margin: 0 
          }}>
            {template.icon} Configurar {template.name}
          </h4>
          <button
            onClick={fillSampleData}
            style={{
              background: '#8b5cf6',
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
        </div>

        {template.fields.map(field => {
          const fieldConfig = getFieldConfig(field);
          return (
            <div key={field} style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: darkMode ? '#cbd5e1' : '#374151',
                marginBottom: '0.5rem'
              }}>
                {fieldConfig.label}
              </label>
              {fieldConfig.type === 'select' ? (
                <select
                  value={templateData[field] || ''}
                  onChange={(e) => updateTemplateData(field, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    background: darkMode ? '#1e293b' : '#ffffff',
                    color: darkMode ? '#f1f5f9' : '#374151',
                    fontFamily: 'inherit'
                  }}
                >
                  {fieldConfig.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={fieldConfig.type}
                  value={templateData[field] || ''}
                  onChange={(e) => updateTemplateData(field, e.target.value)}
                  placeholder={fieldConfig.placeholder}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    background: darkMode ? '#1e293b' : '#ffffff',
                    color: darkMode ? '#f1f5f9' : '#374151',
                    fontFamily: 'inherit'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getFieldConfig = (field) => {
    const configs = {
      ssid: { label: 'Nome da Rede (SSID)', type: 'text', placeholder: 'Digite o nome da rede WiFi' },
      password: { label: 'Senha', type: 'password', placeholder: 'Digite a senha da rede' },
      security: { 
        label: 'Segurança', 
        type: 'select', 
        options: [
          { value: 'WPA', label: 'WPA/WPA2' },
          { value: 'WEP', label: 'WEP' },
          { value: 'nopass', label: 'Sem senha' }
        ]
      },
      name: { label: 'Nome Completo', type: 'text', placeholder: 'Digite o nome completo' },
      phone: { label: 'Telefone', type: 'tel', placeholder: '+5511999999999' },
      email: { label: 'Email', type: 'email', placeholder: 'exemplo@email.com' },
      organization: { label: 'Empresa', type: 'text', placeholder: 'Nome da empresa' },
      message: { label: 'Mensagem', type: 'text', placeholder: 'Digite a mensagem SMS' },
      subject: { label: 'Assunto', type: 'text', placeholder: 'Assunto do email' },
      body: { label: 'Corpo do Email', type: 'text', placeholder: 'Conteúdo do email' },
      latitude: { label: 'Latitude', type: 'number', placeholder: '-23.5505' },
      longitude: { label: 'Longitude', type: 'number', placeholder: '-46.6333' },
      url: { label: 'URL', type: 'url', placeholder: 'https://www.exemplo.com' },
      platform: { 
        label: 'Plataforma', 
        type: 'select',
        options: [
          { value: 'instagram', label: 'Instagram' },
          { value: 'twitter', label: 'Twitter' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'tiktok', label: 'TikTok' },
          { value: 'youtube', label: 'YouTube' }
        ]
      },
      username: { label: 'Nome de Usuário', type: 'text', placeholder: '@usuario' }
    };

    return configs[field] || { label: field, type: 'text', placeholder: `Digite ${field}` };
  };

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        {Object.entries(templates).map(([key, template]) => {
          // Plano Standard: apenas URL
          // Plano PRO: todos os templates
          const standardTemplates = ['url'];
          const isLocked = !standardTemplates.includes(key) && !isFeatureAvailable('advanced-templates');
          
          return (
            <button
              key={key}
              onClick={() => {
                if (isLocked) {
                  showNotification('Plano Standard permite apenas QR Codes de URLs. Upgrade para PRO para mais templates!', 'error');
                  onUpgradeClick();
                  return;
                }
                setSelectedTemplate(key);
              }}
              style={{
              padding: '0.75rem 0.5rem',
              border: selectedTemplate === key 
                ? '2px solid #3b82f6' 
                : `1px solid ${darkMode ? '#475569' : '#d1d5db'}`,
              borderRadius: '12px',
              background: selectedTemplate === key
                ? '#dbeafe'
                : darkMode 
                  ? '#1e293b' 
                  : '#ffffff',
              cursor: isLocked ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: selectedTemplate === key ? '600' : '500',
              color: selectedTemplate === key 
                ? '#1e40af' 
                : darkMode ? '#cbd5e1' : '#374151',
              transition: 'all 0.2s ease',
              textAlign: 'center',
              opacity: isLocked ? 0.6 : 1,
              position: 'relative'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
              {template.icon}
              {isLocked && <span style={{ fontSize: '0.75rem', marginLeft: '0.25rem' }}>🔒</span>}
            </div>
            {template.name}
          </button>
          );
        })}
      </div>

      {renderTemplateFields()}
    </div>
  );
};

export default TemplateSelector; 