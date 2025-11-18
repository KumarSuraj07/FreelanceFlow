import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  FileText, 
  LogOut,
  Briefcase,
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/invoices', icon: FileText, label: 'Invoices' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth()
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <div 
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
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
      
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">FreelanceFlow</h1>
            <p className="text-xs text-gray-600">Professional CRM</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">Welcome back,</p>
          <p className="text-sm text-primary-600 font-semibold truncate">{user?.name}</p>
        </div>
      </div>
      
      <nav className="px-4 py-6 space-y-2 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => {
              if (!isDesktop && onClose) {
                setTimeout(() => {
                  onClose()
                }, 100)
              }
            }}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
              }`
            }
          >
            <item.icon size={20} className="transition-transform group-hover:scale-110 flex-shrink-0" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <LogOut size={20} className="transition-transform group-hover:scale-110 flex-shrink-0" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
      </div>
    </>
  )
}