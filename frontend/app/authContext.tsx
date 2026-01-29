/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ✅ HARDCODE kar dete hain pehle
const API_BASE_URL = 'http://localhost:8000'; // Tumhara backend port

// User interface
interface User {
  id: string;
  username?: string;
  email?: string;
}

interface AuthResponse {
  token: string;
  userId?: string;
}

interface AuthContextType {
  currUser: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // ✅ false rakho initially

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setCurrUser({ id: storedUserId });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔄 Login attempt:', { email }); // Debug
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Response status:', response.status); // Debug

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data: AuthResponse = await response.json();
      console.log('✅ Login success:', data); // Debug
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId!);
      
      setToken(data.token);
      setCurrUser({ id: data.userId! });
      
    } catch (error: any) {
      console.error('❌ Login error:', error.message);
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      console.log('🔄 Signup attempt:', { username, email });
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data: AuthResponse = await response.json();
      
      // Decode JWT to get userId
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const userId = payload.id;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', userId);
      
      setToken(data.token);
      setCurrUser({ id: userId, username });
      
    } catch (error: any) {
      console.error('❌ Signup error:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setCurrUser(null);
  };

  const value: AuthContextType = {
    currUser,
    token,
    isLoading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
