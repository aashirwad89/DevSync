/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/purity */
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiTerminal, FiMail, FiLock, FiUser, FiGithub, FiUserPlus, 
  FiArrowRight, FiCheckCircle, FiZap, FiActivity, FiAlertCircle 
} from 'react-icons/fi'
import { useAuth } from '../authContext' //Adjust path to your AuthContext
import { useRouter } from 'next/navigation'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, signup, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Login
        await login(email, password)
        router.push('/dashboard') // Redirect to dashboard after login
      } else {
        // Signup
        await signup(name, email, password)
        router.push('/dashboard') // Redirect after signup
      }
    } catch (err: any) {
      setError(err.message || (isLogin ? 'Invalid credentials' : 'Signup failed'))
    } finally {
      setLoading(false)
    } 
  }

  const SocialButton = ({ 
    icon, 
    label, 
    onClick,
    gradient 
  }: { 
    icon: React.ReactNode, 
    label: string, 
    onClick: () => void,
    gradient: string 
  }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full p-4 rounded-2xl border border-white/20 backdrop-blur-xl flex items-center gap-4 font-mono text-sm font-bold transition-all duration-300 group hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 ${gradient}`}
    >
      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
        {icon}
      </div>
      <span className="flex-1 text-left">{label}</span>
      <FiArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all ml-auto" />
    </motion.button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-emerald-950 text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:80px_80px] opacity-50" />
      
      {/* Matrix Rain */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-500/40 font-mono text-xs"
            style={{ 
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`
            }}
            animate={{ y: ['-100%', '100vh'] }}
            transition={{ 
              duration: 5 + Math.random() * 3, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
          >
            01
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {/* Terminal Header */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                <FiTerminal className="w-10 h-10 text-black" />
              </div>
            </div>
            <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl px-8 py-4 inline-block">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                devsync@auth:~$
              </div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent tracking-tight">
                {isLogin ? 'Welcome Back' : 'Join DevSync'}
              </h1>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? -50 : 50 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-950/50 backdrop-blur-3xl border border-emerald-500/30 rounded-3xl p-8 shadow-2xl shadow-emerald-500/10"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl backdrop-blur-sm flex items-start gap-3 font-mono text-sm"
                  >
                    <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Email Field */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <label className="block text-sm font-mono text-emerald-400 mb-2 flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded-2xl px-12 py-4 text-white font-mono placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300"
                      placeholder="dev@lightspeed.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </motion.div>

                {/* Name Field (Signup only) */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-mono text-emerald-400 mb-2 flex items-center gap-2">
                        <FiUser className="w-4 h-4" />
                        Username
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-black/50 border border-white/20 rounded-2xl px-12 py-4 text-white font-mono placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300"
                          placeholder="Enter your username"
                          required
                          disabled={loading}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Password Field */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <label className="block text-sm font-mono text-emerald-400 mb-2 flex items-center gap-2">
                    <FiLock className="w-4 h-4" />
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded-2xl px-12 py-4 text-white font-mono placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300"
                      placeholder="••••••••"
                      minLength={8}
                      required
                      disabled={loading}
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || authLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black text-lg py-5 px-8 rounded-2xl font-mono uppercase tracking-wider shadow-2xl shadow-emerald-500/30 hover:from-emerald-400 hover:to-teal-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading || authLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <FiZap className="w-5 h-5" />
                      {isLogin ? 'Sign In' : 'Create Account'}
                    </>
                  )}
                </motion.button>
              </form>

              {/* Social Login */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-emerald-500/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase text-emerald-400 font-mono tracking-wider">
                  Or continue with
                </div>
              </div>

              <div className="space-y-3">
                <SocialButton
                  icon={<FiGithub className="w-5 h-5" />}
                  label="Continue with GitHub"
                  gradient="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800"
                  onClick={() => console.log('GitHub OAuth')}
                />
                <SocialButton
                  icon={<FiMail className="w-5 h-5" />}
                  label="Continue with Google"
                  gradient="bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20"
                  onClick={() => console.log('Google OAuth')}
                />
              </div>

              {/* Toggle Form */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 pt-8 border-t border-emerald-500/20 text-center"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                  }}
                  disabled={loading}
                  className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-mono text-sm transition-all duration-300 group disabled:opacity-50"
                >
                  {isLogin 
                    ? 'New to DevSync? Create account' 
                    : 'Already have account? Sign in'
                  }
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              {/* Stats Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 text-center text-xs text-emerald-400/70 font-mono tracking-wider space-y-1"
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1">
                    <FiCheckCircle className="w-3 h-3" />
                    <span>SOC 2 Compliant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiZap className="w-3 h-3" />
                    <span>99.99% Uptime</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiActivity className="w-3 h-3" />
                    <span>150K+ Developers</span>
                  </div>
                </div>
                <p>Secure • Fast • Trusted</p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthPage
