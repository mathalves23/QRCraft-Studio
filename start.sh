#!/bin/bash

# QRCraft Studio - Script de Inicialização
# Este script inicia a aplicação de forma simples

echo "🏭 QRCraft Studio - Iniciando aplicação..."
echo "================================================"

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    echo "   https://nodejs.org/"
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao instalar dependências."
        exit 1
    fi
fi

echo "🚀 Iniciando QRCraft Studio..."
echo "📱 A aplicação será aberta em: http://localhost:5173"
echo "🔄 Para parar a aplicação, pressione Ctrl+C"
echo "================================================"

# Iniciar o servidor de desenvolvimento
npm run dev 