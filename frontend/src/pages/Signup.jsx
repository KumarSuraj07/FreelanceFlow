import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, Zap, Clock, TrendingUp, Shield, ArrowLeft } from 'lucide-react'
import AuthFooter from '../components/ui/AuthFooter'

const perks = [
  { icon: CheckCircle, text: 'Client & project management' },
  { icon: TrendingUp,  text: 'Track revenue & invoices' },
  { icon: Clock,       text: 'Automated payment reminders' },
  { icon: Shield,      text: 'Secure JWT authentication' },
  { icon: CheckCircle, text: 'PDF invoices via email' },
  { icon: CheckCircle, text: 'Meeting notes & next steps' },
]

const steps = [
  { num: '1', title: 'Create your account',     desc: 'Sign up in under 30 seconds' },
  { num: '2', title: 'Add your first client',   desc: 'Import contacts & project details' },
  { num: '3', title: 'Send your first invoice', desc: 'Generate a PDF and email it directly' },
]

export default function Signup() {
  const [step, setStep]                     = useState(1)
  const [name, setName]                     = useState('')
  const [email, setEmail]                   = useState('')
  const [password, setPassword]             = useState('')
  const [showPassword, setShowPassword]     = useState(false)
  const [otp, setOtp]                       = useState(['', '', '', '', '', ''])
  const [loading, setLoading]               = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const otpRefs     = useRef([])
  const cooldownRef = useRef(null)
  const { signup, sendOtp } = useAuth()

  const pwChecks = [
    { label: 'At least 8 characters',        ok: password.length >= 8 },
    { label: 'Uppercase letter',              ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter',              ok: /[a-z]/.test(password) },
    { label: 'Number',                        ok: /\d/.test(password) },
    { label: 'Special character (!@#$…)',     ok: /[^A-Za-z0-9]/.test(password) },
  ]
  const isStrongPassword = pwChecks.every(c => c.ok)

  const startCooldown = () => {
    setResendCooldown(60)
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!isStrongPassword) { toast.error('Please use a strong password'); return }
    setLoading(true)
    try {
      await sendOtp(name, email, password)
      toast.success('OTP sent to your email!')
      setStep(2)
      startCooldown()
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    if (otpValue.length < 6) { toast.error('Please enter the 6-digit OTP'); return }
    setLoading(true)
    try {
      await signup(email, otpValue)
      toast.success('Account created successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setLoading(true)
    try {
      await sendOtp(name, email, password)
      toast.success('New OTP sent!')
      setOtp(['', '', '', '', '', ''])
      startCooldown()
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP')
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f0f6ff] to-transparent pointer-events-none hidden md:block" />
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full w-fit mb-4 md:mb-6">
            <Zap size={13} />
            Free forever — no credit card needed
          </div>
          <div className="flex items-center gap-3 mb-4 md:mb-5">
            <img src="/icon.png" alt="FreelanceFlow" className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-md" />
            <span className="text-2xl md:text-3xl font-bold text-gray-900">FreelanceFlow</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3 md:mb-4">
            Run your freelance{' '}
            <span className="text-primary-600">business smarter.</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base mb-5 md:mb-8 max-w-sm leading-relaxed">
            Everything you need to manage clients, deliver projects, and get paid — without the chaos of scattered tools.
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 mb-5 md:mb-10">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
                <Icon size={14} className="text-primary-600 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
          <div className="hidden md:block bg-white border border-gray-200 rounded-2xl p-5 shadow-sm max-w-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">How it works</p>
            <ol className="space-y-4">
              {steps.map(({ num, title, desc }) => (
                <li key={num} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{num}</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{title}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        {/* ── Form panel ── */}
        <div className="flex flex-1 items-center justify-center px-6 py-8 md:py-10 bg-white">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">

              {/* Step 1 — Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Create your account 🚀</h3>
                  <p className="text-gray-500 text-sm mb-8">Start managing your freelance business today — it's free</p>

                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" value={name} onChange={e => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 transition-all"
                          placeholder="Your full name" required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 transition-all"
                          placeholder="you@example.com" required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 transition-all"
                          placeholder="Create a password" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {password && (
                        <div className="mt-2 grid grid-cols-2 gap-1">
                          {pwChecks.map(({ label, ok }) => (
                            <p key={label} className={`text-xs flex items-center gap-1.5 ${ok ? 'text-green-600' : 'text-gray-400'}`}>
                              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 ${ok ? 'bg-green-500' : 'bg-gray-300'}`}>{ok ? '✓' : '·'}</span>
                              {label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    <motion.button type="submit" disabled={loading}
                      className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending OTP...</span>
                        </div>
                      ) : 'Send Verification Code'}
                    </motion.button>
                  </form>

                  <p className="mt-6 text-center text-gray-500 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
                  </p>
                </motion.div>
              )}

              {/* Step 2 — OTP */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
                    <ArrowLeft size={16} /> Back
                  </button>

                  <div className="flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-5">
                    <Mail size={26} className="text-primary-600" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Check your email</h3>
                  <p className="text-gray-500 text-sm mb-2">We sent a 6-digit code to</p>
                  <p className="font-semibold text-gray-800 text-sm mb-8">{email}</p>

                  <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Enter verification code</label>
                      <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            ref={el => otpRefs.current[i] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleOtpChange(i, e.target.value)}
                            onKeyDown={e => handleOtpKeyDown(i, e)}
                            className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                          />
                        ))}
                      </div>
                    </div>

                    <motion.button type="submit" disabled={loading || otp.join('').length < 6}
                      className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </div>
                      ) : 'Verify & Create Account'}
                    </motion.button>
                  </form>

                  <p className="mt-5 text-center text-sm text-gray-500">
                    Didn't receive it?{' '}
                    {resendCooldown > 0 ? (
                      <span className="text-gray-400">Resend in {resendCooldown}s</span>
                    ) : (
                      <button onClick={handleResend} disabled={loading}
                        className="text-primary-600 hover:text-primary-700 font-semibold disabled:opacity-50">
                        Resend code
                      </button>
                    )}
                  </p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  )
}
