import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, Menu, CheckCircle, AlertCircle, DollarSign, Clock, Sun, Moon, User, LogOut, Users, FolderOpen, X, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const TYPE_META = {
  overdue:         { icon: AlertCircle, color: 'text-red-500 bg-red-50' },
  due_soon:        { icon: Clock,       color: 'text-yellow-500 bg-yellow-50' },
  paid:            { icon: DollarSign,  color: 'text-green-500 bg-green-50' },
  deadline:        { icon: Clock,       color: 'text-orange-500 bg-orange-50' },
  project_overdue: { icon: AlertCircle, color: 'text-red-500 bg-red-50' },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { isDark, toggleDark } = useSettings()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifs, setNotifs] = useState([])
  const [readIds, setReadIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('readNotifIds') || '[]')) }
    catch { return new Set() }
  })
  const dropdownRef = useRef(null)
  const userMenuRef = useRef(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [allClients, setAllClients] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const searchRef = useRef(null)

  const fetchNotifs = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/notifications')
      setNotifs(data)
    } catch {}
  }, [])

  // Fetch clients and projects once for search
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const [c, p] = await Promise.all([axios.get('/api/clients'), axios.get('/api/projects')])
        setAllClients(c.data)
        setAllProjects(p.data)
      } catch {}
    }
    fetchSearchData()
  }, [])

  useEffect(() => {
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 60000)
    return () => clearInterval(interval)
  }, [fetchNotifs])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowNotifications(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchResults(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    const q = e.target.value
    setSearchQuery(q)
    if (!q.trim()) { setSearchResults([]); setShowSearchResults(false); return }

    const lower = q.toLowerCase()
    const matchedClients = allClients
      .filter(c => c.name?.toLowerCase().includes(lower) || c.company?.toLowerCase().includes(lower) || c.email?.toLowerCase().includes(lower))
      .slice(0, 4)
      .map(c => ({ type: 'client', id: c._id, title: c.name, subtitle: c.company || c.email, path: `/clients/${c._id}` }))

    const matchedProjects = allProjects
      .filter(p => p.title?.toLowerCase().includes(lower) || p.clientId?.name?.toLowerCase().includes(lower))
      .slice(0, 4)
      .map(p => ({ type: 'project', id: p._id, title: p.title, subtitle: p.clientId?.name || '', path: `/projects` }))

    setSearchResults([...matchedClients, ...matchedProjects])
    setShowSearchResults(true)
  }

  const handleResultClick = (result) => {
    navigate(result.path)
    setSearchQuery('')
    setShowSearchResults(false)
  }

  const unreadCount = notifs.filter(n => !readIds.has(n.id)).length

  const markAllRead = () => {
    const ids = new Set(notifs.map(n => n.id))
    localStorage.setItem('readNotifIds', JSON.stringify([...ids]))
    setReadIds(ids)
  }

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
          
          {/* Search bar */}
          <div className="relative hidden sm:block" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              placeholder="Search clients, projects..."
              className="pl-10 pr-8 py-2.5 w-48 md:w-80 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowSearchResults(false) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}

            <AnimatePresence>
              {showSearchResults && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                >
                  {searchResults.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-400">No results found</div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {searchResults.map(result => (
                        <button
                          key={result.type + result.id}
                          onClick={() => handleResultClick(result)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className={`p-1.5 rounded-lg flex-shrink-0 ${result.type === 'client' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                            {result.type === 'client' ? <Users size={14} /> : <FolderOpen size={14} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                            <p className="text-xs text-gray-500 truncate">{result.subtitle} · {result.type}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
                    {notifs.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <CheckCircle size={28} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-400">All caught up! No alerts right now.</p>
                      </div>
                    ) : notifs.map((n) => {
                      const { icon: Icon, color } = TYPE_META[n.type] || { icon: Bell, color: 'text-gray-500 bg-gray-50' }
                      const unread = !readIds.has(n.id)
                      return (
                        <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${unread ? 'bg-blue-50/40' : ''}`}>
                          <div className={`p-2 rounded-lg ${color} flex-shrink-0`}>
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                            <p className="text-xs text-gray-500">{n.desc}</p>
                          </div>
                          <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">{timeAgo(n.time)}</span>
                        </div>
                      )
                    })}
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

          <div className="relative pl-2 sm:pl-3 border-l border-gray-200" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(prev => !prev)}
              className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-100 rounded-xl px-2 py-1.5 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 flex items-center justify-end space-x-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                  <span>Online</span>
                </p>
              </div>
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { setShowUserMenu(false); navigate('/profile') }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={15} className="text-gray-400" />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => { setShowUserMenu(false); navigate('/settings') }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={15} className="text-gray-400" />
                      <span>Settings</span>
                    </button>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => { setShowUserMenu(false); logout(); navigate('/login') }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
