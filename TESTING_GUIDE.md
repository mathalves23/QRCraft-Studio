# 🧪 Guia de Testes - QRCraft Studio

Este documento descreve a suíte completa de testes implementada no QRCraft Studio, incluindo testes unitários, de integração e end-to-end (E2E).

## 📋 Visão Geral

A aplicação possui uma suíte de testes robusta que garante a qualidade e confiabilidade do código:

- **Testes Unitários**: Testam componentes e funções isoladamente
- **Testes de Integração**: Verificam a interação entre diferentes partes do sistema
- **Testes E2E**: Simulam o comportamento real do usuário na aplicação

## 🛠️ Tecnologias Utilizadas

### Testes Unitários/Integração
- **Vitest**: Framework de testes rápido e moderno
- **React Testing Library**: Biblioteca para testar componentes React
- **Jest DOM**: Matchers customizados para elementos DOM
- **User Event**: Simulação de interações do usuário

### Testes E2E
- **Playwright**: Framework para testes end-to-end
- **Suporte multi-browser**: Chrome, Firefox, Safari, Edge

## 📁 Estrutura dos Testes

```
src/
├── components/
│   └── __tests__/
│       ├── TemplateSelector.test.jsx
│       └── QRCodeTester.test.jsx
├── utils/
│   └── __tests__/
│       └── mercadoPagoConfig.test.js
└── test/
    └── setup.js

tests/
└── e2e/
    ├── homepage.spec.js
    ├── qr-generator.spec.js
    └── user-flow.spec.js
```

## 🎯 Scripts de Teste

### Comandos Principais

```bash
# Executar todos os testes unitários/integração
pnpm test

# Executar testes em modo watch (desenvolvimento)
pnpm test:watch

# Executar testes uma vez (CI/CD)
pnpm test:run

# Interface visual dos testes
pnpm test:ui

# Relatório de cobertura
pnpm test:coverage

# Executar testes E2E
pnpm test:e2e

# Interface visual dos testes E2E
pnpm test:e2e:ui

# Debug dos testes E2E
pnpm test:e2e:debug

# Executar todos os testes (unitários + E2E)
pnpm test:all
```

## 📊 Testes Implementados

### Testes Unitários

#### TemplateSelector Component
- ✅ Renderização de todos os templates disponíveis
- ✅ Seleção de templates (clique)
- ✅ Exibição de campos de configuração específicos
- ✅ Preenchimento de dados de exemplo
- ✅ Validação de templates personalizados

#### QRCodeTester Component
- ✅ Renderização condicional do modal
- ✅ Funcionalidade de fechar modal
- ✅ Aplicação de estilos dark mode
- ✅ Interface de teste de QR Code

#### MercadoPago Configuration
- ✅ Criação de preferências de pagamento
- ✅ Configuração de dados padrão
- ✅ Validação de metadata
- ✅ Integração com API do MercadoPago

### Testes E2E

#### Página Inicial (homepage.spec.js)
- ✅ Carregamento correto da página
- ✅ Navegação para o gerador
- ✅ Responsividade
- ✅ Alternância de tema claro/escuro

#### Gerador de QR Code (qr-generator.spec.js)
- ✅ Geração de QR Code básico
- ✅ Seleção de templates diferentes
- ✅ Preenchimento de dados de exemplo
- ✅ Personalização de cores
- ✅ Download de QR Code
- ✅ Teste de QR Code gerado

#### Fluxo Completo (user-flow.spec.js)
- ✅ Jornada completa do usuário
- ✅ Navegação pelo histórico
- ✅ Acesso a páginas informativas
- ✅ Teste de responsividade
- ✅ Verificação de acessibilidade básica

## 🔧 Configuração

### Vitest (vitest.config.js)
```javascript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

### Playwright (playwright.config.js)
```javascript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
})
```

## 📈 Cobertura de Testes

O relatório de cobertura inclui:
- **Statements**: Linhas de código executadas
- **Branches**: Caminhos condicionais testados
- **Functions**: Funções testadas
- **Lines**: Linhas de código cobertas

## 🚀 Executando os Testes

### Desenvolvimento Local

1. **Instalar dependências**:
   ```bash
   pnpm install
   ```

2. **Executar testes unitários**:
   ```bash
   pnpm test:watch
   ```

3. **Executar testes E2E**:
   ```bash
   # Iniciar servidor de desenvolvimento
   pnpm dev
   
   # Em outro terminal
   pnpm test:e2e
   ```

### CI/CD

```bash
# Pipeline de testes completa
pnpm test:run && pnpm test:e2e
```

## 🔍 Debugging

### Testes Unitários
- Use `pnpm test:ui` para interface visual
- Adicione `console.log` nos testes para debug
- Use `screen.debug()` para ver o DOM renderizado

### Testes E2E
- Use `pnpm test:e2e:debug` para modo debug
- Adicione `await page.pause()` para pausar execução
- Use `--headed` para ver o browser durante os testes

## 📝 Melhores Práticas

### Testes Unitários
- Teste comportamentos, não implementação
- Use mocks para dependências externas
- Mantenha testes independentes
- Nomes descritivos para os testes

### Testes E2E
- Teste fluxos críticos do usuário
- Use seletores estáveis (data-testid)
- Evite dependências entre testes
- Considere diferentes estados da aplicação

## 🔄 Integração Contínua

Os testes são executados automaticamente em:
- Pull Requests
- Push para branch main
- Releases

### GitHub Actions (exemplo)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm test:run
      - run: pnpm test:e2e
```

## 📚 Recursos Adicionais

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## 🤝 Contribuindo

Ao adicionar novos recursos:
1. Escreva testes para novos componentes
2. Mantenha cobertura de testes alta
3. Execute `pnpm test:all` antes de fazer commit
4. Documente casos de teste complexos

---

**Nota**: Esta suíte de testes garante a qualidade e confiabilidade do QRCraft Studio, proporcionando uma experiência consistente para os usuários. 