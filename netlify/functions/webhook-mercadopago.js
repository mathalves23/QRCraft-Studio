// Netlify Function - Webhook Mercado Pago
const crypto = require('crypto');

// Configurações do Mercado Pago
const MP_CONFIG = {
  ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
  WEBHOOK_SECRET: process.env.MP_WEBHOOK_SECRET,
  API_BASE: 'https://api.mercadopago.com'
};

// Storage simples (substitua por banco real)
let payments = {};
let users = {};

exports.handler = async (event, context) => {
  console.log('🎯 Webhook recebido:', JSON.stringify(event, null, 2));

  // Permitir apenas POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    // Headers CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json'
    };

    // Responder rapidamente ao Mercado Pago
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }

    const body = JSON.parse(event.body || '{}');
    const { type, action, data, live_mode } = body;

    // Validar assinatura do webhook (opcional mas recomendado)
    if (process.env.NODE_ENV === 'production' && !validateWebhookSignature(event)) {
      console.error('❌ Assinatura inválida do webhook');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Assinatura inválida' })
      };
    }

    // Processar webhook em background
    if (type === 'payment') {
      await handlePaymentWebhook(data.id, action);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        received: true,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error.message 
      })
    };
  }
};

// Validar assinatura do webhook
function validateWebhookSignature(event) {
  if (!MP_CONFIG.WEBHOOK_SECRET) return true;
  
  const signature = event.headers['x-signature'];
  const requestId = event.headers['x-request-id'];
  
  if (!signature || !requestId) return false;
  
  const body = JSON.parse(event.body);
  const dataID = body?.data?.id || '';
  const signatureArray = signature.split(',');
  
  let hash;
  signatureArray.forEach(item => {
    const [key, value] = item.split('=');
    if (key && key.trim() === 'v1') {
      hash = value;
    }
  });
  
  const manifest = `id:${dataID};request-id:${requestId};`;
  const hmac = crypto.createHmac('sha256', MP_CONFIG.WEBHOOK_SECRET);
  hmac.update(manifest);
  const sha = hmac.digest('hex');
  
  return sha === hash;
}

// Processar webhook de pagamento
async function handlePaymentWebhook(paymentId, action) {
  try {
    console.log(`💳 Processando pagamento ${paymentId} - ação: ${action}`);

    // Buscar dados do pagamento na API do MP
    const response = await fetch(
      `${MP_CONFIG.API_BASE}/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${MP_CONFIG.ACCESS_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const payment = await response.json();
    console.log(`💰 Status do pagamento: ${payment.status} - ${payment.status_detail}`);

    // Salvar/atualizar pagamento
    payments[paymentId] = {
      ...payment,
      updated_at: new Date(),
      webhook_action: action
    };

    // Processar baseado no status
    if (payment.status === 'approved') {
      await handleApprovedPayment(payment);
    }

  } catch (error) {
    console.error(`❌ Erro ao processar pagamento ${paymentId}:`, error.message);
  }
}

// Pagamento aprovado - fazer upgrade do usuário
async function handleApprovedPayment(payment) {
  const userId = payment.metadata?.user_id || payment.external_reference?.split('_')[1];
  
  if (!userId) {
    console.error('❌ User ID não encontrado no pagamento');
    return;
  }

  console.log(`✅ Pagamento aprovado para usuário ${userId}`);

  // Fazer upgrade do plano
  const user = users[userId] || { id: userId };
  const upgradedUser = {
    ...user,
    plan: 'pro',
    proExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
    paymentHistory: [
      ...(user.paymentHistory || []),
      {
        id: payment.id,
        amount: payment.transaction_amount,
        status: 'approved',
        method: payment.payment_method_id,
        date: new Date(payment.date_created),
        plan: 'pro'
      }
    ],
    updatedAt: new Date()
  };

  users[userId] = upgradedUser;
  
  console.log(`🎉 Usuário ${userId} upgradeado para PRO até ${upgradedUser.proExpiresAt}`);
} 