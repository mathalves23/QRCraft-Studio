# 🚀 Guia de Configuração para Produção - QRCraft Studio

## 📋 **Checklist Pré-Deploy**

### ✅ **1. Credenciais do Mercado Pago**

1. **Obter Credenciais de Produção:**
   - Acesse [developers.mercadopago.com](https://developers.mercadopago.com)
   - Crie/acesse sua aplicação
   - Copie as credenciais de **PRODUÇÃO**:
     ```
     PUBLIC_KEY: APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
     ACCESS_TOKEN: APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
     ```

2. **Configurar URLs na aplicação MP:**
   ```
   URLs de redirecionamento:
   - https://seudominio.com/payment/success
   - https://seudominio.com/payment/failure  
   - https://seudominio.com/payment/pending

   URL de notificação (webhook):
   - https://api.seudominio.com/webhook/mercadopago
   ```

### ✅ **2. Configuração do Frontend**

Crie um arquivo `.env` na raiz do projeto frontend:

```bash
# Frontend .env
VITE_MP_PUBLIC_KEY=APP_USR-suas-credenciais-reais-aqui
VITE_MP_ACCESS_TOKEN=APP_USR-suas-credenciais-reais-aqui
VITE_BACKEND_URL=https://api.seudominio.com
VITE_FRONTEND_URL=https://seudominio.com
VITE_NODE_ENV=production
VITE_MP_ENVIRONMENT=production
```

### ✅ **3. Configuração do Backend**

1. **Instalar dependências do backend:**
```bash
cd /backend
npm install
```

2. **Criar arquivo `.env` no backend:**
```bash
# Backend .env
NODE_ENV=production
PORT=8000

# URLs da Aplicação
FRONTEND_URL=https://seudominio.com
BACKEND_URL=https://api.seudominio.com

# Mercado Pago - CREDENCIAIS REAIS
MP_ACCESS_TOKEN=APP_USR-suas-credenciais-reais-aqui
MP_PUBLIC_KEY=APP_USR-suas-credenciais-reais-aqui

# Webhook - Chave secreta forte
MP_WEBHOOK_SECRET=SuaChaveSecretaMuitoForte123!@#$%
```

### ✅ **4. Testes Locais**

**Testar Backend:**
```bash
cd backend
npm run dev
# Servidor deve iniciar em http://localhost:8000
```

**Testar Frontend:**
```bash
npm run dev
# App deve iniciar conectando ao backend
```

**Verificar integração:**
- Teste pagamentos com credenciais de produção
- Verifique se webhook está sendo chamado

---

## 🌐 **Deploy em Produção**

### **Frontend (Vercel/Netlify)**

1. **Build do projeto:**
```bash
npm run build
```

2. **Configurar variáveis no Vercel/Netlify:**
```
VITE_MP_PUBLIC_KEY=APP_USR-xxx
VITE_MP_ACCESS_TOKEN=APP_USR-xxx
VITE_BACKEND_URL=https://api.seudominio.com
VITE_FRONTEND_URL=https://seudominio.com
VITE_NODE_ENV=production
```

### **Backend (Railway/Render/DigitalOcean)**

1. **Configurar variáveis de ambiente:**
```bash
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://seudominio.com
BACKEND_URL=https://api.seudominio.com
MP_ACCESS_TOKEN=APP_USR-xxx
MP_PUBLIC_KEY=APP_USR-xxx
MP_WEBHOOK_SECRET=ChaveSecretaForte123
```

2. **Deploy do servidor:**
```bash
# Para Railway
railway deploy

# Para Render
git push origin main

# Para DigitalOcean App Platform
doctl apps create --spec app.yaml
```

---

## 🔐 **Configuração de Segurança**

### **1. HTTPS Obrigatório**
- Frontend e Backend **DEVEM** usar HTTPS
- Mercado Pago **NÃO aceita** URLs HTTP em produção

### **2. CORS**
Configure CORS no backend para aceitar apenas seu domínio:
```javascript
app.use(cors({
  origin: [
    'https://seudominio.com',
    'https://www.seudominio.com'
  ],
  credentials: true
}));
```

### **3. Validação de Webhook**
A validação de assinatura está implementada no código:
```javascript
// Será executada automaticamente em produção
if (process.env.NODE_ENV === 'production' && !validateWebhookSignature(req)) {
  return res.status(401).json({ error: 'Assinatura inválida' });
}
```

---

## 🧪 **Testando em Produção**

### **1. Testes com Cartões Reais**

**⚠️ IMPORTANTE:** Em produção, use **cartões reais** com valores baixos.

**Cartões para teste de rejeição:**
- **4000 0000 0000 0002** - Cartão sempre rejeitado
- **4000 0000 0000 0127** - Cartão com CVC inválido

### **2. Testes PIX**

1. Gere um PIX de **R$ 0,01** (valor mínimo)
2. Use seu próprio CPF para testar
3. Pague imediatamente para ver o webhook

### **3. Monitoramento**

**Logs do Webhook:**
```bash
# Ver logs do servidor
tail -f /var/log/app.log

# Ou usando Railway/Render
railway logs --tail
```

**Status dos pagamentos:**
```bash
curl https://api.seudominio.com/api/payments
```

---

## 🚨 **Troubleshooting**

### **Erro: "Credenciais inválidas"**
- ✅ Verifique se está usando credenciais de **PRODUÇÃO**
- ✅ Confirme que a aplicação MP está **ativa**
- ✅ Teste as credenciais via API diretamente

### **Erro: "Webhook não está sendo chamado"**
- ✅ Confirme que a URL webhook está acessível publicamente
- ✅ Verifique se o endpoint retorna **status 200**
- ✅ Confirme HTTPS na URL do webhook

### **Erro: "CORS"**
- ✅ Configure CORS no backend para seu domínio
- ✅ Verifique se todas as URLs estão corretas

### **Erro: "Pagamento rejeitado"**
- ✅ Use dados reais (CPF, endereço, telefone)
- ✅ Teste com cartão de valor baixo primeiro
- ✅ Verifique logs do Mercado Pago

---

## 📊 **Monitoramento Pós-Deploy**

### **Métricas Importantes:**
- Taxa de conversão de pagamentos
- Tempo de resposta do webhook
- Erros de API
- Upgrades de plano realizados

### **Alertas Recomendados:**
- Webhook com erro > 5 minutos
- Taxa de rejeição > 30%
- Indisponibilidade da API > 1 minuto

### **Logs Essenciais:**
```javascript
console.log('✅ Pagamento aprovado:', paymentId, userId);
console.log('❌ Pagamento rejeitado:', paymentId, reason);
console.log('🎯 Webhook recebido:', webhookType, action);
```

---

## 🔄 **Próximos Passos**

1. **Banco de Dados Real:** Substitua Map() por PostgreSQL/MongoDB
2. **Email de Confirmação:** Implemente envio de emails
3. **Dashboard Admin:** Crie painel de controle
4. **Analytics:** Integre Google Analytics/Mixpanel
5. **Cache:** Implemente Redis para performance
6. **Backup:** Configure backup automático

---

## 📞 **Suporte**

**Mercado Pago:**
- [Documentação](https://www.mercadopago.com.br/developers)
- [Status da API](https://status.mercadolibre.com/)
- [Suporte Técnico](https://www.mercadopago.com.br/developers/support)

**QRCraft Studio:**
- Webhook URL: `https://api.seudominio.com/webhook/mercadopago`
- Health Check: `https://api.seudominio.com/health`
- API Docs: `https://api.seudominio.com/api/docs`

---

✨ **Sistema pronto para produção!** 🚀 