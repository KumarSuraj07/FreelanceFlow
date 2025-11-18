import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, FolderOpen, FileText, DollarSign } from 'lucide-react'
import axios from 'axios'

const StatCard = ({ title, value, icon: Icon, color }) => (
  <motion.div 
    className="card"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </motion.div>
)

export default function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    projects: 0,
    invoices: 0,
    revenue: 0
  })
  const [recentInvoices, setRecentInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [clientsRes, projectsRes, invoicesRes] = await Promise.all([
          axios.get('/api/clients'),
          axios.get('/api/projects'),
          axios.get('/api/invoices')
        ])

        const clients = clientsRes.data
        const projects = projectsRes.data
        const invoices = invoicesRes.data

        const revenue = invoices
          .filter(inv => inv.status === 'Paid')
          .reduce((sum, inv) => sum + inv.total, 0)

        setStats({
          clients: clients.length,
          projects: projects.length,
          invoices: invoices.length,
          revenue
        })

        setRecentInvoices(invoices.slice(0, 5))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Welcome back! Here's what's happening with your business.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Clients"
          value={stats.clients}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Projects"
          value={stats.projects}
          icon={FolderOpen}
          color="bg-green-500"
        />
        <StatCard
          title="Total Invoices"
          value={stats.invoices}
          icon={FileText}
          color="bg-purple-500"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-orange-500"
        />
      </div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recent Invoices</h2>
        <div className="table-responsive mobile-scroll">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">Invoice #</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">Client</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">Amount</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr key={invoice._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 text-sm font-medium">{invoice.invoiceNumber}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 text-sm truncate max-w-[120px]">{invoice.clientId?.name}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 text-sm font-semibold">${invoice.total.toLocaleString()}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      invoice.status === 'Paid' 
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'Overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}