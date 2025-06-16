// Backend QRCraft Studio - Servidor Express com Webhook Mercado Pago
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Configurações do Mercado Pago
const MP_CONFIG = {
  ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
  WEBHOOK_SECRET: process.env.MP_WEBHOOK_SECRET,
  API_BASE: 'https://api.mercadopago.com'
};

// Base de dados simples (substitua por banco real)
const payments = new Map();
const users = new Map();

// ====== ROTAS DE PAGAMENTO ======

// Criar preferência de pagamento
app.post('/api/payment/preference', async (req, res) => {
  try {
    const { userData, planId } = req.body;

    const preference = {
      items: [{
        id: 'qrcraft-pro-annual',
        title: 'QRCraft Studio PRO - Plano Anual',
        description: 'Acesso completo a todas as funcionalidades premium por 1 ano',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: 20.00
      }],
      payer: {
        name: userData?.name || 'Usuário QRCraft',
        email: userData?.email || 'user@qrcraft.com'
      },
      payment_methods: {
        installments: 12,
        default_installments: 1
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/payment/success`,
        failure: `${process.env.FRONTEND_URL}/payment/failure`,
        pending: `${process.env.FRONTEND_URL}/payment/pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.BACKEND_URL}/webhook/mercadopago`,
      external_reference: `qrcraft_${userData?.id}_${Date.now()}`,
      metadata: {
        user_id: userData?.id,
        plan: 'pro',
        app: 'qrcraft-studio'
      }
    };

    const response = await axios.post(
      `${MP_CONFIG.API_BASE}/checkout/preferences`,
      preference,
      {
        headers: {
          'Authorization': `Bearer ${MP_CONFIG.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Erro ao criar preferência:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar preferência de pagamento'
    });
  }
});

// Criar pagamento PIX
app.post('/api/payment/pix', async (req, res) => {
  try {
    const { userData, amount = 20.00 } = req.body;

    const payment = {
      transaction_amount: amount,
      description: 'QRCraft Studio PRO - Plano Anual',
      payment_method_id: 'pix',
      payer: {
        email: userData?.email || 'user@qrcraft.com',
        first_name: userData?.name?.split(' ')[0] || 'Usuário',
        last_name: userData?.name?.split(' ').slice(1).join(' ') || 'QRCraft'
      },
      external_reference: `qrcraft_pix_${userData?.id}_${Date.now()}`,
      notification_url: `${process.env.BACKEND_URL}/webhook/mercadopago`,
      metadata: {
        user_id: userData?.id,
        plan: 'pro',
        payment_type: 'pix'
      }
    };

    const response = await axios.post(
      `${MP_CONFIG.API_BASE}/v1/payments`,
      payment,
      {
        headers: {
          'Authorization': `Bearer ${MP_CONFIG.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Salvar pagamento na base local
    payments.set(response.data.id, {
      ...response.data,
      user_id: userData?.id,
      created_at: new Date()
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar pagamento PIX'
    });
  }
});

// Processar pagamento com cartão
app.post('/api/payment/card', async (req, res) => {
  try {
    const { cardData, userData, amount = 20.00 } = req.body;

    const payment = {
      transaction_amount: amount,
      token: cardData.token,
      description: 'QRCraft Studio PRO - Plano Anual',
      installments: cardData.installments || 1,
      payment_method_id: cardData.payment_method_id,
      issuer_id: cardData.issuer_id,
      payer: {
        email: userData?.email || 'user@qrcraft.com',
        identification: {
          type: cardData.payer?.identification?.type || 'CPF',
          number: cardData.payer?.identification?.number || '12345678901'
        }
      },
      external_reference: `qrcraft_card_${userData?.id}_${Date.now()}`,
      notification_url: `${process.env.BACKEND_URL}/webhook/mercadopago`,
      metadata: {
        user_id: userData?.id,
        plan: 'pro',
        payment_type: 'credit_card'
      }
    };

    const response = await axios.post(
      `${MP_CONFIG.API_BASE}/v1/payments`,
      payment,
      {
        headers: {
          'Authorization': `Bearer ${MP_CONFIG.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Salvar pagamento na base local
    payments.set(response.data.id, {
      ...response.data,
      user_id: userData?.id,
      created_at: new Date()
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Erro ao processar cartão:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar pagamento com cartão'
    });
  }
});

// Consultar status do pagamento
app.get('/api/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const response = await axios.get(
      `${MP_CONFIG.API_BASE}/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${MP_CONFIG.ACCESS_TOKEN}`
        }
      }
    );

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Erro ao consultar pagamento:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao consultar pagamento'
    });
  }
});

// ====== WEBHOOK MERCADO PAGO ======

