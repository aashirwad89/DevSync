'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  FiGitBranch, 
  FiGitPullRequest, 
  FiGitCommit, 
  FiAlertCircle, 
  FiTrash2, 
  FiRotateCcw,
  FiSun,
  FiMoon,
  FiCode,
  FiFolder,
  FiZap,
  FiUsers,
  FiShield,
  FiTrendingUp,
  FiCheckCircle,
  FiArrowRight,
  FiLayers,
  FiGitMerge,
  FiBox,
  FiClock,
  FiTarget,
  FiAward
} from 'react-icons/fi'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

interface Stat {
  value: string
  label: string
  icon: React.ReactNode
}

interface Step {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}

function Landing() {
  const [darkMode, setDarkMode] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const stats: Stat[] = [
    {
      value: "50K+",
      label: "Active Developers",
      icon: <FiUsers className="w-6 h-6" />
    },
    {
      value: "1M+",
      label: "Repositories Managed",
      icon: <FiFolder className="w-6 h-6" />
    },
    {
      value: "99.9%",
      label: "Uptime Guarantee",
      icon: <FiShield className="w-6 h-6" />
    },
    {
      value: "24/7",
      label: "Support Available",
      icon: <FiClock className="w-6 h-6" />
    }
  ]

  const features: Feature[] = [
    {
      icon: <FiFolder className="w-8 h-8" />,
      title: "Create & Manage Repositories",
      description: "Effortlessly create, organize, and manage unlimited repositories with our intuitive interface. Support for public and private repos.",
      color: "from-red-500 to-rose-600"
    },
    {
      icon: <FiGitCommit className="w-8 h-8" />,
      title: "Push & Pull Operations",
      description: "Seamlessly push your commits and pull latest changes with lightning-fast performance. Built for speed and reliability.",
      color: "from-rose-500 to-pink-600"
    },
    {
      icon: <FiGitPullRequest className="w-8 h-8" />,
      title: "Advanced Pull Requests",
      description: "Review code with inline comments, request changes, and merge with confidence. Collaborative code review made simple.",
      color: "from-red-600 to-orange-600"
    },
    {
      icon: <FiRotateCcw className="w-8 h-8" />,
      title: "Smart Revert System",
      description: "Made a mistake? Our intelligent revert system lets you rollback changes to any previous commit with just one click.",
      color: "from-orange-500 to-amber-600"
    },
    {
      icon: <FiAlertCircle className="w-8 h-8" />,
      title: "Issue Tracking & Management",
      description: "Raise, assign, label, and track issues with powerful filtering. Keep your projects organized and on schedule.",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: <FiTrash2 className="w-8 h-8" />,
      title: "Complete Repository Control",
      description: "Full control over your repos - delete, archive, transfer, or fork. Advanced permission management included.",
      color: "from-rose-600 to-red-700"
    },
    {
      icon: <FiGitMerge className="w-8 h-8" />,
      title: "Conflict Resolution",
      description: "Intelligent merge conflict detection and resolution tools. Visual diff viewer for easy comparison.",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: <FiLayers className="w-8 h-8" />,
      title: "Branch Management",
      description: "Create, merge, and manage branches effortlessly. Protected branches and automated workflows supported.",
      color: "from-pink-500 to-red-600"
    },
    {
      icon: <FiBox className="w-8 h-8" />,
      title: "Release Management",
      description: "Create releases, tag versions, and distribute binaries. Automated changelog generation included.",
      color: "from-orange-600 to-red-600"
    }
  ]

  const steps: Step[] = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up in seconds and get instant access to all features. No credit card required to start.",
      icon: <FiUsers className="w-10 h-10" />
    },
    {
      number: "02",
      title: "Initialize Repository",
      description: "Create your first repository or import existing projects from GitHub, GitLab, or Bitbucket.",
      icon: <FiGitBranch className="w-10 h-10" />
    },
    {
      number: "03",
      title: "Collaborate & Deploy",
      description: "Invite team members, review code, and deploy with integrated CI/CD pipelines.",
      icon: <FiTarget className="w-10 h-10" />
    }
  ]

  const ScrollSection = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 75 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 75 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? 'dark bg-gray-900' 
        : 'bg-gradient-to-br from-red-50 via-orange-50 to-rose-50'
    }`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-red-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 rounded-lg opacity-20 blur-md"
                />
                <div className="relative bg-gradient-to-br from-red-600 to-rose-700 p-2 rounded-lg">
                  <FiGitBranch className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 via-rose-600 to-red-700 bg-clip-text text-transparent">
                devSync
              </span>
            </motion.div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
                  How It Works
                </a>
                <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
                  Pricing
                </a>
              </div>
              
              <motion.button
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 rounded-full bg-gradient-to-br from-red-100 to-rose-100 dark:from-gray-800 dark:to-gray-700 hover:from-red-200 hover:to-rose-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all shadow-md"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <FiSun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <FiMoon className="w-5 h-5 text-red-700" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Scroll Animation */}
      <motion.section 
        ref={heroRef}
        style={{ opacity, scale }}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-200/30 to-rose-200/30 dark:from-red-900/20 dark:to-rose-900/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-200/30 to-red-200/30 dark:from-orange-900/20 dark:to-red-900/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 rounded-full border border-red-200 dark:border-red-800 shadow-lg">
              <FiZap className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                Next-Gen Version Control Platform
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Version Control
            <br />
            <span className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 bg-clip-text text-transparent">
              Reimagined for Teams
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Build, collaborate, and ship faster with devSync. A powerful Git-based platform 
            designed for modern development teams. Experience seamless code management with 
            advanced features and intuitive workflows.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(220, 38, 38, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all flex items-center gap-3 text-lg"
            >
              <FiCode className="w-6 h-6" />
              Get Started Free
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-red-200 dark:border-gray-700 flex items-center gap-3 text-lg"
            >
              <FiGitBranch className="w-6 h-6 text-red-600" />
              View Live Demo
            </motion.button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-red-100 dark:border-gray-700 shadow-lg"
              >
                <div className="flex justify-center mb-3 text-red-600 dark:text-red-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Animated Terminal */}
          <motion.div
            style={{ y }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl blur-2xl opacity-20" />
            <div className="relative bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-8 border border-red-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                <span className="ml-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                  terminal@devSync
                </span>
              </div>
              <code className="text-left block text-base text-gray-800 dark:text-gray-200 font-mono space-y-2">
                <div>
                  <span className="text-red-600 dark:text-red-400 font-bold">$</span> git clone https://devsync.dev/myproject.git
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  Cloning into myproject...
                </div>
                <div>
                  <span className="text-red-600 dark:text-red-400 font-bold">$</span> cd myproject && git checkout -b feature/awesome
                </div>
                <div className="text-green-600 dark:text-green-400 font-semibold">
                  ✓ Switched to a new branch feature/awesome
                </div>
                <div>
                  <span className="text-red-600 dark:text-red-400 font-bold">$</span> git push origin feature/awesome
                </div>
                <div className="text-green-600 dark:text-green-400 font-semibold">
                  ✓ Branch pushed successfully! PR created automatically.
                </div>
              </code>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section with Scroll Animations */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-50/50 to-transparent dark:via-red-900/5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollSection>
            <div className="text-center mb-20">
              <motion.div
                whileInView={{ scale: [0, 1] }}
                viewport={{ once: true }}
                className="inline-block mb-4"
              >
                <div className="px-4 py-2 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 rounded-full border border-red-200 dark:border-red-800">
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    POWERFUL FEATURES
                  </span>
                </div>
              </motion.div>
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Everything You Need to Build Better
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From repository management to deployment, devSync provides all the tools 
                your team needs to collaborate effectively and ship code faster.
              </p>
            </div>
          </ScrollSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollSection key={index}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="h-full p-8 bg-gradient-to-br from-white via-red-50/30 to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-red-100 dark:border-gray-700 hover:shadow-2xl hover:border-red-300 dark:hover:border-red-800 transition-all group"
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <ScrollSection>
            <div className="text-center mb-20">
              <motion.div
                whileInView={{ scale: [0, 1] }}
                viewport={{ once: true }}
                className="inline-block mb-4"
              >
                <div className="px-4 py-2 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 rounded-full border border-red-200 dark:border-red-800">
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    GET STARTED IN MINUTES
                  </span>
                </div>
              </motion.div>
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                How devSync Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Get up and running in three simple steps. No complex setup, no hidden costs.
              </p>
            </div>
          </ScrollSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-200 via-rose-300 to-red-200 dark:from-red-900/30 dark:via-rose-900/30 dark:to-red-900/30 transform -translate-y-1/2" />
            
            {steps.map((step, index) => (
              <ScrollSection key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-red-100 dark:border-gray-700 text-center"
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-red-600 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                    {step.number}
                  </div>
                  <div className="mt-8 mb-6 flex justify-center text-red-600 dark:text-red-400">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <ScrollSection>
            <div className="text-center mb-20">
              <motion.div
                whileInView={{ scale: [0, 1] }}
                viewport={{ once: true }}
                className="inline-block mb-4"
              >
                <div className="px-4 py-2 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 rounded-full border border-red-200 dark:border-red-800">
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    SIMPLE PRICING
                  </span>
                </div>
              </motion.div>
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Choose Your Plan
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Start free, upgrade when you need more. All plans include core features.
              </p>
            </div>
          </ScrollSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <ScrollSection>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
                  <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">$0</div>
                  <p className="text-gray-600 dark:text-gray-400">Perfect for individuals</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Unlimited public repos', '3 private repos', 'Basic issue tracking', 'Community support', '2GB storage'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <FiCheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  Get Started
                </button>
              </motion.div>
            </ScrollSection>

            {/* Pro Plan */}
            <ScrollSection>
              <motion.div
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-gradient-to-br from-red-600 via-rose-600 to-red-700 rounded-3xl p-10 shadow-2xl border-4 border-red-400 relative"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 rounded-full">
                  <span className="text-sm font-bold text-gray-900">POPULAR</span>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="text-5xl font-bold text-white mb-2">$19</div>
                  <p className="text-red-100">For professional developers</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Unlimited private repos', 'Advanced issue tracking', 'Priority support', 'CI/CD integration', '50GB storage', 'Team collaboration'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <FiCheckCircle className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all shadow-lg">
                  Start Free Trial
                </button>
              </motion.div>
            </ScrollSection>

            {/* Enterprise Plan */}
            <ScrollSection>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
                  <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">Custom</div>
                  <p className="text-gray-600 dark:text-gray-400">For large organizations</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'Unlimited storage', 'Advanced security'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <FiCheckCircle className="w-5 h-5 text-red-600" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-rose-700 transition-all">
                  Contact Sales
                </button>
              </motion.div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollSection>
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Loved by Developers Worldwide
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                See what our community has to say
              </p>
            </div>
          </ScrollSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rahul Sharma",
                role: "Senior Developer",
                company: "Tech Corp",
                content: "devSync has transformed how our team collaborates. The interface is intuitive and the performance is outstanding!",
                rating: 5
              },
              {
                name: "Priya Patel",
                role: "Lead Engineer",
                company: "StartupXYZ",
                content: "Best Git platform I've used. The issue tracking and PR system is phenomenal. Highly recommended!",
                rating: 5
              },
              {
                name: "Amit Kumar",
                role: "CTO",
                company: "DevCompany",
                content: "We migrated from GitHub and never looked back. devSync offers everything we need and more.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <ScrollSection key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-red-100 dark:border-gray-700"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiAward key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                    {testimonial.content}
                  </p>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </motion.div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 relative overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        
        <ScrollSection>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-2xl text-red-100 mb-10">
              Join 50,000+ developers building better software with devSync
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-white text-red-600 font-bold rounded-xl shadow-2xl hover:shadow-white/50 transition-all text-lg flex items-center gap-3 justify-center"
              >
                <FiCode className="w-6 h-6" />
                Start Building Today
                <FiArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg"
              >
                Schedule a Demo
              </motion.button>
            </div>
            <p className="mt-8 text-red-100">
              No credit card required • Free forever plan available
            </p>
          </div>
        </ScrollSection>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-red-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-red-600 to-rose-700 p-2 rounded-lg">
                  <FiGitBranch className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  devSync
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Next-generation version control for modern development teams.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-red-100 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
            <p>© 2026 devSync. Built with ❤️ for developers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
