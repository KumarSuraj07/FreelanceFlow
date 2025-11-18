import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import ProjectForm from '../components/forms/ProjectForm'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects')
      setProjects(response.data)
    } catch (error) {
      toast.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${id}`)
        setProjects(projects.filter(project => project._id !== id))
        toast.success('Project deleted successfully')
      } catch (error) {
        toast.error('Failed to delete project')
      }
    }
  }

  const handleFormSubmit = async (data) => {
    try {
      if (editingProject) {
        const response = await axios.put(`/api/projects/${editingProject._id}`, data)
        setProjects(projects.map(project => 
          project._id === editingProject._id ? response.data : project
        ))
        toast.success('Project updated successfully')
      } else {
        const response = await axios.post('/api/projects', data)
        setProjects([...projects, response.data])
        toast.success('Project created successfully')
      }
      setShowForm(false)
      setEditingProject(null)
    } catch (error) {
      toast.error('Failed to save project')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
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
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your client projects and deliverables</p>
        </motion.div>
        
        <motion.button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          <span>Add Project</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div 
            key={project._id}
            className="card hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                <p className="text-sm text-gray-600">{project.clientId?.name}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingProject(project)
                    setShowForm(true)
                  }}
                  className="p-1 text-blue-600 hover:text-blue-800"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              {project.deadline && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Deadline:</span>
                  <span className="text-sm font-medium">
                    {format(new Date(project.deadline), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}

              {project.deliverables && project.deliverables.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 mb-2 block">Deliverables:</span>
                  <div className="space-y-1">
                    {project.deliverables.slice(0, 3).map((deliverable, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle 
                          size={14} 
                          className={deliverable.completed ? 'text-green-500' : 'text-gray-300'} 
                        />
                        <span className={deliverable.completed ? 'line-through text-gray-500' : ''}>
                          {deliverable.title}
                        </span>
                      </div>
                    ))}
                    {project.deliverables.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{project.deliverables.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-500 text-lg">No projects yet</p>
          <p className="text-gray-400 mt-2">Create your first project to get started</p>
        </motion.div>
      )}

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingProject(null)
          }}
        />
      )}
    </div>
  )
}