import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './hooks/useAuth.js'
import { ThemeProvider } from './components/theme-provider.jsx'
import { Toaster } from "@/components/ui/toaster"

// Inicializar serviços de analytics e monitoramento
import './lib/analytics.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="qrcraft-ui-theme">
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
