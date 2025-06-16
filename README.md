# 🚀 QRCraft Studio 2025

**Ferramenta profissional para criar QR Codes personalizados com design único e qualidade superior**

Uma aplicação completa para geração, personalização e gerenciamento de QR Codes, disponível para web, iOS e Android.

## ✨ Funcionalidades

### 🎨 **Criação Avançada de QR Codes**
- **Templates profissionais**: WiFi, vCard, SMS, Email, Localização, URL, Redes Sociais
- **Personalização completa**: Cores, tamanhos, estilos
- **Preview em tempo real**
- **Múltiplos formatos**: PNG, JPG, SVG, PDF

### 👤 **Sistema de Usuários**
- **Autenticação completa**: Login, registro, perfil
- **Planos flexíveis**: Standard (10 QR/mês) e PRO (ilimitado)
- **Gerenciamento de perfil**: Edição de nome e senha
- **Analytics pessoais**: Histórico e estatísticas

### 🔔 **Centro de Notificações**
- **Notificações em tempo real**
- **Promoções e ofertas**
- **Informações do sistema**
- **Alertas de limite de uso**

### 📱 **Funcionalidades Premium**
- **Scanner de QR Code** (câmera integrada)
- **Geração em lote**
- **Encurtador de URL**
- **Templates avançados**
- **Análises detalhadas**

### 🔗 **NOVO: Encurtador de Links**
- **🌐 APIs Reais**: Integração com is.gd, v.gd e TinyURL (URLs funcionais)
- **🏠 Sistema Local**: URLs funcionais dentro da aplicação (para teste)
- **🎯 Encurtamento Inteligente**: Transforme links longos em URLs elegantes
- **🔧 Múltiplos Serviços**: Escolha entre diferentes APIs de encurtamento
- **✏️ Alias Personalizados**: Crie aliases únicos para suas URLs
- **📊 Histórico Completo**: Gerencie todas as suas URLs encurtadas
- **📈 Estatísticas em Tempo Real**: Monitore cliques e performance
- **🔗 Integração com QR Codes**: Gere QR codes automaticamente
- **📱 Sistema Híbrido**: APIs reais + fallback local
- **Limites por Plano**:
  - **Standard**: 10 URLs encurtadas + APIs básicas
  - **PRO**: URLs ilimitadas + todos os serviços

#### Como Usar o Encurtador
1. **Faça Login**: Necessário para acessar o encurtador
2. **Clique em "🔗 Encurtar URL"** na barra de ferramentas
3. **Escolha o Modo**: ✨ APIs Reais (funcionais) ou 🏠 Sistema Local (teste)
4. **Insira a URL**: Cole o link que deseja encurtar
5. **Escolha o Serviço**: Selecione is.gd, v.gd, TinyURL ou sistema local
6. **Alias Opcional**: Defina um alias personalizado (opcional)
7. **Encurte**: Clique para gerar a URL curta
8. **Teste**: Use o botão "🔗 Testar" para verificar se funciona
9. **Gerencie**: Acesse o histórico para copiar, gerar QR codes ou deletar URLs

#### Recursos Avançados
- **🌐 URLs Reais Funcionais**: APIs reais com is.gd, v.gd e TinyURL
- **🏠 Sistema Local**: URLs que funcionam dentro da aplicação
- **🔄 Fallback Automático**: Se API real falhar, usa sistema local
- **👁️ Preview em Tempo Real**: Veja como ficará sua URL antes de encurtar
- **✅ Validação Automática**: Sistema verifica se a URL é válida
- **🔍 Detecção de Duplicatas**: Evita alias duplicados
- **📋 Botão de Cópia Rápida**: Copie URLs com um clique
- **🔗 Botão de Teste**: Teste se a URL funciona antes de usar
- **📱 Geração de QR Code**: Transforme URLs encurtadas em QR codes
- **📊 Indicadores Visuais**: Badges "REAL" vs "LOCAL" para identificar o tipo

## 🛠️ Tecnologias

### **Frontend**
- **React 19** - Interface moderna e reativa
- **Vite** - Build tool ultrarrápido
- **CSS-in-JS** - Estilização dinâmica
- **Responsive Design** - Otimizado para todos os dispositivos

