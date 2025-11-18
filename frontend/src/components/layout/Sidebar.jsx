import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  FileText, 
  LogOut,
  Briefcase 
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/invoices', icon: FileText, label: 'Invoices' },
]

export default function Sidebar() {
  const { logout, user } = useAuth()

  return (
    <motion.div 
      className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-20 shadow-xl"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FreelanceFlow</h1>
            <p className="text-xs text-gray-600">Professional CRM</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">Welcome back,</p>
          <p className="text-sm text-primary-600 font-semibold">{user?.name}</p>
        </div>
      </div>
      
      <nav className="px-4 py-6 space-y-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                }`
              }
            >
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
      
      <div className="absolute bottom-6 left-4 right-4">
        <motion.button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={20} className="transition-transform group-hover:scale-110" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </motion.div>
  )
}