// Validar assinatura do webhook (opcional mas recomendado)
function validateWebhookSignature(req) {
  if (!MP_CONFIG.WEBHOOK_SECRET) return true; // Skip se não configurado
  
  const signature = req.headers['x-signature'];
  const requestId = req.headers['x-request-id'];
  
  if (!signature || !requestId) return false;
  
  const dataID = req.body?.data?.id || '';
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

// Endpoint principal do webhook
app.post('/webhook/mercadopago', async (req, res) => {
  try {
    console.log('🎯 Webhook recebido:', JSON.stringify(req.body, null, 2));
    console.log('🔍 Headers:', JSON.stringify(req.headers, null, 2));

    // Validar assinatura (em produção)
    if (process.env.NODE_ENV === 'production' && !validateWebhookSignature(req)) {
      console.error('❌ Assinatura inválida do webhook');
      return res.status(401).json({ error: 'Assinatura inválida' });
    }

    const { type, action, data, live_mode } = req.body;

    // Responder rapidamente ao Mercado Pago
    res.status(200).json({ received: true });

    // Processar webhook em background
    setImmediate(async () => {
      try {
        await processWebhookInBackground(type, action, data, live_mode);
      } catch (error) {
        console.error('❌ Erro ao processar webhook em background:', error);
      }
    });

  } catch (error) {
    console.error('❌ Erro no webhook:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Processar webhook em background
async function processWebhookInBackground(type, action, data, live_mode) {
  console.log(`🔄 Processando webhook: ${type}.${action}`);

  if (type === 'payment') {
    await handlePaymentWebhook(data.id, action);
  } else if (type === 'plan') {
    await handlePlanWebhook(data.id, action);
  } else if (type === 'subscription') {
    await handleSubscriptionWebhook(data.id, action);
  } else if (type === 'invoice') {
    await handleInvoiceWebhook(data.id, action);
  }
}

// Processar webhook de pagamento
async function handlePaymentWebhook(paymentId, action) {
  try {
    console.log(`💳 Processando pagamento ${paymentId} - ação: ${action}`);

    // Buscar dados do pagamento na API do MP
    const response = await axios.get(
      `${MP_CONFIG.API_BASE}/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${MP_CONFIG.ACCESS_TOKEN}`
        }
      }
    );

    const payment = response.data;
    console.log(`💰 Status do pagamento: ${payment.status} - ${payment.status_detail}`);

    // Salvar/atualizar pagamento
    payments.set(paymentId, {
      ...payment,
      updated_at: new Date(),
      webhook_action: action
    });

    // Processar baseado no status
    switch (payment.status) {
      case 'approved':
        await handleApprovedPayment(payment);
        break;
      case 'pending':
        await handlePendingPayment(payment);
        break;
      case 'rejected':
        await handleRejectedPayment(payment);
        break;
      case 'cancelled':
        await handleCancelledPayment(payment);
        break;
      case 'refunded':
        await handleRefundedPayment(payment);
        break;
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
  const user = users.get(userId) || { id: userId };
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

  users.set(userId, upgradedUser);
  
  console.log(`🎉 Usuário ${userId} upgradeado para PRO até ${upgradedUser.proExpiresAt}`);

  // Aqui você pode implementar:
  // - Envio de email de confirmação
  // - Notificação push
  // - Integração com CRM
  // - Logs detalhados
}

// Pagamento pendente
async function handlePendingPayment(payment) {
  console.log(`⏳ Pagamento ${payment.id} pendente - ${payment.status_detail}`);
  
  // Para PIX, notificar usuário que está aguardando pagamento
  if (payment.payment_method_id === 'pix') {
    console.log('💰 PIX aguardando pagamento...');
  }
}

// Pagamento rejeitado
async function handleRejectedPayment(payment) {
  console.log(`❌ Pagamento ${payment.id} rejeitado - ${payment.status_detail}`);
  
  // Opcional: notificar usuário sobre rejeição
  // Opcional: sugerir método alternativo de pagamento
}

// Pagamento cancelado
async function handleCancelledPayment(payment) {
  console.log(`🚫 Pagamento ${payment.id} cancelado`);
}

// Pagamento estornado
async function handleRefundedPayment(payment) {
  console.log(`💸 Pagamento ${payment.id} estornado`);
  
  const userId = payment.metadata?.user_id;
  if (userId) {
    // Reverter upgrade do plano
    const user = users.get(userId);
    if (user && user.plan === 'pro') {
      user.plan = 'standard';
      user.proExpiresAt = null;
      users.set(userId, user);
      console.log(`⬇️ Usuário ${userId} rebaixado para Standard devido ao estorno`);
    }
  }
}

// Handlers para outros tipos de webhook
async function handlePlanWebhook(planId, action) {
  console.log(`📋 Webhook de plano: ${planId} - ${action}`);
}

async function handleSubscriptionWebhook(subscriptionId, action) {
  console.log(`🔄 Webhook de assinatura: ${subscriptionId} - ${action}`);
}

async function handleInvoiceWebhook(invoiceId, action) {
  console.log(`🧾 Webhook de fatura: ${invoiceId} - ${action}`);
}

// ====== ROTAS AUXILIARES ======

// Listar usuários (para debug)
app.get('/api/users', (req, res) => {
  const userList = Array.from(users.values());
  res.json(userList);
});

// Listar pagamentos (para debug)
app.get('/api/payments', (req, res) => {
  const paymentList = Array.from(payments.values());
  res.json(paymentList);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware de erro global
app.use((error, req, res, next) => {
  console.error('❌ Erro global:', error);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Webhook URL: http://localhost:${PORT}/webhook/mercadopago`);
  console.log(`🔑 Mercado Pago configurado: ${MP_CONFIG.ACCESS_TOKEN ? '✅' : '❌'}`);
}); 