#!/bin/bash

# 🚀 Script de Configuração para Produção - QRCraft Studio
# Execute com: chmod +x setup-production.sh && ./setup-production.sh

echo "🚀 Configurando QRCraft Studio para Produção..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para perguntar credenciais
ask_credentials() {
    echo -e "${BLUE}📋 Configuração das Credenciais do Mercado Pago${NC}"
    echo ""
    
    echo -n "🔑 Digite sua PUBLIC_KEY de produção: "
    read MP_PUBLIC_KEY
    
    echo -n "🔑 Digite seu ACCESS_TOKEN de produção: "
    read MP_ACCESS_TOKEN
    
    echo -n "🌐 Digite a URL do seu frontend (ex: https://seudominio.com): "
    read FRONTEND_URL
    
    echo -n "🌐 Digite a URL do seu backend (ex: https://api.seudominio.com): "
    read BACKEND_URL
    
    echo -n "🔐 Digite uma chave secreta para webhook (ou pressione Enter para gerar): "
    read WEBHOOK_SECRET
    
    if [ -z "$WEBHOOK_SECRET" ]; then
        WEBHOOK_SECRET=$(openssl rand -base64 32)
        echo -e "${GREEN}🔐 Chave gerada automaticamente: $WEBHOOK_SECRET${NC}"
    fi
    
    echo ""
}

# Função para criar .env do frontend
create_frontend_env() {
    echo -e "${YELLOW}📁 Criando .env do frontend...${NC}"
    
    cat > .env << EOF
# Mercado Pago - Credenciais de PRODUÇÃO
VITE_MP_PUBLIC_KEY=$MP_PUBLIC_KEY
VITE_MP_ACCESS_TOKEN=$MP_ACCESS_TOKEN

# URLs da aplicação
VITE_BACKEND_URL=$BACKEND_URL
VITE_FRONTEND_URL=$FRONTEND_URL

# Ambiente
VITE_NODE_ENV=production
VITE_MP_ENVIRONMENT=production
EOF
    
    echo -e "${GREEN}✅ .env do frontend criado com sucesso!${NC}"
}

# Função para criar .env do backend
create_backend_env() {
    echo -e "${YELLOW}📁 Criando .env do backend...${NC}"
    
    mkdir -p backend
    
    cat > backend/.env << EOF
# Configurações do Servidor
NODE_ENV=production
PORT=8000

# URLs da Aplicação
FRONTEND_URL=$FRONTEND_URL
BACKEND_URL=$BACKEND_URL

# Mercado Pago - CREDENCIAIS REAIS
MP_ACCESS_TOKEN=$MP_ACCESS_TOKEN
MP_PUBLIC_KEY=$MP_PUBLIC_KEY

# Webhook - Chave secreta
MP_WEBHOOK_SECRET=$WEBHOOK_SECRET
EOF
    
    echo -e "${GREEN}✅ .env do backend criado com sucesso!${NC}"
}

# Função para instalar dependências do backend
install_backend_deps() {
    echo -e "${YELLOW}📦 Instalando dependências do backend...${NC}"
    
    cd backend
    
    if command -v npm &> /dev/null; then
        npm install
        echo -e "${GREEN}✅ Dependências instaladas com npm!${NC}"
    elif command -v yarn &> /dev/null; then
        yarn install
        echo -e "${GREEN}✅ Dependências instaladas com yarn!${NC}"
    else
        echo -e "${RED}❌ npm ou yarn não encontrado. Instale as dependências manualmente.${NC}"
    fi
    
    cd ..
}

# Função para testar configuração
test_configuration() {
    echo -e "${YELLOW}🧪 Testando configuração...${NC}"
    
    # Verificar se as credenciais parecem válidas
    if [[ $MP_PUBLIC_KEY == APP_USR-* ]] && [[ $MP_ACCESS_TOKEN == APP_USR-* ]]; then
        echo -e "${GREEN}✅ Credenciais parecem válidas${NC}"
    else
        echo -e "${RED}⚠️  Credenciais podem estar incorretas${NC}"
    fi
    
    # Verificar se as URLs são HTTPS
    if [[ $FRONTEND_URL == https://* ]] && [[ $BACKEND_URL == https://* ]]; then
        echo -e "${GREEN}✅ URLs usando HTTPS${NC}"
    else
        echo -e "${RED}⚠️  URLs devem usar HTTPS em produção${NC}"
    fi
    
    echo ""
}

# Função para mostrar próximos passos
show_next_steps() {
    echo -e "${BLUE}🎯 Próximos Passos:${NC}"
    echo ""
    echo "1. 🚀 Fazer deploy do backend:"
    echo "   cd backend && npm start"
    echo ""
    echo "2. 🏗️  Fazer build do frontend:"
    echo "   npm run build"
    echo ""
    echo "3. 🌐 Configurar no Mercado Pago:"
    echo "   - URLs de redirecionamento:"
    echo "     • $FRONTEND_URL/payment/success"
    echo "     • $FRONTEND_URL/payment/failure"
    echo "     • $FRONTEND_URL/payment/pending"
    echo "   - URL de notificação:"
    echo "     • $BACKEND_URL/webhook/mercadopago"
    echo ""
    echo "4. 🧪 Testar com pagamento real de R$ 0,01"
    echo ""
    echo -e "${GREEN}📖 Consulte o arquivo PRODUCTION_SETUP.md para mais detalhes!${NC}"
    echo ""
}

# Execução principal
main() {
    clear
    echo "🎨 ======================================"
    echo "🚀 QRCraft Studio - Setup de Produção"  
    echo "🎨 ======================================"
    echo ""
    
    ask_credentials
    create_frontend_env
    create_backend_env
    install_backend_deps
    test_configuration
    show_next_steps
    
    echo -e "${GREEN}🎉 Configuração concluída com sucesso!${NC}"
    echo ""
    echo -e "${BLUE}💡 Dica: Mantenha suas credenciais seguras e nunca as compartilhe!${NC}"
}

# Verificar se o script está sendo executado como root (opcional)
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Não execute este script como root!${NC}"
    exit 1
fi

# Executar função principal
main 