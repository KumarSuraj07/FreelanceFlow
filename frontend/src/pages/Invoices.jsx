import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Download, Send, Trash2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('/api/invoices')
      setInvoices(response.data)
    } catch (error) {
      toast.error('Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await axios.delete(`/api/invoices/${id}`)
        setInvoices(invoices.filter(invoice => invoice._id !== id))
        toast.success('Invoice deleted successfully')
      } catch (error) {
        toast.error('Failed to delete invoice')
      }
    }
  }

  const handleDownloadPDF = async (id) => {
    try {
      const response = await axios.get(`/api/invoices/${id}/pdf`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success('PDF downloaded successfully')
    } catch (error) {
      toast.error('Failed to download PDF')
    }
  }

  const handleSendEmail = async (id) => {
    try {
      await axios.post(`/api/invoices/${id}/send`)
      toast.success('Invoice sent successfully')
    } catch (error) {
      toast.error('Failed to send invoice')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800'
      case 'Overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-2">Manage your client invoices and payments</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/invoices/create"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create Invoice</span>
          </Link>
        </motion.div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {invoices.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No invoices yet</p>
            <p className="text-gray-400 mt-2">Create your first invoice to get started</p>
          </div>
        ) : invoices.map((invoice) => (
          <motion.div
            key={invoice._id}
            className="card p-4 space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                <p className="text-sm font-medium text-gray-700">{invoice.clientId?.name}</p>
                {invoice.clientId?.company && (
                  <p className="text-xs text-gray-500">{invoice.clientId.company}</p>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-gray-900 text-base">${invoice.total.toLocaleString()}</span>
              <span className="text-gray-500">Due {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex space-x-2 pt-1 border-t border-gray-100">
              <button onClick={() => handleDownloadPDF(invoice._id)} className="flex-1 flex items-center justify-center space-x-1.5 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Download size={15} /><span>PDF</span>
              </button>
              <button onClick={() => handleSendEmail(invoice._id)} className="flex-1 flex items-center justify-center space-x-1.5 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Send size={15} /><span>Send</span>
              </button>
              <button onClick={() => handleDelete(invoice._id)} className="flex-1 flex items-center justify-center space-x-1.5 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={15} /><span>Delete</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop table */}
      <motion.div
        className="card hidden sm:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice #</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <motion.tr
                  key={invoice._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="py-3 px-4 font-medium">{invoice.invoiceNumber}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{invoice.clientId?.name}</p>
                      <p className="text-sm text-gray-600">{invoice.clientId?.company}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">${invoice.total.toLocaleString()}</td>
                  <td className="py-3 px-4">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button onClick={() => handleDownloadPDF(invoice._id)} className="p-1 text-blue-600 hover:text-blue-800" title="Download PDF">
                        <Download size={16} />
                      </button>
                      <button onClick={() => handleSendEmail(invoice._id)} className="p-1 text-green-600 hover:text-green-800" title="Send Email">
                        <Send size={16} />
                      </button>
                      <button onClick={() => handleDelete(invoice._id)} className="p-1 text-red-600 hover:text-red-800" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No invoices yet</p>
            <p className="text-gray-400 mt-2">Create your first invoice to get started</p>
          </div>
        )}
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">
            ${invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            ${invoices.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + i.total, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Overdue</h3>
          <p className="text-3xl font-bold text-red-600">
            ${invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.total, 0).toLocaleString()}
          </p>
        </div>
      </motion.div>
    </div>
  )
}