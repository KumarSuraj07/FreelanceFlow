import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, Users, FileText, DollarSign, BarChart2, Zap, Star } from 'lucide-react'

const features = [
  { icon: Users,      label: 'Client Management',     desc: 'Store contacts, budgets & project types' },
  { icon: BarChart2,  label: 'Project Tracking',       desc: 'Deadlines, deliverables & progress' },
  { icon: DollarSign, label: 'Invoice System',         desc: 'Generate PDFs & email clients instantly' },
  { icon: FileText,   label: 'Meeting Notes',          desc: 'Log notes & next steps per client' },
]

const stats = [
  { value: '100%', label: 'Free to use' },
  { value: '4',    label: 'Core modules' },
  { value: '∞',    label: 'Clients & projects' },
]

export default function Login() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]       = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Login successful!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <motion.div
        className="hidden md:flex flex-col justify-center auth-grid-bg w-[52%] pl-16 pr-12 py-12 relative overflow-hidden"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Gradient fade on right edge */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f0f6ff] to-transparent pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full w-fit mb-6">
          <Zap size={13} />
          CRM built for freelancers
        </div>

        {/* Logo + name */}
        <div className="flex items-center gap-3 mb-5">
          <img src="/icon.png" alt="FreelanceFlow" className="w-12 h-12 rounded-xl shadow-md" />
          <span className="text-3xl font-bold text-gray-900">FreelanceFlow</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          Your freelance business,<br />
          <span className="text-primary-600">all in one place.</span>
        </h2>
        <p className="text-gray-500 text-base mb-8 max-w-sm leading-relaxed">
          Stop juggling spreadsheets and sticky notes. FreelanceFlow gives you a clean, powerful workspace to manage every part of your freelance career.
        </p>

        {/* Stats row */}
        <div className="flex gap-6 mb-10">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-extrabold text-primary-600">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Feature list */}
        <ul className="space-y-4 mb-10">
          {features.map(({ icon: Icon, label, desc }) => (
            <li key={label} className="flex items-start gap-3">
              <span className="bg-white border border-primary-100 text-primary-600 p-2 rounded-lg shadow-sm mt-0.5">
                <Icon size={16} />
              </span>
              <div>
                <div className="text-sm font-semibold text-gray-800">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
            </li>
          ))}
        </ul>

        {/* Testimonial */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm max-w-sm">
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

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 bg-white z-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile header */}
          <div className="flex md:hidden items-center gap-3 mb-8">
            <img src="/icon.png" alt="FreelanceFlow" className="w-10 h-10 rounded-xl shadow" />
            <span className="text-xl font-bold text-gray-900">FreelanceFlow</span>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-1">Welcome back 👋</h3>
          <p className="text-gray-500 text-sm mb-8">Sign in to manage your freelance business</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
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
            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
