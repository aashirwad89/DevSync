/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  FiTerminal, FiZap, FiGitCommit, FiGitPullRequest, FiDatabase, FiLock, 
  FiCpu, FiActivity, FiUsers, FiShield, FiLayers, FiBox, FiClock, FiTarget
} from 'react-icons/fi'

function Features() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.classList.add('dark')
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-emerald-400 font-mono text-xl animate-pulse">Loading features...</div>
      </div>
    )
  }

  const features = [
    {
      icon: FiTerminal,
      title: "CLI-First Experience",
      description: "Lightning-fast terminal commands built for power users. SSH key management, webhooks, and automation scripts out of the box.",
      stats: "47ms avg • 99.99% uptime",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: FiZap,
      title: "Lightning Operations",
      description: "<50ms average response time across all Git operations. Smart caching, delta compression, and parallel processing.",
      stats: "150K+ devs • 5M+ commits",
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      icon: FiGitCommit,
      title: "Smart Code Review",
      description: "AI-powered suggestions, automated testing, and inline security scans. Review changes 3x faster with intelligent diffs.",
      stats: "70% faster CI/CD • SOC 2",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: FiDatabase,
      title: "Global Edge Network",
      description: "Geo-replicated storage with 200+ edge locations. Sub-second cloning worldwide, even for 10GB+ monorepos.",
      stats: "200+ locations • <1s clones",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: FiLock,
      title: "Zero-Trust Security",
      description: "End-to-end encryption, SAML SSO, granular permissions, and audit logs. Enterprise-grade from day one.",
      stats: "SOC 2 Type II • GDPR",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: FiCpu,
      title: "Native CI/CD",
      description: "Docker, Kubernetes, and cloud-native runners. Matrix builds, auto-scaling, and parallel testing included.",
      stats: "Unlimited runners • Matrix builds",
      gradient: "from-pink-500 to-rose-600"
    }
  ]

  const advancedFeatures = [
    {
      icon: FiLayers,
      title: "Monorepo Optimized",
      description: "Sparse checkout, partial clones, and lerna/nx/turborepo support. Built for massive codebases."
    },
    {
      icon: FiGitPullRequest,
      title: "Merge Queues",
      description: "Automated conflict resolution and branch protection. Required reviews and status checks."
    },
    {
      icon: FiBox,
      title: "Package Registry",
      description: "npm, Docker, Maven, PyPI hosting. Semantic versioning and dependency graphs."
    },
    {
      icon: FiActivity,
      title: "Real-time Analytics",
      description: "Commit graphs, contributor stats, and performance dashboards. Live metrics."
    }
  ]

  const FeatureCard = ({ feature, index }: { feature: any, index: number }) => {
    const ref = React.useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group"
      >
        <div className={`bg-gradient-to-br ${feature.gradient} p-1 rounded-3xl shadow-2xl shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-500`}>
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 h-full border border-white/10 hover:border-white/20 transition-all group-hover:bg-black/90">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all mx-auto">
              <feature.icon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 text-center font-mono tracking-tight">{feature.title}</h3>
            <p className="text-gray-300 mb-6 text-center leading-relaxed">{feature.description}</p>
            <div className="text-emerald-400 text-sm font-mono font-bold text-center bg-black/50 px-4 py-2 rounded-xl inline-block">
              {feature.stats}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      
      {/* Matrix Effect */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute text-emerald-500/30 font-mono text-xs"
            style={{ 
              left: `${i * 4}%`,
              animation: `matrix-rain ${4 + i % 3}s linear infinite`,
              animationDelay: `${i * 0.1}s`
            }}
          >
            01
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="backdrop-blur-xl bg-black/90 border-b border-emerald-500/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/30">
                  <FiTerminal className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    DevSync Features
                  </h1>
                  <div className="text-xs text-emerald-500/70 font-mono">Everything you need</div>
                </div>
              </div>
              <a href="/login" className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-all font-mono uppercase tracking-wider">
                Get Started →
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-24 text-center max-w-6xl mx-auto px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent tracking-tight font-mono"
          >
            Everything a developer needs
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-20"
          >
            Built by developers for developers. The fastest Git platform with enterprise-grade features.
          </motion.p>
          
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-sm mb-20 bg-black/50 px-6 py-3 rounded-2xl border border-emerald-500/30">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Trusted by 150K+ developers • 99.99% uptime
          </div>
        </section>

        {/* Main Features Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </section>

        {/* Advanced Features */}
        <section className="py-32 bg-gradient-to-b from-black/50 to-emerald-950/20">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-3 bg-emerald-500/10 p-4 rounded-2xl border-2 border-emerald-500/30 mb-8">
                <FiCpu className="w-6 h-6 text-emerald-400" />
                <span className="text-lg font-mono text-emerald-400 uppercase tracking-wider">Advanced</span>
              </div>
              <h2 className="text-5xl font-black text-white mb-6 font-mono">Power Features</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything else you did not know you needed</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advancedFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="group p-8 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 bg-black/50 backdrop-blur-xl"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                    <feature.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 font-mono">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-32 text-center">
          <div className="max-w-4xl mx-auto px-6 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "150K+", label: "Developers", icon: FiUsers },
                { value: "5M+", label: "Commits", icon: FiGitCommit },
                { value: "47ms", label: "Avg Latency", icon: FiZap },
                { value: "99.99%", label: "Uptime", icon: FiActivity }
              ].map(({ value, label, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <div className="text-4xl text-emerald-400 mb-4">
                    <Icon className="w-12 h-12 mx-auto" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2 font-mono">{value}</div>
                  <div className="text-gray-500 uppercase tracking-widest font-mono text-sm">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 text-center max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-black rounded-3xl p-12 shadow-2xl shadow-emerald-500/50"
          >
            <FiTerminal className="w-20 h-20 mx-auto mb-8 opacity-80" />
            <h2 className="text-5xl font-black mb-6 font-mono tracking-tight">Ready to ship faster?</h2>
            <p className="text-2xl text-black/80 mb-12 font-mono leading-relaxed">Join 150K+ developers building the future</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/login" className="px-10 py-4 bg-black text-emerald-400 font-black rounded-2xl hover:bg-white/20 transition-all font-mono uppercase tracking-wider text-lg shadow-xl">
                Start Free Trial →
              </a>
              <a href="#demo" className="px-10 py-4 border-2 border-white/50 text-white font-bold rounded-2xl hover:bg-white/10 transition-all font-mono uppercase tracking-wider text-lg">
                Watch Demo
              </a>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-emerald-500/20 py-12 px-6">
          <div className="max-w-7xl mx-auto text-center text-gray-500 font-mono text-sm">
            <p>© 2026 DevSync. Built for developers who ship fast. <span className="text-emerald-500 font-black">150K+</span> already onboarded.</p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes matrix-rain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  )
}

export default Features
