'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  _id: string  // Backend se _id aata hai
  username: string
  email: string
  isAdmin?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const API_BASE = 'http://localhost:8000/api/v1' // HARDCODED FIXED

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await fetch(`${API_BASE}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.data)
        } else {
          localStorage.removeItem('token')
        }
      }
    } catch (error) {
      localStorage.removeItem('token')
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ FIXED: Backend response structure match
  const login = async (email: string, password: string) => {
    console.log('🔐 Login attempt:', { email })
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    console.log('📡 Login response:', data)

    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    // Backend: { success: true, token, user: {...} }
    localStorage.setItem('token', data.token) // ← Backend se direct token
    setUser(data.user) // ← Backend se direct user
    router.push('/dashboard')
  }

  // ✅ FIXED: Backend response structure match  
  const signup = async (name: string, email: string, password: string) => {
    console.log('🚀 Signup attempt:', { name, email })
    const response = await fetch(`${API_BASE}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }), // Frontend: name
    })

    const data = await response.json()
    console.log('📡 Signup response:', data)

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed')
    }

    // Backend: { success: true, token, user: {...} }
    localStorage.setItem('token', data.token) // ← Backend se direct token
    setUser(data.user) // ← Backend se direct user  
    router.push('/dashboard')
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await fetch(`${API_BASE}/users/me`, { // me endpoint use karo
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      router.push('/')
    }
  }

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
