# 🏭 QRCraft Studio - Guia de Inicialização

## 🚀 Como Iniciar a Aplicação

### Opção 1: Scripts Automáticos (Recomendado)

#### **macOS/Linux:**
```bash
./start.sh
```

#### **Windows:**
```batch
start.bat
```

### Opção 2: Comandos Manuais

1. **Instalar dependências** (apenas na primeira vez):
   ```bash
   npm install
   ```

2. **Iniciar a aplicação**:
   ```bash
   npm run dev
   ```

## 📱 Acesso

- **URL Local**: http://localhost:5173
- A aplicação abrirá automaticamente no seu navegador

## 🛠️ Requisitos

- **Node.js** (versão 16 ou superior)
- **npm** (incluído com Node.js)

## 📋 Comandos Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção

## 🔧 Resolução de Problemas

### Se der erro de dependências:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Se a porta 5173 estiver ocupada:
A aplicação automaticamente tentará a próxima porta disponível (5174, 5175, etc.)

---

**🎯 Pronto! Agora você pode usar o QRCraft Studio para criar QR Codes profissionais!** 