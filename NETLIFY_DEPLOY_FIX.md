# 🚀 Guia para Corrigir Deploy no Netlify - QRCraft Studio

## 🔧 Problema Identificado

O deploy foi feito com o repositório inteiro em vez de apenas a pasta `dist` (build de produção).

## ✅ Solução - Passos para Corrigir

### 1. **Configuração Automática via GitHub**

1. **Acesse o painel do Netlify**: https://app.netlify.com/projects/qrcraft-studio/overview
2. **Vá em "Site configuration" → "Build & deploy"**
3. **Configure as seguintes opções**:

```
Build command: npm ci && npm run build
Publish directory: dist
Base directory: (deixe vazio)
```

### 2. **Variáveis de Ambiente** (se necessário)

Adicione no painel do Netlify em "Environment variables":
```
NODE_VERSION=18
NPM_VERSION=9
```

### 3. **Forçar Novo Deploy**

1. **Vá em "Deploys"**
2. **Clique em "Trigger deploy" → "Deploy site"**
3. **Aguarde o build completar**

---

## 🛠️ Alternativa: Deploy Manual via CLI

Se preferir fazer deploy manual, use o script criado:

```bash
# Dar permissão de execução
chmod +x deploy-netlify.sh

# Executar deploy
./deploy-netlify.sh
```

---

## 📁 Estrutura Correta do Deploy

O Netlify deve deployar apenas o conteúdo da pasta `dist/`:

```
dist/
├── index.html          # Página principal
├── assets/            # CSS, JS compilados
├── icons/             # Ícones da aplicação
├── manifest.json      # PWA manifest
├── sw.js             # Service Worker
└── ...               # Outros arquivos compilados
```

**❌ NÃO deve incluir**:
- `node_modules/`
- `src/`
- `public/` (arquivos brutos)
- `.git/`
- Arquivos de configuração de desenvolvimento

---

## 🔍 Verificações Pós-Deploy

### 1. **Testar a Aplicação**
- Acessar: https://qrcraft-studio.netlify.app
- Verificar se carrega corretamente
- Testar funcionalidades principais

### 2. **Verificar Performance**
- Lighthouse Score
- Tempos de carregamento
- PWA funcionando

### 3. **Verificar Funcionalidades**
- Geração de QR Codes ✅
- Sistema de autenticação ✅
- Planos PRO ✅
- Scanner QR ✅
- Download de arquivos ✅

---

## 🚨 Troubleshooting

### **Problema: "Build failed"**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Problema: "404 - Page not found"**
- Verificar se `netlify.toml` está correto
- Confirmar redirect para SPA: `/* → /index.html`

### **Problema: "Assets não carregam"**
- Verificar se `publish = "dist"` está configurado
- Confirmar que `npm run build` gera arquivos em `dist/`

---

## 📊 Configurações de Performance

O arquivo `netlify.toml` já inclui:

- ✅ **Compressão Gzip**
- ✅ **Cache Headers otimizados**
- ✅ **Headers de segurança**
- ✅ **SPA Redirects**
- ✅ **Service Worker cache**

---

## 🌐 URLs da Aplicação

- **Produção**: https://qrcraft-studio.netlify.app
- **Admin Netlify**: https://app.netlify.com/projects/qrcraft-studio
- **Repositório**: https://github.com/mathalves23/QRCraft-Studio

---

## 📞 Suporte

Se ainda houver problemas:

1. **Verificar logs do build** no painel Netlify
2. **Testar build local**: `npm run build && npm run preview`
3. **Comparar com pasta `dist/` local**

**Deploy Status**: 🟢 Configurado e pronto para funcionar!

---

## 📋 Checklist Final

- [ ] Arquivo `netlify.toml` configurado
- [ ] Build command: `npm ci && npm run build`
- [ ] Publish directory: `dist`
- [ ] Deploy realizado com sucesso
- [ ] Aplicação funcionando online
- [ ] PWA instalável
- [ ] Performance otimizada

**🎉 Sucesso! Sua aplicação QRCraft Studio está no ar!** 