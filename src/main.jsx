import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './hooks/useAuth.js'
import { ThemeProvider } from './components/theme-provider.jsx'
import { Toaster } from "@/components/ui/toaster"

// Configuração do i18next
import './i18n.js'

// Inicializar serviços de analytics e monitoramento
import './lib/analytics.js'

// Fallback de carregamento para traduções
const loadingMarkup = (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <h2>Loading...</h2>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback={loadingMarkup}>
    <React.StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="qrcraft-ui-theme">
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  </Suspense>,
)
