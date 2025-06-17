#!/bin/bash

echo "🚀 Iniciando deploy para Netlify..."

# Limpar cache anterior
echo "🧹 Limpando cache..."
rm -rf node_modules/.cache
rm -rf .vite

# Instalar dependências
echo "📦 Instalando dependências..."
pnpm install --no-frozen-lockfile

# Build do projeto
echo "🔨 Fazendo build..."
pnpm build

# Verificar se o build foi bem-sucedido
if [ -d "dist" ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📁 Arquivos prontos na pasta dist/"
    ls -la dist/
else
    echo "❌ Erro no build - pasta dist não foi criada"
    exit 1
fi

echo "🎉 Processo concluído! Pronto para deploy no Netlify." 