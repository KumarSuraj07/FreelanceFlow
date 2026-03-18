import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'
import { Toaster } from 'react-hot-toast'

// Dev: Vite proxy forwards /api → localhost:5000
// Prod: Vercel frontend calls Render backend via VITE_API_URL
if (import.meta.env.PROD) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <App />
        <Toaster position="top-right" />
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>,
)