import { getConfig, validateConfig } from '../config/production.js';

// Configuração dinâmica baseada no ambiente
const CONFIG = validateConfig();

// Configuração do Mercado Pago para QRCraft Studio
export const MERCADOPAGO_CONFIG = {
  // Chaves dinâmicas (teste em dev, produção em prod)
  PUBLIC_KEY: CONFIG.MERCADO_PAGO.PUBLIC_KEY,
  ACCESS_TOKEN: CONFIG.MERCADO_PAGO.ACCESS_TOKEN,
  ENVIRONMENT: CONFIG.MERCADO_PAGO.ENVIRONMENT,
  
  // URLs
  API_BASE_URL: 'https://api.mercadopago.com',
  SANDBOX_BASE_URL: 'https://api.mercadolibre.com/sandbox',
  
  // Configurações da aplicação (URLs dinâmicas)
  NOTIFICATION_URL: CONFIG.URLS.WEBHOOK,
  SUCCESS_URL: `${CONFIG.URLS.FRONTEND}/payment/success`,
  FAILURE_URL: `${CONFIG.URLS.FRONTEND}/payment/failure`,
  PENDING_URL: `${CONFIG.URLS.FRONTEND}/payment/pending`,
  
  // Produtos
  PRODUCTS: {
    PRO_ANNUAL: {
      id: 'qrcraft-pro-annual',
      title: 'QRCraft Studio PRO - Plano Anual',
      description: 'Acesso completo a todas as funcionalidades premium por 1 ano',
      price: 20.00,
      currency: 'BRL'
    }
  }
};

