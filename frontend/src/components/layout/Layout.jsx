import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import ThreeBackground from '../ui/ThreeBackground'
import { useSettings } from '../../context/SettingsContext'

const CONTENT_OFFSETS = { Compact: 'lg:ml-16', Default: 'lg:ml-64', Wide: 'lg:ml-72' }

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { sidebarStyle } = useSettings()
  const offset = CONTENT_OFFSETS[sidebarStyle] || 'lg:ml-64'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 transition-all duration-300">
      <div className="fixed inset-0 grid-pattern opacity-30"></div>
      <ThreeBackground />
      <div className="flex relative z-10">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={`flex-1 ml-0 ${offset} transition-all duration-300`}>
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <motion.main 
            className="p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className=""
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}