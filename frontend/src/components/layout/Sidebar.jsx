import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  FileText, 
  X,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import axios from 'axios'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/invoices', icon: FileText, label: 'Invoices' },
]

const SIDEBAR_WIDTHS = { Compact: 'w-16', Default: 'w-64', Wide: 'w-72' }

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const { sidebarStyle } = useSettings()
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  const isCompact = sidebarStyle === 'Compact'
  const sidebarW = SIDEBAR_WIDTHS[sidebarStyle] || 'w-64'

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [stats, setStats] = useState({ clients: 0, projects: 0, invoices: 0 })

  useEffect(() => {
    axios.all([
      axios.get('/api/clients'),
      axios.get('/api/projects'),
      axios.get('/api/invoices'),
    ]).then(([c, p, i]) => setStats({ clients: c.data.length, projects: p.data.length, invoices: i.data.length }))
    .catch(() => {})
  }, [])

  return (
    <>
      <div 
        className={`fixed left-0 top-0 h-full ${sidebarW} bg-white border-r border-gray-200 z-50 shadow-xl transform transition-all duration-300 ease-in-out flex flex-col ${
          isDesktop ? 'translate-x-0' : (isOpen ? 'translate-x-0' : '-translate-x-full')
        }`}
      >
      {/* Mobile close button */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg z-10"
      >
        <X size={20} />
      </button>
      
      <div className={`px-1 mb-3 ${isCompact ? 'sm:px-1' : 'sm:px-2'} border-b border-gray-200`}>
        <div className={`flex items-center ${isCompact ? 'justify-center' : 'space-x-3'}`}>
          <img src="/logo.png" alt="FreelanceFlow" className={`object-contain ${isCompact ? 'h-10' : 'h-29'}`} />
        </div>
        {!isCompact && (
          <div className="mt-0 mb-3 p-2 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Welcome back,</p>
            <p className="text-sm text-primary-600 font-semibold truncate">{user?.name}</p>
          </div>
        )}
      </div>
      
      <nav className="px-2 py-1 space-y-1 overflow-y-auto flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => { if (!isDesktop && onClose) setTimeout(onClose, 100) }}
            title={isCompact ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center ${isCompact ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-xl mb-1 transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
              }`
            }
          >
            <item.icon size={20} className="transition-transform group-hover:scale-110 flex-shrink-0" />
            {!isCompact && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      
      {/* Bottom stats + branding */}
      <div className="p-3 border-t border-gray-200 mt-auto">
        {!isCompact ? (
          <>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Quick Stats</p>
            <div className="space-y-1">
              {[
                { label: 'Clients', value: stats.clients, color: 'text-blue-600 bg-blue-50' },
                { label: 'Projects', value: stats.projects, color: 'text-green-600 bg-green-50' },
                { label: 'Invoices', value: stats.invoices, color: 'text-purple-600 bg-purple-50' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-xs text-gray-600">{label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center space-x-2 px-1">
              <div className="w-6 h-6 bg-gradient-to-r from-primary-600 to-primary-700 rounded-md flex items-center justify-center flex-shrink-0">
                <TrendingUp size={12} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700">FreelanceFlow</p>
                <p className="text-[10px] text-gray-400">v1.0 · All systems go</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            {[
              { value: stats.clients, color: 'text-blue-600 bg-blue-50', title: 'Clients' },
              { value: stats.projects, color: 'text-green-600 bg-green-50', title: 'Projects' },
              { value: stats.invoices, color: 'text-purple-600 bg-purple-50', title: 'Invoices' },
            ].map(({ value, color, title }) => (
              <span key={title} title={title} className={`text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full ${color}`}>{value}</span>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  )
}