// Função para criar preferência de pagamento
export const createPaymentPreference = async (userData, planId = 'PRO_ANNUAL') => {
  const product = MERCADOPAGO_CONFIG.PRODUCTS[planId];
  
  const preference = {
    items: [{
      id: product.id,
      title: product.title,
      description: product.description,
      quantity: 1,
      currency_id: product.currency,
      unit_price: product.price
    }],
    payer: {
      name: userData?.name || 'Usuário QRCraft',
      email: userData?.email || 'user@qrcraft.com',
      phone: {
        area_code: '11',
        number: '999999999'
      },
      address: {
        zip_code: '01234567',
        street_name: 'Rua Exemplo'
      }
    },
    payment_methods: {
      excluded_payment_methods: [],
      excluded_payment_types: [],
      installments: 12,
      default_installments: 1
    },
    back_urls: {
      success: MERCADOPAGO_CONFIG.SUCCESS_URL,
      failure: MERCADOPAGO_CONFIG.FAILURE_URL,
      pending: MERCADOPAGO_CONFIG.PENDING_URL
    },
    auto_return: 'approved',
    notification_url: MERCADOPAGO_CONFIG.NOTIFICATION_URL,
    external_reference: `qrcraft_${userData?.id}_${Date.now()}`,
    metadata: {
      user_id: userData?.id,
      plan: 'pro',
      upgrade_type: 'annual',
      app: 'qrcraft-studio'
    },
    expires: true,
    expiration_date_from: new Date().toISOString(),
    expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
  };

  try {
    // Em produção, fazer chamada real para API do Mercado Pago
    // const response = await fetch(`${MERCADOPAGO_CONFIG.API_BASE_URL}/checkout/preferences`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${MERCADOPAGO_CONFIG.ACCESS_TOKEN}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(preference)
    // });
    
    // Para desenvolvimento, simular resposta
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const simulatedResponse = {
      id: `preference_${generateId()}`,
      init_point: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=preference_${generateId()}`,
      sandbox_init_point: `https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=preference_${generateId()}`,
      ...preference
    };
    
    return {
      success: true,
      data: simulatedResponse
    };
    
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para processar pagamento PIX
export const createPixPayment = async (userData, amount = 20.00) => {
  try {
    const response = await fetch(`${CONFIG.URLS.BACKEND}/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'pix',
        userData,
        amount
      })
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Erro ao criar pagamento PIX');
    }

    return result;
    
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para processar pagamento com cartão
export const processCardPayment = async (cardData, userData, amount = 20.00) => {
  try {
    const response = await fetch(`${CONFIG.URLS.BACKEND}/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'card',
        userData,
        amount,
        cardData
      })
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Erro ao processar pagamento com cartão');
    }

    return result;
    
  } catch (error) {
    console.error('Erro ao processar pagamento com cartão:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para verificar status do pagamento
export const checkPaymentStatus = async (paymentId) => {
  try {
    // Em produção, consultar API do Mercado Pago
    // const response = await fetch(`${MERCADOPAGO_CONFIG.API_BASE_URL}/v1/payments/${paymentId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${MERCADOPAGO_CONFIG.ACCESS_TOKEN}`
    //   }
    // });
    
    // Simular consulta
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        id: paymentId,
        status: 'approved',
        status_detail: 'accredited'
      }
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para processar webhook do Mercado Pago
export const processWebhook = (webhookData) => {
  console.log('📨 Webhook recebido:', webhookData);
  
  const { type, data } = webhookData;
  
  switch (type) {
    case 'payment':
      return processPaymentWebhook(data.id);
    case 'plan':
      return processPlanWebhook(data.id);
    default:
      console.log('Tipo de webhook não reconhecido:', type);
      return { success: false, error: 'Webhook type not supported' };
  }
};

// Funções auxiliares
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const generatePixQRCode = () => {
  // Gerar um QR code base64 simulado (em produção seria retornado pela API)
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  // Desenhar um padrão simples para simular QR code
  ctx.fillStyle = '#000';
  for (let i = 0; i < 200; i += 10) {
    for (let j = 0; j < 200; j += 10) {
      if (Math.random() > 0.5) {
        ctx.fillRect(i, j, 8, 8);
      }
    }
  }
  
  return canvas.toDataURL().split(',')[1];
};

const generatePixCode = () => {
  // Gerar código PIX simulado
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 50; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `qrcraft.pix.${result}`;
};

const processPaymentWebhook = async (paymentId) => {
  try {
    const paymentData = await checkPaymentStatus(paymentId);
    
    if (paymentData.success && paymentData.data.status === 'approved') {
      // Aqui você processaria a aprovação do pagamento
      // Atualizar plano do usuário, enviar email de confirmação, etc.
      console.log('✅ Pagamento aprovado via webhook:', paymentId);
      
      return {
        success: true,
        message: 'Payment processed successfully'
      };
    }
    
    return {
      success: false,
      error: 'Payment not approved'
    };
    
  } catch (error) {
    console.error('Erro no webhook de pagamento:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const processPlanWebhook = (planId) => {
  // Processar webhooks relacionados a planos/assinaturas
  console.log('📋 Processando webhook de plano:', planId);
  return { success: true };
};

// Validação de pagamento local (para desenvolvimento)
export const validatePayment = (paymentData, userData) => {
  const requiredFields = ['id', 'status', 'transaction_amount'];
  
  for (const field of requiredFields) {
    if (!paymentData[field]) {
      return {
        valid: false,
        error: `Campo obrigatório ausente: ${field}`
      };
    }
  }
  
  if (paymentData.status !== 'approved') {
    return {
      valid: false,
      error: 'Pagamento não foi aprovado'
    };
  }
  
  if (paymentData.transaction_amount < MERCADOPAGO_CONFIG.PRODUCTS.PRO_ANNUAL.price) {
    return {
      valid: false,
      error: 'Valor do pagamento insuficiente'
    };
  }
  
  return {
    valid: true,
    message: 'Pagamento válido'
  };
};

// Função para atualizar plano do usuário após pagamento
export const upgradeUserPlan = (userData, paymentData) => {
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  
  const updatedUser = {
    ...userData,
    plan: 'pro',
    planExpiry: expiry.toISOString(),
    paymentHistory: [
      ...(userData.paymentHistory || []),
      {
        id: paymentData.id,
        amount: paymentData.transaction_amount,
        method: paymentData.payment_method_id,
        status: paymentData.status,
        date: new Date().toISOString(),
        plan: 'pro',
        duration: 'annual'
      }
    ]
  };
  
  // Atualizar localStorage
  const users = JSON.parse(localStorage.getItem('qrcraft-users') || '[]');
  const userIndex = users.findIndex(u => u.id === userData.id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    localStorage.setItem('qrcraft-users', JSON.stringify(users));
  }
  
  localStorage.setItem('qrcraft-currentUser', JSON.stringify(updatedUser));
  
  return updatedUser;
}; 