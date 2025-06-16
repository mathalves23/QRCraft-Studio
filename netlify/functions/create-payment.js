// Netlify Function - Criar Pagamentos
exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Responder OPTIONS para CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Permitir apenas POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { type, userData, amount = 20.00, cardData } = body;

    const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
    const MP_API_BASE = 'https://api.mercadopago.com';

    let payment;

    if (type === 'pix') {
      // Criar pagamento PIX
      payment = {
        transaction_amount: amount,
        description: 'QRCraft Studio PRO - Plano Anual',
        payment_method_id: 'pix',
        payer: {
          email: userData?.email || 'user@qrcraft.com',
          first_name: userData?.name?.split(' ')[0] || 'Usuário',
          last_name: userData?.name?.split(' ').slice(1).join(' ') || 'QRCraft'
        },
        external_reference: `qrcraft_pix_${userData?.id}_${Date.now()}`,
        notification_url: `https://qrcraftstudio.netlify.app/.netlify/functions/webhook-mercadopago`,
        metadata: {
          user_id: userData?.id,
          plan: 'pro',
          payment_type: 'pix'
        }
      };

    } else if (type === 'card') {
      // Criar pagamento com cartão
      payment = {
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
        notification_url: `https://qrcraftstudio.netlify.app/.netlify/functions/webhook-mercadopago`,
        metadata: {
          user_id: userData?.id,
          plan: 'pro',
          payment_type: 'credit_card'
        }
      };

    } else {
      throw new Error('Tipo de pagamento inválido');
    }

    // Chamar API do Mercado Pago
    const response = await fetch(`${MP_API_BASE}/v1/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payment)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const paymentData = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: paymentData
      })
    };

  } catch (error) {
    console.error('❌ Erro ao criar pagamento:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}; 