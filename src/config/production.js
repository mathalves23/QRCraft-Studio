// Configuração de Produção - QRCraft Studio
// IMPORTANTE: Substitua pelas suas credenciais REAIS do Mercado Pago

export const PRODUCTION_CONFIG = {
  // 🔐 CREDENCIAIS DE PRODUÇÃO - Substitua pelos valores reais
  MERCADO_PAGO: {
    PUBLIC_KEY: process.env.VITE_MP_PUBLIC_KEY || 'APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    ACCESS_TOKEN: process.env.VITE_MP_ACCESS_TOKEN || 'APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    ENVIRONMENT: 'production' // 'sandbox' para teste, 'production' para real
  },

  // 🌐 URLs DA APLICAÇÃO
  URLS: {
    BACKEND: process.env.VITE_BACKEND_URL || 'https://qrcraftstudio.netlify.app/.netlify/functions',
    FRONTEND: process.env.VITE_FRONTEND_URL || 'https://qrcraftstudio.netlify.app',
    WEBHOOK: `${process.env.VITE_FRONTEND_URL || 'https://qrcraftstudio.netlify.app'}/.netlify/functions/webhook-mercadopago`
  },

  // 💰 CONFIGURAÇÕES DE PAGAMENTO
  PAYMENT: {
    CURRENCY: 'BRL',
    COUNTRY: 'BR',
    PRO_PLAN_PRICE: 20.00,
    WEBHOOK_TIMEOUT: 30000,
    MAX_INSTALLMENTS: 12
  },

  // 🔒 SEGURANÇA
  SECURITY: {
    WEBHOOK_SECRET: process.env.VITE_WEBHOOK_SECRET || 'sua-chave-secreta-webhook',
    ENABLE_SIGNATURE_VALIDATION: true,
    MAX_PAYMENT_ATTEMPTS: 3
  }
};

// Função para verificar se está em produção
export const isProduction = () => {
  // Forçar ambiente de teste até ativar credenciais de produção
  return false; // Mude para true quando tiver credenciais de produção ativas
  // return process.env.NODE_ENV === 'production' || process.env.VITE_NODE_ENV === 'production';
};

// Função para obter configuração baseada no ambiente
export const getConfig = () => {
  if (isProduction()) {
    console.log('🚀 Executando em PRODUÇÃO');
    return PRODUCTION_CONFIG;
  } else {
    console.log('🧪 Executando em DESENVOLVIMENTO/TESTE');
    // Retornar configuração de teste com URLs de produção
    return {
      MERCADO_PAGO: {
        PUBLIC_KEY: process.env.VITE_MP_PUBLIC_KEY || 'TEST-suas-credenciais-de-teste-aqui',
        ACCESS_TOKEN: process.env.VITE_MP_ACCESS_TOKEN || 'TEST-suas-credenciais-de-teste-aqui',
        ENVIRONMENT: 'sandbox'
      },
      URLS: {
        BACKEND: 'https://qrcraftstudio.netlify.app/.netlify/functions',
        FRONTEND: 'https://qrcraftstudio.netlify.app',
        WEBHOOK: 'https://qrcraftstudio.netlify.app/.netlify/functions/webhook-mercadopago'
      },
      PAYMENT: PRODUCTION_CONFIG.PAYMENT,
      SECURITY: {
        ...PRODUCTION_CONFIG.SECURITY,
        ENABLE_SIGNATURE_VALIDATION: false // Desabilitar validação em teste
      }
    };
  }
};

// Validar configuração na inicialização
export const validateConfig = () => {
  const config = getConfig();
  const errors = [];

  if (!config.MERCADO_PAGO.PUBLIC_KEY || config.MERCADO_PAGO.PUBLIC_KEY.includes('xxxxxxxx')) {
    errors.push('❌ PUBLIC_KEY do Mercado Pago não configurada');
  }

  if (!config.MERCADO_PAGO.ACCESS_TOKEN || config.MERCADO_PAGO.ACCESS_TOKEN.includes('xxxxxxxx')) {
    errors.push('❌ ACCESS_TOKEN do Mercado Pago não configurado');
  }

  if (!config.URLS.BACKEND || config.URLS.BACKEND.includes('seudominio')) {
    errors.push('❌ URL do backend não configurada');
  }

  if (errors.length > 0) {
    console.error('🚨 Configuração incompleta:', errors);
    if (isProduction()) {
      throw new Error('Configuração de produção inválida: ' + errors.join(', '));
    }
  } else {
    console.log('✅ Configuração validada com sucesso');
  }

  return config;
}; 