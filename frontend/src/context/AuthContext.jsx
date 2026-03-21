import { createContext, useContext, useState, useEffect, useRef } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../utils/firebase'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

const setAxiosToken = (token) => {
  if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete axios.defaults.headers.common['Authorization']
}

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const logoutRef             = useRef(null)

  const logout = async () => {
    await signOut(auth)
    localStorage.removeItem('user')
    setAxiosToken(null)
    setUser(null)
  }

  logoutRef.current = logout

  useEffect(() => {
    // 401 interceptor
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) logoutRef.current?.()
        return Promise.reject(err)
      }
    )

    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        try {
          const token = await firebaseUser.getIdToken()
          setAxiosToken(token)
          const cached = localStorage.getItem('user')
          if (cached) {
            setUser(JSON.parse(cached))
          } else {
            const res = await axios.post('/api/auth/sync')
            localStorage.setItem('user', JSON.stringify(res.data.user))
            setUser(res.data.user)
          }
        } catch {
          setUser(null)
        }
      } else {
        setAxiosToken(null)
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
      axios.interceptors.response.eject(interceptor)
    }
  }, [])

  const signup = async (name, email, password) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
    await sendEmailVerification(firebaseUser)
    // Don't sync to backend yet — wait for email verification
    await signOut(auth)
    return { needsVerification: true }
  }

  const login = async (email, password) => {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password)
    if (!firebaseUser.emailVerified) {
      await signOut(auth)
      throw new Error('Please verify your email before logging in. Check your inbox.')
    }
    const token = await firebaseUser.getIdToken()
    setAxiosToken(token)
    // Sync with backend — creates user in MongoDB if first login
    const res = await axios.post('/api/auth/sync', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const forgotPassword = async (email) => {
    await sendPasswordResetEmail(auth, email)
  }

  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser }
    localStorage.setItem('user', JSON.stringify(merged))
    setUser(merged)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, forgotPassword, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
