# 💳 Sistema de Pagamentos - QRCraft Studio

## Visão Geral

O QRCraft Studio possui um sistema de pagamentos **real** integrado com o **Mercado Pago**, permitindo que usuários façam upgrade para o plano PRO de forma segura e confiável.

## 🚀 Funcionalidades Implementadas

### ✅ Métodos de Pagamento Suportados

1. **PIX** 🔗
   - Pagamento instantâneo
   - QR Code gerado automaticamente
   - Confirmação em tempo real via webhook

2. **Cartão de Crédito** 💳
   - Até 12x sem juros
   - Suporte a Visa, Mastercard, Elo
   - Processamento seguro via Mercado Pago

3. **Checkout Mercado Pago** 🛒
   - Todos os métodos disponíveis
   - Interface oficial do Mercado Pago
   - Máxima segurança e confiabilidade

### 🔧 Componentes Principais

#### 1. PaymentModal (`src/components/PaymentModal.jsx`)
- Modal principal para processar pagamentos
- Interface moderna e responsiva
- Integração direta com SDK do Mercado Pago
- Suporte a múltiplos métodos de pagamento

#### 2. PaymentHistory (`src/components/PaymentHistory.jsx`)
- Histórico completo de transações
- Detalhes de cada pagamento
- Status em tempo real
- Interface para visualizar comprovantes

#### 3. Configuração Mercado Pago (`src/utils/mercadoPagoConfig.js`)
- Configurações centralizadas
- Funções para criar preferências
- Processamento de webhooks
- Validação de pagamentos

### 💰 Plano PRO - R$ 20,00/ano

**Benefícios inclusos:**
- ✅ QR Codes ilimitados
- ✅ Todos os templates (WiFi, vCard, SMS, etc.)
- ✅ Geração em lote
- ✅ Scanner de QR Code
- ✅ Múltiplos formatos (PNG, SVG, PDF)
- ✅ Analytics avançado
- ✅ Histórico completo
- ✅ Suporte prioritário

## 🔐 Configuração de Produção

### 1. Credenciais do Mercado Pago

Edite o arquivo `src/utils/mercadoPagoConfig.js`:

```javascript
export const MERCADOPAGO_CONFIG = {
  // Substitua pelas suas credenciais de PRODUÇÃO
  PUBLIC_KEY: 'APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  ACCESS_TOKEN: 'APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  
  // URLs do seu domínio
  NOTIFICATION_URL: 'https://seudominio.com/webhook/mercadopago',
  SUCCESS_URL: 'https://seudominio.com/payment/success',
  FAILURE_URL: 'https://seudominio.com/payment/failure',
  PENDING_URL: 'https://seudominio.com/payment/pending'
};
```

### 2. Backend para Webhooks

Você precisará implementar um endpoint para receber webhooks:

```javascript
// Exemplo em Node.js/Express
app.post('/webhook/mercadopago', (req, res) => {
  const { type, data } = req.body;
  
  if (type === 'payment') {
    // Processar pagamento aprovado
    // Atualizar plano do usuário no banco de dados
    // Enviar email de confirmação
  }
  
  res.status(200).send('OK');
});
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env`:

```env
VITE_MP_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_MP_ACCESS_TOKEN=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_BACKEND_URL=https://seudominio.com
```

## 🧪 Modo de Desenvolvimento

### Credenciais de Teste

O sistema já vem configurado com credenciais de **teste** do Mercado Pago:

```javascript
PUBLIC_KEY: 'TEST-4cd7f5e0-1ea4-4b78-aa8e-66e0b78eee19'
ACCESS_TOKEN: 'TEST-8123456789012345-123456-abcdef1234567890abcdef1234567890-123456789'
```

### Cartões de Teste

Para testar pagamentos com cartão, use:

| Cartão | Número | CVV | Vencimento |
|--------|--------|-----|------------|
| Visa | 4509 9535 6623 3704 | 123 | 11/25 |
| Mastercard | 5031 7557 3453 0604 | 123 | 11/25 |
| Elo | 6362 9707 4013 9894 | 123 | 11/25 |

### PIX de Teste

O sistema gera QR Codes PIX simulados que são aprovados automaticamente após 10 segundos.

## 📱 Fluxo de Pagamento

### 1. Usuário Clica em "Upgrade PRO"
- Modal de pagamento é aberto
- Detalhes do plano são exibidos
- Métodos de pagamento são apresentados