### **Mobile**
- **Capacitor** - Framework híbrido para iOS/Android
- **Camera Plugin** - Scanner de QR Code nativo
- **Status Bar** - Integração com sistema operacional
- **Splash Screen** - Tela de carregamento personalizada

### **Bibliotecas Principais**
- **qrcode** - Geração de QR Codes
- **jsqr** - Leitura de QR Codes
- **react-color-palette** - Seletor de cores
- **lucide-react** - Ícones modernos

## 🚀 Início Rápido

### **Desenvolvimento Web**

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Aplicação estará disponível em http://localhost:3000
```

### **Desenvolvimento Mobile**

```bash
# Instalar dependências
npm install

# Sincronizar com plataformas móveis
npm run sync

# Executar no iOS (requer Xcode)
npm run ios

# Executar no Android (requer Android Studio)
npm run android

# Teste com live reload
npm run test:mobile
```

## 📦 Build e Deploy

### **🌐 Deploy Web**

```bash
# Build para produção
npm run build

# Build otimizado para web
npm run deploy:web

# Os arquivos estarão em /dist
```

**Hospedagem recomendada:**
- **Vercel** - Deploy automático com GitHub
- **Netlify** - CDN global e domínio gratuito
- **Firebase Hosting** - Integração com Google Services

### **📱 Deploy Mobile**

```bash
# Build completo para todas as plataformas
npm run deploy:stores

# Build específico para iOS
npm run ios:build

# Build específico para Android
npm run android:build
```

### **🍎 App Store (iOS)**

1. **Preparação**:
   ```bash
   npm run ios:build
   cd ios/App
   open App.xcworkspace
   ```

2. **Configuração no Xcode**:
   - Bundle Identifier: `com.qrcraft.studio`
   - Versão: `1.0.0`
   - Certificados de desenvolvedor
   - Provisioning Profiles

3. **Submissão**:
   - Archive do projeto
   - Upload via Xcode Organizer
   - App Store Connect review

### **🤖 Google Play (Android)**

1. **Preparação**:
   ```bash
   npm run android:build
   cd android
   ./gradlew bundleRelease
   ```

2. **Configuração**:
   - Keystore de assinatura
   - Bundle ID: `com.qrcraft.studio`
   - Versão: `1.0.0`

3. **Upload**:
   - Google Play Console
   - Upload do AAB file
   - Preenchimento dos metadados

## 🔧 Configuração

### **Variáveis de Ambiente**

Crie um arquivo `.env.local`:

```env
VITE_APP_NAME=QRCraft Studio
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.qrcraft.studio
VITE_ANALYTICS_ID=your_analytics_id
```

### **Capacitor Config**

O arquivo `capacitor.config.ts` está configurado com:
- **App ID**: `com.qrcraft.studio`
- **Plugins**: Camera, Notifications, Status Bar
- **Cores**: Theme azul (#3b82f6)
- **Splash Screen**: 2 segundos

## 📱 Recursos Móveis

### **Permissions**
- **Camera**: Scanner de QR Code
- **Storage**: Salvar QR Codes
- **Network**: Sincronização online

### **Plugins Nativos**
- **@capacitor/camera**: Scanner QR
- **@capacitor/splash-screen**: Tela inicial
- **@capacitor/status-bar**: Barra de status
- **@capacitor/keyboard**: Teclado responsivo

## 🎨 Design System

### **Cores Principais**
- **Primary**: #3b82f6 (Azul)
- **Success**: #10b981 (Verde)
- **Warning**: #f59e0b (Amarelo)
- **Error**: #ef4444 (Vermelho)

### **Tipografia**
- **Font Stack**: System fonts nativos
- **Tamanhos**: 0.75rem - 3.5rem
- **Pesos**: 400, 500, 600, 700

### **Responsividade**
- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+
- **Large**: 1280px+

## 📊 Analytics e Monitoramento

### **Métricas Principais**
- QR Codes gerados
- Downloads realizados
- Usuários ativos
- Conversões PRO

### **Performance**
- Lighthouse Score: 95+
- First Contentful Paint: <1.5s
- Core Web Vitals: Excellent

## 🔒 Segurança

### **Autenticação**
- Senhas criptografadas
- Sessões seguras
- Proteção CSRF

### **Dados**
- Local Storage para cache
- Não coletamos dados pessoais
- LGPD compliant

## 🚀 Roadmap 2025

### **Q1 2025**
- [ ] Push notifications
- [ ] Sincronização em nuvem
- [ ] Templates colaborativos
- [ ] API pública

### **Q2 2025**
- [ ] Integração com redes sociais
- [ ] QR Codes dinâmicos
- [ ] Analytics avançados
- [ ] Whitelabel solutions

### **Q3 2025**
- [ ] IA para design automático
- [ ] Blockchain integration
- [ ] Multi-idiomas
- [ ] Partnerships

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

- **Email**: suporte@qrcraft.studio
- **Website**: https://qrcraft.studio
- **Discord**: QRCraft Community
- **GitHub Issues**: Bug reports e feature requests

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🎉 Agradecimentos

- **React Team** - Framework incrível
- **Capacitor Team** - Solução mobile fantástica
- **QR Code Libraries** - qrcode e jsqr
- **Open Source Community** - Inspiração constante

---

**© 2025 QRCraft Studio - Craft Your Perfect QR Code** 🚀

*Desenvolvido com ❤️ para criar a melhor experiência de QR Codes do mundo.*

# 🎨 QRCraft Studio

**Ferramenta profissional para criar QR Codes personalizados com design único e qualidade superior**

## 🚀 Deploy Online - Opções Disponíveis

### 1. 📡 **Vercel (Recomendado - Gratuito)**

```bash
# 1. Instalar CLI da Vercel
npm i -g vercel

