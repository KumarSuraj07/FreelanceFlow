import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import ThreeBackground from '../ui/ThreeBackground'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 transition-all duration-300">
      <div className="fixed inset-0 grid-pattern opacity-30"></div>
      <ThreeBackground />
      <div className="flex relative z-10">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <motion.main 
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  )
}