import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import ClientForm from '../components/forms/ClientForm'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients')
      setClients(response.data)
    } catch (error) {
      toast.error('Failed to fetch clients')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await axios.delete(`/api/clients/${id}`)
        setClients(clients.filter(client => client._id !== id))
        toast.success('Client deleted successfully')
      } catch (error) {
        toast.error('Failed to delete client')
      }
    }
  }

  const handleFormSubmit = async (data) => {
    try {
      if (editingClient) {
        const response = await axios.put(`/api/clients/${editingClient._id}`, data)
        setClients(clients.map(client => 
          client._id === editingClient._id ? response.data : client
        ))
        toast.success('Client updated successfully')
      } else {
        const response = await axios.post('/api/clients', data)
        setClients([...clients, response.data])
        toast.success('Client created successfully')
      }
      setShowForm(false)
      setEditingClient(null)
    } catch (error) {
      toast.error('Failed to save client')
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your client relationships</p>
        </motion.div>
        
        <motion.button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          <span>Add Client</span>
        </motion.button>
      </div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-4">
          {clients.map((client) => (
            <motion.div
              key={client._id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600">{client.company}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  client.status === 'Active' 
                    ? 'bg-green-100 text-green-800'
                    : client.status === 'Completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {client.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">{client.email}</p>
                <p className="font-medium">${client.budget?.toLocaleString()}</p>
              </div>
              <div className="flex justify-end space-x-3 mt-4 pt-3 border-t border-gray-200">
                <Link
                  to={`/clients/${client._id}`}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                >
                  <Eye size={18} />
                </Link>
                <button
                  onClick={() => {
                    setEditingClient(client)
                    setShowForm(true)
                  }}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(client._id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block table-responsive mobile-scroll">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Company</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Budget</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <motion.tr 
                  key={client._id} 
                  className="border-b border-gray-100 hover:bg-gray-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="py-3 px-4 font-medium text-sm">{client.name}</td>
                  <td className="py-3 px-4 text-sm">{client.company}</td>
                  <td className="py-3 px-4 text-sm">{client.email}</td>
                  <td className="py-3 px-4 text-sm font-semibold">${client.budget?.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      client.status === 'Active' 
                        ? 'bg-green-100 text-green-800'
                        : client.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/clients/${client._id}`}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => {
                          setEditingClient(client)
                          setShowForm(true)
                        }}
                        className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(client._id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showForm && (
        <ClientForm
          client={editingClient}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingClient(null)
          }}
        />
      )}
    </div>
  )
}