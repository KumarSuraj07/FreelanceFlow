import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Lock, Palette, Save, Eye, EyeOff, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
]

const NOTIF_OPTIONS = [
  { key: 'Invoice paid', desc: 'Get notified when a client pays an invoice' },
  { key: 'Overdue invoices', desc: 'Daily reminders for overdue payments' },
  { key: 'Project deadlines', desc: 'Alerts 24h before project deadlines' },
  { key: 'New client added', desc: 'Confirmation when a new client is created' },
]

// ── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await axios.put('/api/auth/profile', form)
      updateUser(data.user)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {form.name?.charAt(0)?.toUpperCase()}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Full Name', key: 'name', placeholder: 'Your name' },
          { label: 'Email', key: 'email', placeholder: 'you@example.com' },
          { label: 'Phone', key: 'phone', placeholder: '+1 (555) 000-0000' },
          { label: 'Location', key: 'location', placeholder: 'City, Country' },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        ))}
      </div>
      <SaveButton onClick={handleSave} loading={saving} />
    </div>
  )
}

// ── Notifications Tab ────────────────────────────────────────────────────────
function NotificationsTab() {
  const { notifPrefs, setNotifPrefs } = useSettings()

  const toggle = (key) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] }
    setNotifPrefs(updated)
    toast.success(`"${key}" ${updated[key] ? 'enabled' : 'disabled'}`)
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
      <p className="text-sm text-gray-500">Changes are saved automatically.</p>
      {NOTIF_OPTIONS.map(({ key, desc }) => (
        <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
          <div>
            <p className="text-sm font-medium text-gray-900">{key}</p>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
          <button
            onClick={() => toggle(key)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${notifPrefs[key] ? 'bg-primary-600' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${notifPrefs[key] ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [show, setShow] = useState({ current: false, new: false, confirm: false })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (form.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setSaving(true)
    try {
      await axios.put('/api/auth/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      toast.success('Password changed successfully!')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { label: 'Current Password', key: 'currentPassword', showKey: 'current' },
    { label: 'New Password', key: 'newPassword', showKey: 'new' },
    { label: 'Confirm New Password', key: 'confirmPassword', showKey: 'confirm' },
  ]

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
      <div className="space-y-4">
        {fields.map(({ label, key, showKey }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
              <input
                type={show[showKey] ? 'text' : 'password'}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {show[showKey] ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        ))}
      </div>
      <SaveButton onClick={handleSave} loading={saving} />
    </div>
  )
}

// ── Appearance Tab ───────────────────────────────────────────────────────────
function AppearanceTab() {
  const { isDark, toggleDark, sidebarStyle, setSidebarStyle } = useSettings()

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
      <p className="text-sm text-gray-500 -mt-4">Changes apply instantly and are saved automatically.</p>

      {/* Light / Dark mode */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Color Mode</p>
        <div className="flex gap-3">
          <button
            onClick={() => isDark && toggleDark()}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              !isDark
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sun size={16} />
            Light
          </button>
          <button
            onClick={() => !isDark && toggleDark()}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              isDark
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Moon size={16} />
            Dark
          </button>
        </div>
      </div>

      {/* Sidebar style */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Sidebar Style</p>
        <div className="flex gap-3">
          {['Compact', 'Default', 'Wide'].map(s => (
            <button
              key={s}
              onClick={() => { setSidebarStyle(s); toast.success(`Sidebar set to ${s}`) }}
              className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                sidebarStyle === s
                  ? 'border-primary-600 text-primary-600 bg-primary-50 font-medium'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {sidebarStyle === 'Compact' && 'Sidebar shows icons only on desktop.'}
          {sidebarStyle === 'Default' && 'Standard sidebar width with labels.'}
          {sidebarStyle === 'Wide' && 'Wider sidebar with more spacing.'}
        </p>
      </div>
    </div>
  )
}

// ── Shared Save Button ───────────────────────────────────────────────────────
function SaveButton({ onClick, loading }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-60"
    >
      <Save size={15} />
      {loading ? 'Saving...' : 'Save Changes'}
    </motion.button>
  )
}

// ── Main Settings Page ───────────────────────────────────────────────────────
export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="sm:w-48 flex sm:flex-col gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === id ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {activeTab === 'profile'       && <ProfileTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'security'      && <SecurityTab />}
          {activeTab === 'appearance'    && <AppearanceTab />}
        </div>
      </div>
    </motion.div>
  )
}
