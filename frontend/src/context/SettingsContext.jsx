import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used within a SettingsProvider')
  return context
}

const THEME_COLORS = {
  blue:   { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
  purple: { 50: '#f5f3ff', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9' },
  green:  { 50: '#f0fdf4', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
  orange: { 50: '#fff7ed', 500: '#f97316', 600: '#ea580c', 700: '#c2410c' },
  pink:   { 50: '#fdf2f8', 500: '#ec4899', 600: '#db2777', 700: '#be185d' },
}

const DEFAULT_NOTIF_PREFS = {
  'Invoice paid': true,
  'Overdue invoices': true,
  'Project deadlines': true,
  'New client added': true,
}

const DEFAULT_BUSINESS = { businessName: '', website: '', currency: 'USD', taxRate: '0', invoicePrefix: 'INV' }

function applyThemeColor(colorName) {
  const colors = THEME_COLORS[colorName]
  if (!colors) return
  const root = document.documentElement
  root.style.setProperty('--color-primary-50',  colors[50])
  root.style.setProperty('--color-primary-500', colors[500])
  root.style.setProperty('--color-primary-600', colors[600])
  root.style.setProperty('--color-primary-700', colors[700])
}

// Apply immediately on module load — before first render — so no blue flash
applyThemeColor(localStorage.getItem('themeColor') || 'green')

export const SettingsProvider = ({ children }) => {
  const [themeColor, setThemeColorState] = useState(() => localStorage.getItem('themeColor') || 'green')
  const [sidebarStyle, setSidebarStyleState] = useState(() => localStorage.getItem('sidebarStyle') || 'Default')
  const [isDark, setIsDarkState] = useState(() => localStorage.getItem('darkMode') === 'true')
  const [notifPrefs, setNotifPrefsState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('notifPrefs')) || DEFAULT_NOTIF_PREFS }
    catch { return DEFAULT_NOTIF_PREFS }
  })

  const [businessSettings, setBusinessSettingsState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('businessSettings')) || DEFAULT_BUSINESS }
    catch { return DEFAULT_BUSINESS }
  })

  useEffect(() => { applyThemeColor(themeColor) }, [themeColor])

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [isDark])

  const setThemeColor = (color) => {
    localStorage.setItem('themeColor', color)
    setThemeColorState(color)
  }

  const setSidebarStyle = (style) => {
    localStorage.setItem('sidebarStyle', style)
    setSidebarStyleState(style)
  }

  const setNotifPrefs = (prefs) => {
    localStorage.setItem('notifPrefs', JSON.stringify(prefs))
    setNotifPrefsState(prefs)
  }

  const setBusinessSettings = (settings) => {
    localStorage.setItem('businessSettings', JSON.stringify(settings))
    setBusinessSettingsState(settings)
  }

  const toggleDark = () => {
    const next = !isDark
    localStorage.setItem('darkMode', String(next))
    setIsDarkState(next)
  }

  return (
    <SettingsContext.Provider value={{ themeColor, setThemeColor, sidebarStyle, setSidebarStyle, notifPrefs, setNotifPrefs, businessSettings, setBusinessSettings, THEME_COLORS, isDark, toggleDark }}>
      {children}
    </SettingsContext.Provider>
  )
}
