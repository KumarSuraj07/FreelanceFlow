import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import NoteForm from '../components/forms/NoteForm'

export default function ClientDetails() {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [notes, setNotes] = useState([])
  const [projects, setProjects] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)

  useEffect(() => {
    fetchClientDetails()
  }, [id])

  const fetchClientDetails = async () => {
    try {
      const [clientRes, notesRes, projectsRes, invoicesRes] = await Promise.all([
        axios.get(`/api/clients/${id}`),
        axios.get(`/api/notes/client/${id}`),
        axios.get('/api/projects'),
        axios.get('/api/invoices')
      ])

      setClient(clientRes.data)
      setNotes(notesRes.data)
      setProjects(projectsRes.data.filter(p => p.clientId._id === id))
      setInvoices(invoicesRes.data.filter(i => i.clientId._id === id))
    } catch (error) {
      toast.error('Failed to fetch client details')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`/api/notes/${noteId}`)
        setNotes(notes.filter(note => note._id !== noteId))
        toast.success('Note deleted successfully')
      } catch (error) {
        toast.error('Failed to delete note')
      }
    }
  }

  const handleNoteSubmit = async (data) => {
    try {
      if (editingNote) {
        const response = await axios.put(`/api/notes/${editingNote._id}`, data)
        setNotes(notes.map(note => 
          note._id === editingNote._id ? response.data : note
        ))
        toast.success('Note updated successfully')
      } else {
        const response = await axios.post('/api/notes', { ...data, clientId: id })
        setNotes([response.data, ...notes])
        toast.success('Note created successfully')
      }
      setShowNoteForm(false)
      setEditingNote(null)
    } catch (error) {
      toast.error('Failed to save note')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!client) {
    return <div>Client not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/clients" className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </Link>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
          <p className="text-gray-600 mt-1">{client.company}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-4">Client Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Email:</span>
              <p className="font-medium">{client.email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Phone:</span>
              <p className="font-medium">{client.phone || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Project Type:</span>
              <p className="font-medium">{client.projectType || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Budget:</span>
              <p className="font-medium">${client.budget?.toLocaleString() || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Status:</span>
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
          </div>
        </motion.div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Meeting Notes</h2>
              <button
                onClick={() => setShowNoteForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Note</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-600">
                      {format(new Date(note.date), 'MMM dd, yyyy')}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingNote(note)
                          setShowNoteForm(true)
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-900 mb-2">{note.noteText}</p>
                  {note.nextSteps && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Next Steps:</span>
                      <p className="text-sm text-gray-600">{note.nextSteps}</p>
                    </div>
                  )}
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-gray-500 text-center py-8">No meeting notes yet</p>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold mb-4">Projects & Invoices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Projects ({projects.length})</h3>
                <div className="space-y-2">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project._id} className="text-sm">
                      <p className="font-medium">{project.title}</p>
                      <p className="text-gray-600">{project.status}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Invoices ({invoices.length})</h3>
                <div className="space-y-2">
                  {invoices.slice(0, 3).map((invoice) => (
                    <div key={invoice._id} className="text-sm">
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-gray-600">${invoice.total} - {invoice.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showNoteForm && (
        <NoteForm
          note={editingNote}
          onSubmit={handleNoteSubmit}
          onCancel={() => {
            setShowNoteForm(false)
            setEditingNote(null)
          }}
        />
      )}
    </div>
  )
}