import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Lock, Palette, Save, Eye, EyeOff, Sun, Moon, Briefcase } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import PhoneInput from '../components/ui/PhoneInput'
import LocationSelect from '../components/ui/LocationSelect'
import axios from 'axios'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'business', label: 'Business', icon: Briefcase },
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
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', location: user.location || '' })
  }, [user])

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <PhoneInput
            value={form.phone}
            onChange={val => setForm(f => ({ ...f, phone: val }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <LocationSelect
            value={form.location}
            onChange={val => setForm(f => ({ ...f, location: val }))}
          />
        </div>
      </div>
      <SaveButton onClick={handleSave} loading={saving} />
    </div>
  )
}

// ── Business Tab ─────────────────────────────────────────────────────────────
function BusinessTab() {
  const { businessSettings, setBusinessSettings } = useSettings()
  const [form, setForm] = useState({
    businessName: businessSettings?.businessName || '',
    website: businessSettings?.website || '',
    currency: businessSettings?.currency || 'USD',
    taxRate: businessSettings?.taxRate || '0',
    invoicePrefix: businessSettings?.invoicePrefix || 'INV',
  })

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'SGD']

  const handleSave = () => {
    setBusinessSettings(form)
    toast.success('Business settings saved!')
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Business Settings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Business Name', key: 'businessName', placeholder: 'Your business name' },
          { label: 'Website', key: 'website', placeholder: 'https://yoursite.com' },
          { label: 'Invoice Prefix', key: 'invoicePrefix', placeholder: 'INV' },
          { label: 'Tax Rate (%)', key: 'taxRate', placeholder: '0', type: 'number' },
        ].map(({ label, key, placeholder, type }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type || 'text'}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select
            value={form.currency}
            onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <SaveButton onClick={handleSave} />
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

  const checks = [
    { label: 'At least 8 characters', ok: form.newPassword.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(form.newPassword) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(form.newPassword) },
    { label: 'Number', ok: /\d/.test(form.newPassword) },
    { label: 'Special character (!@#$…)', ok: /[^A-Za-z0-9]/.test(form.newPassword) },
  ]
  const isStrong = checks.every(c => c.ok)

  const handleSave = async () => {
    if (!isStrong) { toast.error('Please use a strong password'); return }
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match')
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
            {key === 'newPassword' && form.newPassword && (
              <div className="mt-2 space-y-1">
                {checks.map(({ label: cl, ok }) => (
                  <p key={cl} className={`text-xs flex items-center gap-1.5 ${ok ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${ok ? 'bg-green-500' : 'bg-gray-300'}`}>{ok ? '✓' : '·'}</span>
                    {cl}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <SaveButton onClick={handleSave} loading={saving} />
    </div>
  )
}

// ── Appearance Tab ───────────────────────────────────────────────────────────
function AppearanceTab() {
  const { isDark, toggleDark } = useSettings()

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
          {activeTab === 'business'      && <BusinessTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'security'      && <SecurityTab />}
          {activeTab === 'appearance'    && <AppearanceTab />}
        </div>
      </div>
    </motion.div>
  )
}
