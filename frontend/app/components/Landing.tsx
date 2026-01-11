/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { 
  FiGitBranch, FiGitCommit, FiGitPullRequest, FiTerminal, FiZap, FiActivity,
  FiUsers, FiShield, FiCode, FiArrowRight, FiCpu, FiDatabase, FiLock, FiCommand,
  FiCheckCircle, FiStar, FiGithub, FiTwitter, FiLinkedin, FiMail, FiMenu, FiX
} from 'react-icons/fi'

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => setHasMounted(true), [])
  if (!hasMounted) return null
  return <>{children}</>
}

function Landing() {
  const [currentChapter, setCurrentChapter] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const heroRef = useRef(null)
  
  const chapters = [
    { title: "The Problem", subtitle: "GitHub is slow. GitLab is bloated.", story: "Developers waste 3+ hours every week waiting for pushes, pulls, and merges.", cta: "There had to be a better way..." },
    { title: "The Breakthrough", subtitle: "We rebuilt Git from the ground up.", story: "Distributed edge network. <50ms latency. Zero-knowledge encryption.", cta: "Engineers started noticing..." },
    { title: "The Migration", subtitle: "150K+ developers switched in 6 months.", story: "Stripe cut CI/CD times by 70%. Shopify automated their pipeline.", cta: "The revolution had begun." },
    { title: "Your Turn", subtitle: "Join the fastest Git platform.", story: "Push code in 60 seconds. Scale to infinity.", cta: "Ready to ship faster?" }
  ]

  useEffect(() => {
    setMounted(true)
    document.documentElement.classList.add('dark')
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-emerald-400 font-mono text-xl animate-pulse">Loading story...</div>
      </div>
    )
  }

  const StoryChapter = ({ chapter, index }: { chapter: any, index: number }) => (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8, delay: index * 0.2 }} className="text-center mb-20">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} 
        transition={{ duration: 0.5 }} 
        className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500/10 rounded-full border-2 border-emerald-500/30 mb-8 backdrop-blur-sm">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-sm font-mono text-emerald-400 uppercase tracking-wider">Chapter {index + 1}</span>
      </motion.div>
      
      <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.8 }} 
        className="text-7xl lg:text-8xl xl:text-9xl font-black text-white mb-6 leading-tight tracking-tight font-mono">
        {chapter.title}
      </motion.h1>
      
      <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.8, delay: 0.2 }} 
        className="text-2xl lg:text-3xl text-emerald-400 mb-8 font-mono uppercase tracking-widest font-black">
        {chapter.subtitle}
      </motion.p>
      
      <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.8, delay: 0.4 }} 
        className="text-xl lg:text-2xl text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed font-mono">
        {chapter.story}
      </motion.p>
      
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.6, delay: 0.6 }} 
        className="text-4xl font-mono text-emerald-400 mb-4 opacity-75">
        {chapter.cta}
      </motion.div>
    </motion.div>
  )

  const StatCard = ({ value, label }: { value: string, label: string }) => (
    <motion.div whileHover={{ y: -10, scale: 1.05 }} 
      className="bg-gradient-to-b from-gray-950/50 to-black/50 backdrop-blur-xl rounded-3xl p-10 border border-red-500/20 hover:border-red-500/40 transition-all">
      <div className="text-4xl mb-4 text-red-400">
        <FiUsers className="w-12 h-12 inline" />
      </div>
      <div className="text-5xl font-black text-white mb-2 font-mono">{value}</div>
      <div className="text-gray-500 uppercase tracking-widest font-mono text-sm">{label}</div>
    </motion.div>
  )

  const TechCard = ({ label }: { label: string }) => (
    <motion.div whileHover={{ scale: 1.1, boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }} 
      className="group p-8 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all bg-gradient-to-br from-gray-950/50 to-black/50 backdrop-blur-xl">
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-2xl">
        <FiCpu className="w-10 h-10 text-black" />
      </div>
      <h3 className="text-2xl font-black text-white mb-2 font-mono">{label}</h3>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-black text-gray-100 overflow-x-hidden">
      {/* 🔥 ENHANCED NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-3xl bg-black/95 border-b border-emerald-500/40 shadow-2xl shadow-emerald-500/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 group">
              <div className="relative p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/30 group-hover:shadow-2xl group-hover:shadow-emerald-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
                <FiTerminal className="w-7 h-7 text-black relative z-10" />
              </div>
              <div>
                <div className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent tracking-tight">
                  DevSync
                </div>
                <div className="text-xs font-mono text-emerald-400/80 tracking-wider">v2.1.0</div>
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-12">
              <div className="flex items-center gap-1">
                {chapters.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrentChapter(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentChapter === i
                        ? 'bg-emerald-500 scale-150 shadow-lg shadow-emerald-500/50'
                        : 'bg-emerald-500/40 hover:bg-emerald-500/70 hover:scale-125'
                    }`}
                    whileHover={{ scale: 1.4 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-8 text-sm font-mono uppercase tracking-wider text-gray-400">
                <a href="/features" className="hover:text-emerald-400 transition-all duration-300 flex items-center gap-1 group">
                  <span className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">$</span>
                  Features
                </a>
                <a href="/pricing" className="hover:text-emerald-400 transition-all duration-300 flex items-center gap-1 group">
                  <span className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">$</span>
                  Pricing
                </a>
                <a href="/documents" className="hover:text-emerald-400 transition-all duration-300 flex items-center gap-1 group">
                  <span className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">$</span>
                  Docs
                </a>
              </div>
              <motion.button
              onClick={()=> window.location.href= "/login"}
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black rounded-2xl hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 shadow-xl shadow-emerald-500/30 border border-emerald-400 font-mono uppercase tracking-widest text-sm"
              >
                Get Started Free
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 rounded-xl border border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6 text-emerald-400" /> : <FiMenu className="w-6 h-6 text-emerald-400" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden pb-4 border-t border-emerald-500/20"
              >
                <div className="flex flex-col items-center gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    {chapters.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => {
                          setCurrentChapter(i)
                          setMobileMenuOpen(false)
                        }}
                        className={`w-3 h-3 rounded-full transition-all ${
                          currentChapter === i ? 'bg-emerald-500 scale-125' : 'bg-emerald-500/50'
                        }`}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col items-center gap-3 text-sm font-mono text-gray-400">
                    <a href="/features" className="hover:text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500/10 transition-all">Features</a>
                    <a href="/pricing" className="hover:text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500/10 transition-all">Pricing</a>
                    <a href="/documents" className="hover:text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500/10 transition-all">Docs</a>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black rounded-2xl hover:from-emerald-400 hover:to-teal-500 transition-all shadow-xl font-mono uppercase tracking-wider text-sm"
                  >
                    Get Started Free
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Matrix Background */}
      <ClientOnly>
        <div className="fixed inset-0 overflow-hidden opacity-[0.08] pointer-events-none z-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-emerald-500/70 font-mono text-xs"
              style={{ left: `${(i % 6) * 16.66}%` }}
              animate={{ y: ['-10%', '110vh'] }}
              transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'linear' }}
            >
              01
            </motion.div>
          ))}
        </div>
      </ClientOnly>

      {/* STORY SECTIONS - SAME AS BEFORE */}
      <section className="min-h-screen flex items-center justify-center py-32 px-4 relative pt-24">
        <div className="max-w-7xl mx-auto text-center">
          <StoryChapter chapter={chapters[0]} index={0} />
          <ClientOnly>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 0.8, delay: 1 }} className="max-w-6xl mx-auto mt-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard value="3+ hrs" label="Lost weekly per dev" />
                <StatCard value="20+ min" label="Monorepo clones" />
                <StatCard value="47%" label="Pipeline failures" />
              </div>
            </motion.div>
          </ClientOnly>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center py-32 px-4 bg-gradient-to-b from-transparent to-emerald-950/30 relative pt-24">
        <div className="max-w-7xl mx-auto text-center">
          <StoryChapter chapter={chapters[1]} index={1} />
          <ClientOnly>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 1.2 }} className="max-w-6xl mx-auto mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
              <TechCard label="Edge CDN" />
              <TechCard label="Zero-Knowledge" />
              <TechCard label="<50ms Latency" />
              <TechCard label="SOC 2 Type II" />
            </motion.div>
          </ClientOnly>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center py-32 px-4 relative pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <StoryChapter chapter={chapters[2]} index={2} />
            <ClientOnly>
              <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 1.4 }} className="space-y-8">
                {[
                  { name: "Alex Chen", company: "Stripe", stat: "CI/CD 70% faster", color: "from-rose-500 to-pink-500" },
                  { name: "Sarah M.", company: "Shopify", stat: "Full automation", color: "from-emerald-500 to-teal-600" },
                  { name: "James P.", company: "Datadog", stat: "SOC 2 overnight", color: "from-blue-500 to-indigo-600" }
                ].map((testimonial, i) => (
                  <motion.div key={i} whileHover={{ y: -10, scale: 1.02 }} 
                    className="group bg-gradient-to-r from-gray-950/70 to-black/50 backdrop-blur-xl rounded-3xl p-10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.color} rounded-2xl flex items-center justify-center shadow-2xl`}>
                        <span className="font-black text-xl text-black">{testimonial.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-xl font-black text-white font-mono">{testimonial.name}</div>
                        <div className="text-emerald-400 font-mono uppercase tracking-wider text-sm">{testimonial.company}</div>
                      </div>
                    </div>
                    <div className="text-4xl font-black text-emerald-400 mb-4 font-mono">{testimonial.stat}</div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => <FiStar key={j} className="w-6 h-6 text-emerald-400 fill-emerald-400" />)}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </ClientOnly>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center py-32 px-4 bg-gradient-to-b from-emerald-950/40 to-black relative pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <StoryChapter chapter={chapters[3]} index={3} />
          <ClientOnly>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 0.8, delay: 1.2 }} className="max-w-4xl mx-auto mt-20">
              <div className="bg-black rounded-3xl shadow-2xl p-12 border-2 border-emerald-500/30 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 blur-3xl" />
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-mono text-emerald-500">devsync@lightspeed</span>
                </div>
                <div className="space-y-4 text-left font-mono text-lg">
                  <div className="flex gap-2"><span className="text-emerald-500 font-bold">➜</span><span className="text-cyan-400">npm</span> i -g devsync</div>
                  <div className="text-emerald-500 pl-6">✓ Installed in 2.3s</div>
                  <div className="flex gap-2"><span className="text-emerald-500 font-bold">➜</span><span className="text-white">devsync</span> init my-project</div>
                  <div className="text-emerald-500 pl-6">✓ Repo created globally</div>
                  <div className="flex gap-2"><span className="text-emerald-500 font-bold">➜</span><span className="text-cyan-400">git</span> push origin main</div>
                  <div className="text-emerald-500 pl-6">✓ Pushed in 47ms 🚀</div>
                  <motion.div animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="flex gap-2">
                    <span className="text-emerald-500 font-bold">➜</span>
                    <span className="inline-block w-2 h-6 bg-emerald-500 animate-pulse ml-1" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </ClientOnly>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.8, delay: 1.6 }} className="mt-20 space-y-6">
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(16, 185, 129, 0.4)' }} 
              whileTap={{ scale: 0.95 }} 
              className="w-full max-w-2xl mx-auto px-12 py-8 bg-emerald-500 text-black text-2xl font-black rounded-3xl hover:bg-emerald-400 transition-all shadow-2xl border-4 border-emerald-400 font-mono tracking-wider">
              <FiTerminal className="inline w-10 h-10 mr-4" /> START YOUR STORY → 60 SECONDS
            </motion.button>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                SOC 2 • GDPR • 99.99% Uptime
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🔥 ENHANCED FOOTER */}
      <footer className="bg-gradient-to-t from-black via-gray-950 to-transparent border-t-4 border-emerald-500/30 backdrop-blur-3xl shadow-2xl shadow-emerald-500/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
              className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/30 group-hover:shadow-2xl group-hover:shadow-emerald-500/50 transition-all">
                  <FiTerminal className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    DevSync
                  </h3>
                  <p className="text-sm text-emerald-400/80 font-mono tracking-wider">The future of Git</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Enterprise-grade Git platform built for speed, scale, and security. Join 150K+ developers shipping faster.
              </p>
            </motion.div>

            {/* Product */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} transition={{ delay: 0.1 }} className="space-y-4">
              <h4 className="text-lg font-black text-white font-mono uppercase tracking-wider">Product</h4>
              {['Features', 'Pricing', 'CLI Tools', 'API', 'Changelog'].map((item, i) => (
                <a key={i} href="#" className="block text-gray-400 hover:text-emerald-400 transition-all duration-300 font-mono text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full scale-0 group-hover:scale-100 transition-transform opacity-0 group-hover:opacity-100" />
                  {item}
                </a>
              ))}
            </motion.div>

            {/* Developers */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} transition={{ delay: 0.2 }} className="space-y-4">
              <h4 className="text-lg font-black text-white font-mono uppercase tracking-wider">Developers</h4>
              {['Documentation', 'GitHub', 'Discord', 'Status', 'Community'].map((item, i) => (
                <a key={i} href="#" className="block text-gray-400 hover:text-emerald-400 transition-all duration-300 font-mono text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full scale-0 group-hover:scale-100 transition-transform opacity-0 group-hover:opacity-100" />
                  {item}
                </a>
              ))}
            </motion.div>

            {/* Company */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} transition={{ delay: 0.3 }} className="space-y-6">
              <h4 className="text-lg font-black text-white font-mono uppercase tracking-wider">Company</h4>
              {['About', 'Blog', 'Careers', 'Security', 'Privacy'].map((item, i) => (
                <a key={i} href="#" className="block text-gray-400 hover:text-emerald-400 transition-all duration-300 font-mono text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full scale-0 group-hover:scale-100 transition-transform opacity-0 group-hover:opacity-100" />
                  {item}
                </a>
              ))}
              <div className="flex gap-4 pt-2">
                {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.2, rotate: 5 }} 
                    className="w-12 h-12 bg-gray-950/50 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-all shadow-lg">
                    <Icon className="w-6 h-6 text-gray-400 group-hover:text-emerald-400" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="border-t border-emerald-500/20 mt-16 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 font-mono text-sm tracking-wider">
              © 2026 DevSync, Inc. Built with <span className="text-emerald-500 font-black">♥</span> for developers who ship fast.
            </p>
            <div className="flex items-center gap-6 text-xs font-mono text-emerald-400/70">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>All systems operational</span>
              </div>
              <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-1">Status →</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
