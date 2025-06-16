@echo off
chcp 65001 >nul

echo 🏭 QRCraft Studio - Iniciando aplicação...
echo ================================================

REM Verificar se o Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Por favor, instale o Node.js primeiro.
    echo    https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se o npm está instalado
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm não encontrado. Por favor, instale o npm primeiro.
    pause
    exit /b 1
)

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    npm install
    
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências.
        pause
        exit /b 1
    )
)

echo 🚀 Iniciando QRCraft Studio...
echo 📱 A aplicação será aberta em: http://localhost:5173
echo 🔄 Para parar a aplicação, pressione Ctrl+C
echo ================================================

REM Iniciar o servidor de desenvolvimento
npm run dev

pause 