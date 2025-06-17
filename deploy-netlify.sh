#!/bin/bash

echo "🚀 Iniciando deploy do QRCraft Studio para Netlify..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se o Netlify CLI está instalado
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}❌ Netlify CLI não encontrado. Instalando...${NC}"
    npm install -g netlify-cli --registry=https://registry.npmjs.org/ --verbose
fi

# Verificar se o pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm não encontrado. Instalando...${NC}"
    npm install -g pnpm@8.15.0 --registry=https://registry.npmjs.org/ --verbose
fi

# Fazer login no Netlify (se necessário)
echo -e "${BLUE}🔐 Verificando autenticação do Netlify...${NC}"
netlify status || netlify login

# Configurar pnpm registry
echo -e "${BLUE}⚙️  Configurando pnpm registry...${NC}"
pnpm config set registry https://registry.npmjs.org/

# Instalar dependências
echo -e "${BLUE}📦 Instalando dependências com pnpm...${NC}"
pnpm install --no-frozen-lockfile

# Fazer build do projeto
echo -e "${BLUE}🏗️  Fazendo build do projeto...${NC}"
pnpm build

# Verificar se o build foi criado
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Pasta 'dist' não encontrada. Build falhou!${NC}"
    exit 1
fi

# Fazer deploy
echo -e "${BLUE}🌐 Fazendo deploy para Netlify...${NC}"
netlify deploy --prod --dir=dist --site=qrcraft-studio

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo -e "${GREEN}🌍 Sua aplicação está disponível em: https://qrcraft-studio.netlify.app${NC}"

# Abrir no navegador (opcional)
read -p "Deseja abrir a aplicação no navegador? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open https://qrcraft-studio.netlify.app
fi 