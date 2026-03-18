import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, Settings, Menu, CheckCircle, AlertCircle, DollarSign, Clock, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const notifications = [
  { id: 1, icon: DollarSign, color: 'text-green-500 bg-green-50', title: 'Invoice #INV-004 Paid', desc: 'Client Acme Corp paid $2,400', time: '2m ago', unread: true },
  { id: 2, icon: AlertCircle, color: 'text-red-500 bg-red-50', title: 'Invoice Overdue', desc: 'Invoice #INV-002 is 3 days overdue', time: '1h ago', unread: true },
  { id: 3, icon: CheckCircle, color: 'text-blue-500 bg-blue-50', title: 'Project Completed', desc: 'Website Redesign marked as done', time: '3h ago', unread: true },
  { id: 4, icon: Clock, color: 'text-yellow-500 bg-yellow-50', title: 'Deadline Tomorrow', desc: 'Mobile App project due tomorrow', time: '5h ago', unread: false },
  { id: 5, icon: DollarSign, color: 'text-green-500 bg-green-50', title: 'New Invoice Created', desc: 'Invoice #INV-005 created for $1,800', time: '1d ago', unread: false },
]

export default function Header({ onMenuClick }) {
  const { user } = useAuth()
  const { isDark, toggleDark } = useSettings()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifs, setNotifs] = useState(notifications)
  const dropdownRef = useRef(null)

  const unreadCount = notifs.filter(n => n.unread).length

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })))

  return (
    <motion.header 
      className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <motion.button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={20} />
          </motion.button>
          
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2.5 w-48 md:w-80 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <motion.button 
              onClick={() => setShowNotifications(prev => !prev)}
              className="p-2 sm:p-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={18} className="sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-900">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-primary-600 hover:underline">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifs.map(({ id, icon: Icon, color, title, desc, time, unread }) => (
                      <div key={id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${unread ? 'bg-blue-50/40' : ''}`}>
                        <div className={`p-2 rounded-lg ${color} flex-shrink-0`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                          <p className="text-xs text-gray-500 truncate">{desc}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">{time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={toggleDark}
            className="hidden sm:flex p-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <motion.button 
            onClick={() => navigate('/settings')}
            className="hidden sm:flex p-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={20} />
          </motion.button>
          
          <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">Freelancer</p>
            </div>
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}