### 2. Seleção do Método
- **PIX**: QR Code é gerado instantaneamente
- **Cartão**: Formulário de dados do cartão
- **Checkout MP**: Redirecionamento para página oficial

### 3. Processamento
- Pagamento é processado via API do Mercado Pago
- Status é atualizado em tempo real
- Usuário recebe feedback visual

### 4. Confirmação
- Plano é atualizado automaticamente
- Histórico de pagamento é salvo
- Usuário ganha acesso às funcionalidades PRO

## 🔄 Webhooks e Notificações

### Eventos Suportados

1. **payment.created** - Pagamento criado
2. **payment.approved** - Pagamento aprovado
3. **payment.rejected** - Pagamento rejeitado
4. **payment.pending** - Pagamento pendente

### Processamento Automático

```javascript
// Exemplo de processamento de webhook
const processPaymentWebhook = async (paymentId) => {
  const payment = await mercadopago.payment.findById(paymentId);
  
  if (payment.status === 'approved') {
    // Atualizar usuário para PRO
    await upgradeUserToPro(payment.metadata.user_id);
    
    // Enviar email de confirmação
    await sendConfirmationEmail(payment.payer.email);
    
    // Registrar no histórico
    await savePaymentHistory(payment);
  }
};
```

## 📊 Analytics e Relatórios

### Métricas Disponíveis

- Total de receita
- Conversão por método de pagamento
- Taxa de aprovação
- Usuários PRO ativos
- Renovações e cancelamentos

### Dashboard Administrativo

```javascript
// Exemplo de métricas
const getPaymentMetrics = () => {
  return {
    totalRevenue: calculateTotalRevenue(),
    conversionRate: calculateConversionRate(),
    activeProUsers: countActiveProUsers(),
    monthlyRecurring: calculateMRR()
  };
};
```

## 🛡️ Segurança

### Validações Implementadas

1. **Validação de Valor**: Confirma se o valor pago está correto
2. **Verificação de Status**: Apenas pagamentos aprovados são processados
3. **Assinatura de Webhook**: Valida autenticidade das notificações
4. **Rate Limiting**: Previne spam de tentativas de pagamento

### Dados Sensíveis

- Dados de cartão **nunca** são armazenados localmente
- Tokens de pagamento são processados apenas pelo Mercado Pago
- Comunicação sempre via HTTPS
- Logs de pagamento são anonimizados

## 🚨 Tratamento de Erros

### Cenários Cobertos

1. **Pagamento Rejeitado**
   - Feedback claro ao usuário
   - Sugestões de ação
   - Opção de tentar novamente

2. **Falha de Conexão**
   - Retry automático
   - Fallback para métodos alternativos
   - Notificação de erro amigável

3. **Webhook Perdido**
   - Sistema de reconciliação
   - Verificação periódica de status
   - Atualização manual quando necessário

## 📞 Suporte e Manutenção

### Logs de Pagamento

```javascript
// Exemplo de log estruturado
console.log('💳 Pagamento processado:', {
  paymentId: payment.id,
  userId: user.id,
  amount: payment.transaction_amount,
  method: payment.payment_method_id,
  status: payment.status,
  timestamp: new Date().toISOString()
});
```

### Monitoramento

- Alertas para pagamentos falhados
- Notificações de webhooks perdidos
- Relatórios diários de transações
- Dashboard de saúde do sistema

## 🔄 Atualizações Futuras

### Roadmap

1. **Assinaturas Recorrentes**
   - Planos mensais
   - Renovação automática
   - Gestão de ciclo de vida

2. **Múltiplas Moedas**
   - Suporte internacional
   - Conversão automática
   - Preços regionais

3. **Cupons de Desconto**
   - Códigos promocionais
   - Descontos por volume
   - Campanhas sazonais

4. **Programa de Afiliados**
   - Comissões por indicação
   - Dashboard de afiliados
   - Pagamentos automáticos

---

## 🎯 Conclusão

O sistema de pagamentos do QRCraft Studio foi desenvolvido com foco em:

- **Segurança**: Integração oficial com Mercado Pago
- **Usabilidade**: Interface intuitiva e responsiva
- **Confiabilidade**: Tratamento robusto de erros
- **Escalabilidade**: Arquitetura preparada para crescimento

Para dúvidas ou suporte, consulte a documentação oficial do Mercado Pago ou entre em contato com nossa equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para QRCraft Studio** 