# 2. Fazer login na Vercel
vercel login

# 3. Deploy automático
vercel --prod
```

**Vantagens:**
- ✅ Deploy automático
- ✅ SSL gratuito
- ✅ CDN global
- ✅ Domínio personalizado
- ✅ Perfect para React/Vite

### 2. 🌐 **Netlify (Alternativa Gratuita)**

```bash
# 1. Instalar CLI do Netlify
npm i -g netlify-cli

# 2. Fazer login
netlify login

# 3. Deploy
netlify deploy --prod --dir=dist
```

### 3. 📦 **GitHub Pages**

```bash
# 1. Instalar gh-pages
npm i -D gh-pages

# 2. Adicionar scripts no package.json:
"homepage": "https://seuusuario.github.io/qrcraft-studio",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# 3. Deploy
npm run deploy
```

### 4. 🔥 **Firebase Hosting**

```bash
# 1. Instalar Firebase CLI
npm i -g firebase-tools

# 2. Login e configurar
firebase login
firebase init hosting

# 3. Deploy
firebase deploy
```

### 5. 🚂 **Railway (Gratuito)**

```bash
# 1. Instalar CLI
npm i -g @railway/cli

# 2. Login e deploy
railway login
railway up
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Desenvolvimento local
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `./start.sh` - Iniciar aplicação (Mac/Linux)
- `start.bat` - Iniciar aplicação (Windows)

## 📱 Acesso Local

- **Desenvolvimento:** http://localhost:3011
- **Preview:** http://localhost:4173

## 🌟 Recursos

- ✨ Geração de QR Codes personalizados
- 🎨 Design moderno e responsivo
- 📱 PWA (Progressive Web App)
- 🔐 Sistema de autenticação
- 👑 Planos Standard e PRO
- 📊 Analytics e histórico
- 🔄 Geração em lote (PRO)
- 📷 Scanner QR Code
- 🔗 Encurtador de URL
- 💾 Múltiplos formatos (PNG, SVG, PDF)

## 📧 Contas de Teste

### Conta PRO Demo:
- **Email:** `demo@qrcraft.com`
- **Senha:** `demo123`

### Conta Admin:
- **Email:** `admin@qrcraft.com`
- **Senha:** `admin123`

## 🔧 Tecnologias

- ⚛️ React 18
- ⚡ Vite
- 🎨 CSS3 + Animations
- 📱 Responsive Design
- 🔄 Service Worker
- 📦 QRCode.js

---

**Criado com ❤️ por QRCraft Studio**

