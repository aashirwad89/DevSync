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
  FiCheckCircle, FiStar, FiGithub, FiTwitter, FiLinkedin, FiMail, FiMenu, FiX,
  FiClock, FiTrendingUp, FiBox, FiLayers
} from 'react-icons/fi'

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => setHasMounted(true), [])
  if (!hasMounted) return null
  return <>{children}</>
}

function Landing() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    document.documentElement.classList.add('dark')
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-emerald-400 font-mono text-xl animate-pulse">Loading...</div>
      </div>
    )
  }

  const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-gradient-to-b from-gray-950/50 to-black/50 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
    >
      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
        <Icon className="w-7 h-7 text-black" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 font-mono">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </motion.div>
  )

  const StatCard = ({ value, label, icon: Icon }: { value: string, label: string, icon: any }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="text-center p-6"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-xl mb-4">
        <Icon className="w-6 h-6 text-emerald-400" />
      </div>
      <div className="text-4xl font-black text-white mb-2 font-mono">{value}</div>
      <div className="text-gray-500 uppercase tracking-wider font-mono text-xs">{label}</div>
    </motion.div>
  )

  const TestimonialCard = ({ name, company, quote, role }: { name: string, company: string, quote: string, role: string }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-gray-950/70 to-black/50 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/20 hover:border-emerald-500/30 transition-all"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => <FiStar key={i} className="w-4 h-4 text-emerald-400 fill-emerald-400" />)}
      </div>
      <p className="text-gray-300 mb-6 leading-relaxed">&quot;{quote}&quot;</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
          <span className="font-bold text-black text-lg">{name.charAt(0)}</span>
        </div>
        <div>
          <div className="text-white font-bold">{name}</div>
          <div className="text-emerald-400 text-sm font-mono">{role} @ {company}</div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-black text-gray-100 overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-3xl bg-black/95 border-b border-emerald-500/40 shadow-2xl shadow-emerald-500/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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

            <div className="hidden lg:flex items-center gap-8 text-sm font-mono uppercase tracking-wider text-gray-400">
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
              <motion.button
                onClick={() => window.location.href = "/login"}
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black rounded-2xl hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 shadow-xl shadow-emerald-500/30 border border-emerald-400 font-mono uppercase tracking-widest text-sm"
              >
                Get Started Free
              </motion.button>
            </div>

            <motion.button
              className="lg:hidden p-2 rounded-xl border border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6 text-emerald-400" /> : <FiMenu className="w-6 h-6 text-emerald-400" />}
            </motion.button>
          </div>

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
                  <div className="flex flex-col items-center gap-3 text-sm font-mono text-gray-400">
                    <a href="/features" className="hover:text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500/10 transition-all">Features</a>
                    <a href="/pricing" className="hover:text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500/10 transition-all">Pricing</a>
                    <a href="/documents" className="hover:text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500/10 transition-all">Docs</a>
                  </div>
                  <motion.button
                    onClick={() => window.location.href = "/login"}
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

      {/* HERO SECTION */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center py-32 px-4 relative pt-32">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/30 mb-8 backdrop-blur-sm"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-mono text-emerald-400 uppercase tracking-wider">Enterprise Git Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-tight tracking-tight"
          >
            Ship Code at
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
              Lightning Speed
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl lg:text-2xl text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Enterprise-grade Git platform with <span className="text-emerald-400 font-bold">&lt;50ms latency</span>, zero-knowledge encryption, and distributed edge network. Built for teams who ship fast.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.button
              onClick={() => window.location.href = "/login"}
              whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(16, 185, 129, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-emerald-500 text-black text-lg font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl border-2 border-emerald-400 font-mono tracking-wider flex items-center gap-3"
            >
              <FiTerminal className="w-6 h-6" />
              Start Free Trial
              <FiArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-transparent border-2 border-emerald-500/50 text-emerald-400 text-lg font-bold rounded-2xl hover:bg-emerald-500/10 transition-all font-mono tracking-wider"
            >
              View Demo
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-6 text-sm text-gray-500 font-mono"
          >
            <div className="flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-emerald-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-emerald-500" />
              <span>SOC 2 Type II</span>
            </div>
          </motion.div>

          {/* Terminal Demo */}
          <ClientOnly>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-4xl mx-auto mt-16"
            >
              <div className="bg-black rounded-2xl shadow-2xl p-8 border border-emerald-500/30 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 blur-3xl" />
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-500/20 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  <span className="text-xs font-mono text-emerald-500">devsync@terminal</span>
                </div>
                <div className="space-y-3 text-left font-mono text-sm relative z-10">
                  <div className="flex gap-2"><span className="text-emerald-500">➜</span><span className="text-cyan-400">npm</span> i -g devsync</div>
                  <div className="text-emerald-500 pl-5">✓ Installed in 2.3s</div>
                  <div className="flex gap-2"><span className="text-emerald-500">➜</span><span className="text-white">devsync</span> init my-project</div>
                  <div className="text-emerald-500 pl-5">✓ Repo created globally</div>
                  <div className="flex gap-2"><span className="text-emerald-500">➜</span><span className="text-cyan-400">git</span> push origin main</div>
                  <div className="text-emerald-500 pl-5">✓ Pushed in 47ms 🚀</div>
                </div>
              </div>
            </motion.div>
          </ClientOnly>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 px-4 border-y border-emerald-500/20 bg-gradient-to-b from-transparent to-emerald-950/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gray-500 uppercase tracking-widest font-mono text-sm mb-8">Trusted by 150,000+ developers worldwide</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard value="150K+" label="Active Developers" icon={FiUsers} />
              <StatCard value="<50ms" label="Average Latency" icon={FiZap} />
              <StatCard value="99.99%" label="Uptime SLA" icon={FiActivity} />
              <StatCard value="10M+" label="Daily Commits" icon={FiGitCommit} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              Built for <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Performance</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to scale your development workflow with enterprise-grade security and lightning-fast speed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FiZap}
              title="Edge-Optimized CDN"
              description="Distributed globally across 200+ edge locations. Push and pull from the nearest node with <50ms latency worldwide."
            />
            <FeatureCard
              icon={FiLock}
              title="Zero-Knowledge Encryption"
              description="End-to-end encryption with zero-knowledge architecture. Your code is encrypted before it leaves your machine."
            />
            <FeatureCard
              icon={FiCpu}
              title="Parallel Processing"
              description="Multi-threaded git operations with intelligent caching. Handle monorepos 10x faster than traditional platforms."
            />
            <FeatureCard
              icon={FiShield}
              title="SOC 2 Type II Certified"
              description="Enterprise-grade compliance with SOC 2, GDPR, and ISO 27001. Built-in audit logs and access controls."
            />
            <FeatureCard
              icon={FiActivity}
              title="Real-Time Collaboration"
              description="Live code reviews, instant PR notifications, and real-time conflict detection. Ship faster as a team."
            />
            <FeatureCard
              icon={FiDatabase}
              title="Infinite Scalability"
              description="Auto-scaling infrastructure that grows with your team. From solo developer to Fortune 500 enterprises."
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 px-4 bg-gradient-to-b from-emerald-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              Loved by <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Developers</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of teams shipping faster with DevSync
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Alex Chen"
              company="Stripe"
              role="Engineering Lead"
              quote="DevSync reduced our CI/CD pipeline times by 70%. The edge network is incredibly fast, and the zero-knowledge encryption gives us peace of mind."
            />
            <TestimonialCard
              name="Sarah Martinez"
              company="Shopify"
              role="DevOps Engineer"
              quote="Migrating from GitHub took 30 minutes. The automation features are game-changing. We're shipping features 3x faster now."
            />
            <TestimonialCard
              name="James Park"
              company="Datadog"
              role="Security Architect"
              quote="SOC 2 compliance out of the box saved us months of work. The security features are enterprise-grade without the complexity."
            />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-3xl p-12 lg:p-16 border border-emerald-500/30"
          >
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              Ready to Ship Faster?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join 150,000+ developers using DevSync to build and deploy at lightning speed. Start your free trial today.
            </p>
            <motion.button
              onClick={() => window.location.href = "/login"}
              whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(16, 185, 129, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-emerald-500 text-black text-xl font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl border-2 border-emerald-400 font-mono tracking-wider inline-flex items-center gap-3"
            >
              <FiTerminal className="w-7 h-7" />
              Start Free Trial
              <FiArrowRight className="w-6 h-6" />
            </motion.button>
            <p className="text-sm text-gray-500 mt-6 font-mono">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-t from-black via-gray-950 to-transparent border-t-4 border-emerald-500/30 backdrop-blur-3xl shadow-2xl shadow-emerald-500/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
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

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="space-y-4">
              <h4 className="text-lg font-black text-white font-mono uppercase tracking-wider">Product</h4>
              {['Features', 'Pricing', 'CLI Tools', 'API', 'Changelog'].map((item, i) => (
                <a key={i} href="#" className="block text-gray-400 hover:text-emerald-400 transition-all duration-300 font-mono text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full scale-0 group-hover:scale-100 transition-transform opacity-0 group-hover:opacity-100" />
                  {item}
                </a>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="space-y-4">
              <h4 className="text-lg font-black text-white font-mono uppercase tracking-wider">Developers</h4>
              {['Documentation', 'GitHub', 'Discord', 'Status', 'Community'].map((item, i) => (
                <a key={i} href="#" className="block text-gray-400 hover:text-emerald-400 transition-all duration-300 font-mono text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full scale-0 group-hover:scale-100 transition-transform opacity-0 group-hover:opacity-100" />
                  {item}
                </a>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="space-y-6">
              <h4 className="text-lg font-black text-white font-mono uppercase tracking-wider">Company</h4>
              {['About', 'Blog', 'Careers', 'Security', 'Privacy'].map((item, i) => (
                <a key={i} href="#" className="block text-gray-400 hover:text-emerald-400 transition-all duration-300 font-mono text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full scale-0 group-hover:scale-100 transition-transform opacity-0 group-hover:opacity-100" />
                  {item}
                </a>
              ))}
              <div className="flex gap-4 pt-2">
                {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.2, rotate: 5 }} className="w-12 h-12 bg-gray-950/50 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-all shadow-lg">
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
