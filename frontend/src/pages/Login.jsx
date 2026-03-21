import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, Users, FileText, DollarSign, BarChart2, Zap, Star, X } from 'lucide-react'
import AuthFooter from '../components/ui/AuthFooter'

const features = [
  { icon: Users,      label: 'Client Management',  desc: 'Store contacts, budgets & project types' },
  { icon: BarChart2,  label: 'Project Tracking',    desc: 'Deadlines, deliverables & progress' },
  { icon: DollarSign, label: 'Invoice System',      desc: 'Generate PDFs & email clients instantly' },
  { icon: FileText,   label: 'Meeting Notes',       desc: 'Log notes & next steps per client' },
]

const stats = [
  { value: '100%', label: 'Free to use' },
  { value: '4',    label: 'Core modules' },
  { value: '∞',    label: 'Clients & projects' },
]

function ForgotPasswordModal({ onClose }) {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const { forgotPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <motion.div className="bg-white rounded-2xl w-full max-w-md p-8 relative"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        {!sent ? (
          <>
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-5">
              <Lock size={22} className="text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Forgot your password?</h3>
            <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  placeholder="you@example.com" required />
              </div>
              <button type="submit" disabled={loading}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-5 mx-auto">
              <Mail size={22} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
            <p className="text-gray-500 text-sm mb-2">We sent a password reset link to</p>
            <p className="font-semibold text-gray-800 text-sm mb-6">{email}</p>
            <button onClick={onClose} className="btn-primary py-2 px-6">Done</button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function Login() {
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [loginFailed, setLoginFailed]   = useState(false)
  const [showForgot, setShowForgot]     = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Login successful!')
      setLoginFailed(false)
    } catch (err) {
      toast.error(err.message || 'Login failed')
      setLoginFailed(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row flex-1">

        {/* ── Info panel ── */}
        <motion.div
          className="auth-grid-bg w-full md:w-[52%] px-6 py-8 md:pl-16 md:pr-12 md:py-12 relative overflow-hidden flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f0f6ff] to-transparent pointer-events-none hidden md:block" />
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full w-fit mb-4 md:mb-6">
            <Zap size={13} /> CRM built for freelancers
          </div>
          <div className="flex items-center gap-3 mb-4 md:mb-5">
            <img src="/icon.png" alt="FreelanceFlow" className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-md" />
            <span className="text-2xl md:text-3xl font-bold text-gray-900">FreelanceFlow</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3 md:mb-4">
            Your freelance business,{' '}<span className="text-primary-600">all in one place.</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base mb-5 md:mb-8 max-w-sm leading-relaxed">
            Stop juggling spreadsheets and sticky notes. FreelanceFlow gives you a clean, powerful workspace to manage every part of your freelance career.
          </p>
          <div className="flex gap-6 mb-5 md:mb-10">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-xl md:text-2xl font-extrabold text-primary-600">{value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4 mb-5 md:mb-10">
            {features.map(({ icon: Icon, label, desc }) => (
              <li key={label} className="flex items-start gap-2 md:gap-3">
                <span className="bg-white border border-primary-100 text-primary-600 p-1.5 md:p-2 rounded-lg shadow-sm mt-0.5 shrink-0">
                  <Icon size={14} />
                </span>
                <div>
                  <div className="text-xs md:text-sm font-semibold text-gray-800">{label}</div>
                  <div className="text-xs text-gray-500 hidden md:block">{desc}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="hidden md:block bg-white border border-gray-200 rounded-2xl p-5 shadow-sm max-w-sm">
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-sm text-gray-600 italic leading-relaxed">
              "FreelanceFlow completely changed how I run my business. Invoicing used to take hours — now it's done in minutes."
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">A</div>
              <div>
                <div className="text-xs font-semibold text-gray-800">Alex M.</div>
                <div className="text-xs text-gray-400">Freelance Designer</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Form panel ── */}
        <div className="flex flex-1 items-center justify-center px-6 py-8 md:py-10 bg-white">
          <motion.div className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Welcome back 👋</h3>
            <p className="text-gray-500 text-sm mb-8">Sign in to manage your freelance business</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); setLoginFailed(false) }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 transition-all"
                    placeholder="you@example.com" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => { setPassword(e.target.value); setLoginFailed(false) }}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 transition-all"
                    placeholder="Enter your password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <AnimatePresence>
                  {loginFailed && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-2 text-right">
                      <button type="button" onClick={() => setShowForgot(true)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Forgot your password?
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button type="submit" disabled={loading}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : 'Sign In'}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold">Sign up free</Link>
            </p>
          </motion.div>
        </div>
      </div>
      <AuthFooter />

      <AnimatePresence>
        {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      </AnimatePresence>
    </div>
  )
}
