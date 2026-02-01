/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiTerminal, FiMail, FiLock, FiUser, FiGithub, 
  FiArrowRight, FiCheckCircle, FiZap, FiActivity, FiAlertCircle,
  FiSun, FiMoon
} from 'react-icons/fi'
import { useAuth } from '../../contexts/authContext' 
import { useRouter } from 'next/navigation'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [typedText, setTypedText] = useState('')

  const { login, signup, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Typing animation
  const fullText = isLogin ? 'Welcome Back, Developer' : 'Join DevSync Community'
  
  useEffect(() => {
    setTypedText('')
    let currentIndex = 0
    const intervalId = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(intervalId)
      }
    }, 80)

    return () => clearInterval(intervalId)
  }, [isLogin, fullText])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        if (!name.trim()) {
          throw new Error('Username is required')
        }
        await signup(name, email, password)
      }
    } catch (err: any) {
      setError(err.message || (isLogin ? 'Invalid credentials' : 'Signup failed'))
    } finally {
      setLoading(false)
    } 
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setEmail('')
    setPassword('')
    setName('')
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
      className={`w-full p-3 rounded-xl border border-white/20 backdrop-blur-xl flex items-center gap-3 font-mono text-xs font-bold transition-all duration-300 group hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/20 ${gradient}`}
    >
      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
        {icon}
      </div>
      <span className="flex-1 text-left">{label}</span>
      <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
    </motion.button>
  )

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-950 to-emerald-950 text-white overflow-hidden flex items-center justify-center">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:80px_80px] opacity-50" />
      
      {/* Matrix Rain */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-500/30 font-mono text-xs"
            style={{ 
              left: `${i * 6.66}%`,
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

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Left Side - Form */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full"
          >
            {/* Terminal Header with Typing Animation */}
            <motion.div 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/40">
                  <FiTerminal className="w-7 h-7 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs mb-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    devsync@auth:~$
                  </div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent tracking-tight">
                    {typedText}
                    <span className="animate-pulse">|</span>
                  </h1>
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-950/50 backdrop-blur-3xl border border-emerald-500/30 rounded-2xl p-6 shadow-2xl shadow-emerald-500/10"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl backdrop-blur-sm flex items-start gap-2 font-mono text-xs"
                      >
                        <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Name Field (Signup only) */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-xs font-mono text-emerald-400 mb-2 flex items-center gap-2">
                          <FiUser className="w-3 h-3" />
                          Username
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded-xl px-10 py-3 text-white font-mono text-sm placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300"
                            placeholder="Enter your username"
                            required
                            disabled={loading || authLoading}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-mono text-emerald-400 mb-2 flex items-center gap-2">
                      <FiMail className="w-3 h-3" />
                      Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-10 py-3 text-white font-mono text-sm placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300"
                        placeholder="dev@lightspeed.com"
                        required
                        disabled={loading || authLoading}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-mono text-emerald-400 mb-2 flex items-center gap-2">
                      <FiLock className="w-3 h-3" />
                      Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-10 py-3 text-white font-mono text-sm placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300"
                        placeholder="••••••••"
                        minLength={8}
                        required
                        disabled={loading || authLoading}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || authLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black text-sm py-3.5 px-6 rounded-xl font-mono uppercase tracking-wider shadow-xl shadow-emerald-500/30 hover:from-emerald-400 hover:to-teal-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading || authLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <FiZap className="w-4 h-4" />
                        {isLogin ? 'Sign In' : 'Create Account'}
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Social Login */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-emerald-500/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase text-emerald-400/70 font-mono tracking-wider">
                    <span className="bg-gray-950/50 px-3">Or continue with</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <SocialButton
                    icon={<FiGithub className="w-4 h-4" />}
                    label="Continue with GitHub"
                    gradient="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800"
                    onClick={() => console.log('GitHub OAuth - Coming Soon!')}
                  />
                  <SocialButton
                    icon={<FiMail className="w-4 h-4" />}
                    label="Continue with Google"
                    gradient="bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20"
                    onClick={() => console.log('Google OAuth - Coming Soon!')}
                  />
                </div>

                {/* Stats Footer */}
                <div className="mt-5 text-center text-xs text-emerald-400/60 font-mono">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <div className="flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiZap className="w-3 h-3" />
                      <span>Fast</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiActivity className="w-3 h-3" />
                      <span>Trusted</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Side - Lamp Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              {/* Lamp Stand */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-4 h-52 bg-gradient-to-b from-gray-700 to-gray-800 rounded-full shadow-lg" />
              
              {/* Lamp Base */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-24 h-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-full shadow-2xl" />
              
              {/* Lamp Bulb/Switch */}
              <motion.button
                onClick={toggleAuthMode}
                disabled={loading || authLoading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 w-40 h-40 rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Glow Effect */}
                <motion.div
                  animate={{
                    opacity: isLogin ? [0.5, 0.8, 0.5] : [0.3, 0.5, 0.3],
                    scale: isLogin ? [1, 1.1, 1] : [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`absolute inset-0 rounded-full blur-3xl ${
                    isLogin 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                      : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                  }`}
                />
                
                {/* Bulb */}
                <motion.div
                  animate={{
                    backgroundColor: isLogin 
                      ? ['#FCD34D', '#FBBF24', '#FCD34D'] 
                      : ['#60A5FA', '#3B82F6', '#60A5FA']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative w-full h-full rounded-full border-4 border-white/20 shadow-2xl flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    {isLogin ? (
                      <FiSun className="w-16 h-16 text-orange-900" />
                    ) : (
                      <FiMoon className="w-16 h-16 text-indigo-900" />
                    )}
                  </motion.div>
                </motion.div>

                {/* Light Rays */}
                {isLogin && (
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-1 bg-yellow-400/50"
                        style={{
                          height: '80px',
                          transformOrigin: 'top center',
                          transform: `rotate(${i * 45}deg) translateX(-50%)`
                        }}
                        animate={{
                          opacity: [0.3, 0.7, 0.3],
                          scaleY: [0.8, 1.2, 0.8]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.button>

              {/* Label */}
              <motion.div
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
                animate={{
                  color: isLogin ? '#FCD34D' : '#60A5FA'
                }}
              >
                <p className="text-sm font-mono font-bold mb-1">
                  {isLogin ? 'Switch to Sign Up' : 'Switch to Sign In'}
                </p>
                <p className="text-xs text-emerald-400/60 font-mono">
                  Click the lamp
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage