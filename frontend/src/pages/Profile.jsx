import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Save, Edit2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { auth } from '../utils/firebase'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import PhoneInput from '../components/ui/PhoneInput'
import LocationSelect from '../components/ui/LocationSelect'

// Defined OUTSIDE Profile so it never remounts on re-render
const Field = ({ icon: Icon, label, field, type = 'text', value, onChange, disabled, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-600 ${error ? 'border-red-400' : 'border-gray-200'}`}
      />
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
)

export default function Profile() {
  const { user, updateUser } = useAuth()

  const [editMode, setEditMode]       = useState(false)
  const [profileData, setProfileData] = useState({
    name:     user?.name     || '',
    email:    user?.email    || '',
    phone:    user?.phone    || '',
    location: user?.location || '',
  })
  const [fieldErrors, setFieldErrors]   = useState({})
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPw, setShowPw]             = useState({ current: false, new: false, confirm: false })
  const [saving, setSaving]             = useState(false)
  const [changingPw, setChangingPw]     = useState(false)

  const pwChecks = [
    { label: 'At least 8 characters', ok: passwordData.newPassword.length >= 8 },
    { label: 'Uppercase letter',       ok: /[A-Z]/.test(passwordData.newPassword) },
    { label: 'Lowercase letter',       ok: /[a-z]/.test(passwordData.newPassword) },
    { label: 'Number',                 ok: /\d/.test(passwordData.newPassword) },
    { label: 'Special character',      ok: /[^A-Za-z0-9]/.test(passwordData.newPassword) },
  ]
  const isStrongPw = pwChecks.every(c => c.ok)

  const handleChange = (field, value) => {
    setProfileData(p => ({ ...p, [field]: value }))
    setFieldErrors(fe => ({ ...fe, [field]: '' }))
  }

  const handleProfileSave = async () => {
    setFieldErrors({})
    setSaving(true)
    try {
      const { data } = await axios.put('/api/auth/profile', profileData)
      updateUser(data.user)
      setEditMode(false)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (!isStrongPw) { toast.error('Please use a strong password'); return }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match'); return
    }
    setChangingPw(true)
    try {
      const firebaseUser = auth.currentUser
      const credential = EmailAuthProvider.credential(firebaseUser.email, passwordData.currentPassword)
      await reauthenticateWithCredential(firebaseUser, credential)
      await updatePassword(firebaseUser, passwordData.newPassword)
      toast.success('Password changed successfully')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        toast.error('Current password is incorrect')
      } else {
        toast.error(err.message || 'Failed to change password')
      }
    } finally {
      setChangingPw(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                Active · Freelancer
              </span>
            </div>
          </div>
          <button
            onClick={() => editMode ? handleProfileSave() : setEditMode(true)}
            disabled={saving}
            className="btn-primary flex items-center space-x-2 text-sm"
          >
            {editMode
              ? <><Save size={15} /><span>{saving ? 'Saving…' : 'Save'}</span></>
              : <><Edit2 size={15} /><span>Edit</span></>}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field icon={User}  label="Full Name"      field="name"     value={profileData.name}     onChange={e => handleChange('name', e.target.value)}     disabled={!editMode} error={fieldErrors.name} />
          <Field icon={Mail}  label="Email Address"  field="email"    type="email" value={profileData.email}    onChange={e => handleChange('email', e.target.value)}    disabled={!editMode} error={fieldErrors.email} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <PhoneInput
              value={profileData.phone}
              onChange={val => handleChange('phone', val)}
              error={fieldErrors.phone}
              disabled={!editMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <LocationSelect
              value={profileData.location}
              onChange={val => handleChange('location', val)}
              error={fieldErrors.location}
              disabled={!editMode}
            />
          </div>
        </div>

        {editMode && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => { setEditMode(false); setProfileData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', location: user?.location || '' }) }}
              className="btn-secondary text-sm mr-2">
              Cancel
            </button>
          </div>
        )}
      </motion.div>

      {/* Change Password */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Lock size={18} className="text-primary-600" />
          <span>Change Password</span>
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[
            { label: 'Current Password',      field: 'currentPassword', showKey: 'current' },
            { label: 'New Password',           field: 'newPassword',     showKey: 'new' },
            { label: 'Confirm New Password',   field: 'confirmPassword', showKey: 'confirm' },
          ].map(({ label, field, showKey }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <div className="relative">
                <input
                  type={showPw[showKey] ? 'text' : 'password'}
                  value={passwordData[field]}
                  onChange={e => setPasswordData(p => ({ ...p, [field]: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button type="button" onClick={() => setShowPw(s => ({ ...s, [showKey]: !s[showKey] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw[showKey] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {field === 'newPassword' && passwordData.newPassword && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {pwChecks.map(({ label: cl, ok }) => (
                    <p key={cl} className={`text-xs flex items-center gap-1.5 ${ok ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 ${ok ? 'bg-green-500' : 'bg-gray-300'}`}>{ok ? '✓' : '·'}</span>
                      {cl}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button type="submit" disabled={changingPw} className="btn-primary text-sm">
            {changingPw ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
