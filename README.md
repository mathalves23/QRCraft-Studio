# 🚀 QRCraft Studio

> **Gerador de QR Codes profissional com design personalizável e funcionalidades avançadas**

QRCraft Studio é uma aplicação web moderna para criação, personalização e gerenciamento de QR Codes. Desenvolvida com React e tecnologias de ponta, oferece uma experiência profissional para usuários individuais e empresas.

[![Deploy](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://app.netlify.com/projects/qrcraft-studio)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)

## ✨ Funcionalidades Principais

### 🎨 **Geração de QR Codes**
- **Templates Prontos**: WiFi, vCard, SMS, Email, URL, Redes Sociais
- **Personalização Completa**: Cores, tamanhos, estilos e logotipos
- **Preview em Tempo Real**: Visualização instantânea das alterações
- **Múltiplos Formatos**: Exportação em PNG, JPG, SVG e PDF

### 🔗 **Encurtador de URLs**
- **APIs Reais**: Integração com is.gd, v.gd e TinyURL
- **Aliases Personalizados**: Crie URLs memoráveis
- **Histórico Completo**: Gerencie todas as URLs encurtadas
- **Integração QR**: Gere QR Codes das URLs automaticamente

### 👤 **Sistema de Usuários**
- **Autenticação Segura**: Login e registro com validação
- **Planos Flexíveis**: Standard (10 QR/mês) e PRO (ilimitado)
- **Gerenciamento de Perfil**: Edição de dados pessoais
- **Analytics**: Histórico de criações e estatísticas

### 📱 **Scanner de QR Codes**
- **Câmera Integrada**: Leitura em tempo real
- **Upload de Arquivo**: Escaneie imagens salvas
- **Histórico de Leituras**: Mantenha registro dos códigos escaneados
- **Detecção Automática**: Identificação inteligente do tipo de conteúdo

### 🔔 **Centro de Notificações**
- **Notificações em Tempo Real**: Atualizações instantâneas
- **Alertas de Limite**: Avisos sobre uso dos planos
- **Promoções**: Ofertas especiais e novidades

## 🛠️ Tecnologias

### **Frontend**
- **React 19** - Interface moderna e reativa
- **Vite** - Build tool ultrarrápido com HMR
- **CSS3** - Estilização responsiva e animações
- **JavaScript ES6+** - Código moderno e otimizado

### **Mobile (Capacitor)**
- **iOS & Android** - Aplicativo nativo híbrido
- **Camera Plugin** - Acesso à câmera para scanner
- **Status Bar** - Integração com SO
- **Splash Screen** - Tela de carregamento

### **Bibliotecas Principais**
- **qrcode** - Geração de QR Codes
- **jsqr** - Leitura e decodificação
- **react-color-palette** - Seletor de cores
- **lucide-react** - Ícones modernos

## 🚀 Início Rápido

### **Pré-requisitos**
- Node.js 18+ 
- pnpm (recomendado)

### **Instalação**

```bash
# Clone o repositório
git clone https://github.com/mathalves23/QRCraft-Studio.git

# Entre no diretório
cd QRCraft-Studio

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`

### **Mobile Development**

```bash
# Sincronizar com plataformas móveis
pnpm sync

# iOS (requer Xcode no macOS)
pnpm ios

# Android (requer Android Studio)
pnpm android
```

## 📦 Build e Deploy

### **Web**
```bash
# Build para produção
pnpm build

# Preview do build
pnpm preview
```

### **Mobile**
```bash
# Build para todas as plataformas
pnpm build:mobile

# iOS específico
pnpm build:ios

# Android específico
pnpm build:android
```

## 🏗️ Estrutura do Projeto

```
QRCraft-Studio/
├── src/
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas da aplicação
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utilitários e helpers
│   ├── data/              # Dados estáticos
│   └── styles/            # Estilos globais
├── public/                # Arquivos públicos
├── android/               # Projeto Android (Capacitor)
├── ios/                   # Projeto iOS (Capacitor)
├── dist/                  # Build de produção
└── netlify/               # Configurações Netlify
```

## 🎯 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build para produção |
| `pnpm preview` | Preview do build |
| `pnpm sync` | Sincronizar Capacitor |
| `pnpm ios` | Executar no iOS |
| `pnpm android` | Executar no Android |
| `pnpm lint` | Verificar código |

## 🌟 Funcionalidades em Destaque

### **QR Code Personalizável**
- 🎨 Cores customizáveis (foreground/background)
- 📏 Tamanhos variáveis (100px - 1000px)
- 🔧 Níveis de correção de erro
- 📱 Preview responsivo

### **Templates Profissionais**
- 📧 **Email**: Assunto e corpo pré-definidos
- 📱 **SMS**: Número e mensagem
- 📍 **Localização**: Coordenadas GPS
- 🌐 **WiFi**: SSID, senha e tipo de segurança
- 👤 **vCard**: Cartão de visita digital completo

### **Encurtador Avançado**
- 🔗 **Múltiplas APIs**: is.gd, v.gd, TinyURL
- 🏠 **Sistema Local**: Fallback interno
- ✏️ **Aliases**: URLs personalizadas
- 📊 **Analytics**: Estatísticas de cliques
- 🔄 **Histórico**: Gerenciamento completo

## 📱 Aplicativo Mobile

O QRCraft Studio está disponível como aplicativo móvel para iOS e Android, oferecendo:

- **Scanner QR** com câmera nativa
- **Todas as funcionalidades web** adaptadas para mobile
- **Offline First** com sincronização automática
- **Interface otimizada** para touch
- **Notificações push** (futuro)

## 🚀 Deploy

### **Netlify (Recomendado)**
O projeto está configurado para deploy automático no Netlify:

1. Conecte seu repositório ao Netlify
2. Configure o build command: `pnpm install --no-frozen-lockfile && pnpm build`
3. Set publish directory: `dist`
4. Deploy automático a cada push

### **Outras Plataformas**
- **Vercel**: Suporte nativo para Vite
- **GitHub Pages**: Configure GitHub Actions
- **Firebase Hosting**: `firebase deploy`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Roadmap

- [ ] 🔔 Sistema de notificações push (mobile)
- [ ] 💳 Integração de pagamentos
- [ ] 📊 Analytics avançados
- [ ] 🎨 Editor de logotipos
- [ ] 🔗 API pública
- [ ] 🌍 Internacionalização
- [ ] 📈 Dashboard administrativo

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- 📧 **Email**: support@qrcraft.studio
- 🐛 **Issues**: [GitHub Issues](https://github.com/mathalves23/QRCraft-Studio/issues)
- 📖 **Documentação**: [Wiki do Projeto](https://github.com/mathalves23/QRCraft-Studio/wiki)

---

<div align="center">
  <p>Feito com ❤️ para a comunidade</p>
  <p>⭐ Se este projeto foi útil para você, considere dar uma estrela!</p>
</div>

