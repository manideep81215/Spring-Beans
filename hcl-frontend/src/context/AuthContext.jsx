import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [token])

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password })
      const { token: jwt, user: userData } = res.data
      setToken(jwt)
      setUser(userData)
      localStorage.setItem('token', jwt)
      localStorage.setItem('user', JSON.stringify(userData))
      toast.success(`Welcome back, ${userData.name}!`)
      return { success: true, user: userData }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Login failed'
      toast.error(msg)
      return { success: false, message: msg }
    }
  }

  const register = async (dataOrName, email, password, phone, role = 'CUSTOMER') => {
    try {
      const request = typeof dataOrName === 'object'
        ? dataOrName
        : { name: dataOrName, email, password, phone, role }
      const res = await authAPI.register(request)
      const { token: jwt, user: userData } = res.data
      setToken(jwt)
      setUser(userData)
      localStorage.setItem('token', jwt)
      localStorage.setItem('user', JSON.stringify(userData))
      toast.success('Account created! Welcome')
      return { success: true, user: userData }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed'
      toast.error(msg)
      return { success: false, message: msg }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
