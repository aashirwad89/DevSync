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
  FiAward,
  FiStar,
  FiMail
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

interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  rating: number
}

function Landing() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100])

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

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
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <FiGitCommit className="w-8 h-8" />,
      title: "Push & Pull Operations",
      description: "Seamlessly push your commits and pull latest changes with lightning-fast performance. Built for speed and reliability.",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: <FiGitPullRequest className="w-8 h-8" />,
      title: "Advanced Pull Requests",
      description: "Review code with inline comments, request changes, and merge with confidence. Collaborative code review made simple.",
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: <FiRotateCcw className="w-8 h-8" />,
      title: "Smart Revert System",
      description: "Made a mistake? Our intelligent revert system lets you rollback changes to any previous commit with just one click.",
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: <FiAlertCircle className="w-8 h-8" />,
      title: "Issue Tracking & Management",
      description: "Raise, assign, label, and track issues with powerful filtering. Keep your projects organized and on schedule.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <FiTrash2 className="w-8 h-8" />,
      title: "Complete Repository Control",
      description: "Full control over your repos - delete, archive, transfer, or fork. Advanced permission management included.",
      color: "from-cyan-600 to-blue-700"
    },
    {
      icon: <FiGitMerge className="w-8 h-8" />,
      title: "Conflict Resolution",
      description: "Intelligent merge conflict detection and resolution tools. Visual diff viewer for easy comparison.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: <FiLayers className="w-8 h-8" />,
      title: "Branch Management",
      description: "Create, merge, and manage branches effortlessly. Protected branches and automated workflows supported.",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: <FiBox className="w-8 h-8" />,
      title: "Release Management",
      description: "Create releases, tag versions, and distribute binaries. Automated changelog generation included.",
      color: "from-indigo-600 to-blue-600"
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

  const testimonials: Testimonial[] = [
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
    <div className="min-h-screen dark bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800 shadow-sm">
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
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg opacity-20 blur-md"
                />
                <div className="relative bg-gradient-to-br from-blue-600 to-cyan-700 p-2 rounded-lg">
                  <FiGitBranch className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                devSync
              </span>
            </motion.div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                  How It Works
                </a>
                <a href="#pricing" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                  Pricing
                </a>
              </div>
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
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-900/20 to-blue-900/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-full border border-blue-800 shadow-lg">
              <FiZap className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">
                Next-Gen Version Control Platform
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight"
          >
            Version Control
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Reimagined for Teams
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
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
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center gap-3 text-lg"
            >
              <FiCode className="w-6 h-6" />
              Get Started Free
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-gray-800 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-gray-700 flex items-center gap-3 text-lg"
            >
              <FiGitBranch className="w-6 h-6 text-blue-400" />
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
                className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-lg"
              >
                <div className="flex justify-center mb-3 text-blue-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 font-medium">
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl blur-2xl opacity-20" />
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                <div className="w-4 h-4 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50"></div>
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                <span className="ml-4 text-sm font-semibold text-gray-400">
                  terminal@devSync
                </span>
              </div>
              <code className="text-left block text-base text-gray-200 font-mono space-y-2">
                <div>
                  <span className="text-blue-400 font-bold">$</span> git clone https://devsync.dev/myproject.git
                </div>
                <div className="text-gray-400">
                  Cloning into myproject...
                </div>
                <div>
                  <span className="text-blue-400 font-bold">$</span> cd myproject && git checkout -b feature/awesome
                </div>
                <div className="text-green-400 font-semibold">
                  ✓ Switched to a new branch feature/awesome
                </div>
                <div>
                  <span className="text-blue-400 font-bold">$</span> git push origin feature/awesome
                </div>
                <div className="text-green-400 font-semibold">
                  ✓ Branch pushed successfully! PR created automatically.
                </div>
              </code>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section with Scroll Animations */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollSection>
            <div className="text-center mb-20">
              <motion.div
                whileInView={{ scale: [0, 1] }}
                viewport={{ once: true }}
                className="inline-block mb-4"
              >
                <div className="px-4 py-2 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-full border border-blue-800">
                  <span className="text-sm font-semibold text-blue-400">
                    POWERFUL FEATURES
                  </span>
                </div>
              </motion.div>
              <h2 className="text-5xl font-bold text-white mb-6">
                Everything You Need to Build Better
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
                  className="h-full p-8 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 hover:shadow-2xl hover:border-blue-800 transition-all group"
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
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
                <div className="px-4 py-2 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-full border border-blue-800">
                  <span className="text-sm font-semibold text-blue-400">
                    GET STARTED IN MINUTES
                  </span>
                </div>
              </motion.div>
              <h2 className="text-5xl font-bold text-white mb-6">
                How devSync Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get up and running in three simple steps. No complex setup, no hidden costs.
              </p>
            </div>
          </ScrollSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-900/30 via-cyan-900/30 to-blue-900/30 transform -translate-y-1/2" />
            
            {steps.map((step, index) => (
              <ScrollSection key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 text-center"
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                    {step.number}
                  </div>
                  <div className="mt-8 mb-6 flex justify-center text-blue-400">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <ScrollSection>
            <div className="text-center mb-20">
              <motion.div
                whileInView={{ scale: [0, 1] }}
                viewport={{ once: true }}
                className="inline-block mb-4"
              >
                <div className="px-4 py-2 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-full border border-blue-800">
                  <span className="text-sm font-semibold text-blue-400">
                    SIMPLE PRICING
                  </span>
                </div>
              </motion.div>
              <h2 className="text-5xl font-bold text-white mb-6">
                Choose Your Plan
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Start free, upgrade when you need more. All plans include core features.
              </p>
            </div>
          </ScrollSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <ScrollSection>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-gray-800 rounded-3xl p-10 shadow-xl border border-gray-700"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                  <div className="text-5xl font-bold text-white mb-2">$0</div>
                  <p className="text-gray-400">Perfect for individuals</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Unlimited public repos', '3 private repos', 'Basic issue tracking', 'Community support', '2GB storage'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <FiCheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all">
                  Get Started
                </button>
              </motion.div>
            </ScrollSection>

            {/* Pro Plan */}
            <ScrollSection>
              <motion.div
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-3xl p-10 shadow-2xl border-4 border-blue-400 relative"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 rounded-full">
                  <span className="text-sm font-bold text-gray-900">POPULAR</span>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="text-5xl font-bold text-white mb-2">$19</div>
                  <p className="text-blue-100">For professional developers</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Unlimited private repos', 'Advanced issue tracking', 'Priority support', 'CI/CD integration', '50GB storage', 'Team collaboration'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <FiCheckCircle className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg">
                  Start Free Trial
                </button>
              </motion.div>
            </ScrollSection>

            {/* Enterprise Plan */}
            <ScrollSection>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-gray-800 rounded-3xl p-10 shadow-xl border border-gray-700"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                  <div className="text-5xl font-bold text-white mb-2">Custom</div>
                  <p className="text-gray-400">For large organizations</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'Unlimited storage', 'Advanced security'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <FiCheckCircle className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all">
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
              <h2 className="text-5xl font-bold text-white mb-6">
                Loved by Developers Worldwide
              </h2>
              <p className="text-xl text-gray-300">
                See what our community has to say
              </p>
            </div>
          </ScrollSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollSection key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-bold">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                </motion.div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-blue-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollSection>
            <motion.div
              whileInView={{ scale: [0, 1] }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mb-6">
                <FiZap className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of developers who are already building better software with devSync. 
              Start your free trial today, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-3 text-lg"
              >
                <FiCode className="w-6 h-6" />
                Start Free Trial
                <FiArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gray-800 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all border-2 border-gray-700 flex items-center justify-center gap-3 text-lg"
              >
                <FiMail className="w-6 h-6" />
                Contact Sales
              </motion.button>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-700 p-2 rounded-lg">
                  <FiGitBranch className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  devSync
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Next-generation version control platform built for modern development teams.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 devSync. All rights reserved. Built with ❤️ for developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
