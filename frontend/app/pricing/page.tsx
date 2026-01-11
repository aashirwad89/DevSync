/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  FiTerminal, FiZap, FiUsers, FiCheckCircle, FiActivity, FiShield, 
  FiClock, FiDollarSign, FiStar, FiGitCommit, FiArrowRight 
} from 'react-icons/fi'

function Pricing() {
  const [mounted, setMounted] = useState(false)
  const [annualBilling, setAnnualBilling] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.classList.add('dark')
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-emerald-400 font-mono text-xl animate-pulse">Loading pricing...</div>
      </div>
    )
  }

  const plans = [
    {
      name: "Developer",
      price: annualBilling ? "₹999" : "₹1299",
      priceMonthly: "₹1299",
      popular: false,
      features: [
        "Unlimited public repos",
        "5 private repos",
        "50GB storage",
        "CI/CD minutes: 2000/mo",
        "GitHub/GitLab import",
        "Community support"
      ],
      limitFeatures: [
        "Team collaboration",
        "Advanced security",
        "Priority support"
      ]
    },
    {
      name: "Team", 
      price: annualBilling ? "₹2999" : "₹3999",
      priceMonthly: "₹3999",
      popular: true,
      features: [
        "Unlimited repos",
        "Unlimited teams",
        "500GB storage",
        "CI/CD minutes: 10K/mo",
        "GitHub/GitLab import",
        "Email support",
        "SAML SSO",
        "Audit logs"
      ],
      limitFeatures: [
        "Advanced analytics",
        "Custom runners",
        "24/7 support"
      ]
    },
    {
      name: "Enterprise",
      price: annualBilling ? "₹9999+" : "₹12999+",
      priceMonthly: "₹12999+",
      popular: false,
      features: [
        "Everything in Team",
        "Unlimited storage",
        "Unlimited CI/CD",
        "Custom runners",
        "SOC 2 compliance",
        "VPC deployment",
        "24/7 priority support",
        "Custom SLAs",
        "Dedicated account manager"
      ],
      limitFeatures: []
    }
  ]

  const PricingCard = ({ plan, index }: { plan: any, index: number }) => {
    const ref = React.useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className={`group relative overflow-hidden rounded-3xl p-1 ${
          plan.popular 
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/40' 
            : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40'
        }`}
      >
        <div className="bg-black/90 backdrop-blur-xl rounded-2xl p-8 h-full border border-white/10 hover:border-white/20 transition-all relative">
          {plan.popular && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-4 -right-4 bg-emerald-500 text-black px-6 py-2 rounded-bl-2xl rounded-tr-3xl font-bold text-sm font-mono transform rotate-3 shadow-lg"
            >
              Most Popular
            </motion.div>
          )}
          
          <div className="text-center mb-8">
            <h3 className="text-3xl font-black text-white mb-4 font-mono tracking-tight">{plan.name}</h3>
            {plan.popular && (
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl font-mono text-sm mb-4">
                <FiZap className="w-4 h-4" />
                Save 25% yearly
              </div>
            )}
            <div className="text-sm text-gray-400 mb-2 font-mono">per user/month</div>
            <div className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
              {plan.price}
            <span className="text-2xl font-normal text-gray-500">/mo</span>
            </div>
            <div className="text-xs text-gray-500 font-mono line-through opacity-60">
              {plan.priceMonthly} billed monthly
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {plan.features.map((feature: string, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-black/50 rounded-xl group/feature">
                <FiCheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 font-mono text-sm">{feature}</span>
              </div>
            ))}
            {plan.limitFeatures.map((feature: string, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-black/30 rounded-xl opacity-60">
                <FiCheckCircle className="w-6 h-6 text-gray-500 flex-shrink-0" />
                <span className="text-gray-500 font-mono text-sm line-through">{feature}</span>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 px-6 rounded-2xl font-mono font-bold uppercase tracking-wider text-lg transition-all shadow-xl ${
              plan.popular
                ? 'bg-white text-black shadow-emerald-500/50 hover:shadow-emerald-500/70 border-2 border-black'
                : 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50 hover:bg-emerald-500/30 hover:text-emerald-300 hover:border-emerald-500/80'
            }`}
          >
            {plan.name === 'Enterprise' ? 'Contact Sales' : 'Choose Plan'}
          </motion.button>

          {plan.popular && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 pt-6 border-t border-emerald-500/30 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-mono mb-2">
                <FiShield className="w-4 h-4" />
                14-day free trial
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-emerald-950 text-white overflow-hidden relative">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:100px_100px] opacity-50" />
      
      {/* Matrix Rain */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-500/20 font-mono text-xs"
            style={{ left: `${i * 5}%` }}
            animate={{ y: ['-100%', '100vh'] }}
            transition={{ 
              duration: 6 + Math.random() * 4, 
              repeat: Infinity, 
              ease: 'linear',
              delay: i * 0.1
            }}
          >
            01
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="backdrop-blur-xl bg-black/90 border-b border-emerald-500/30 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all">
                  <FiTerminal className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Pricing
                  </h1>
                  <div className="text-xs text-emerald-500/70 font-mono">Simple, transparent, powerful</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 font-mono">Annual:</span>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setAnnualBilling(false)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                      !annualBilling
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/50'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    Monthly
                  </motion.button>
                  <motion.button
                    onClick={() => setAnnualBilling(true)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                      annualBilling
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/50'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    Annual (25% off)
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-24 text-center max-w-4xl mx-auto px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent font-mono tracking-tight"
          >
            Predictable Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            No hidden fees. No usage limits. Choose the plan that grows with you.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 p-4 rounded-2xl border-2 border-emerald-500/30 text-emerald-400 font-mono text-sm"
          >
            <FiDollarSign className="w-5 h-5" />
            <span>14-day free trial on all plans • Cancel anytime</span>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="py-24 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <PricingCard key={plan.name} plan={plan} index={index} />
            ))}
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-24 bg-gradient-to-b from-black/50 to-emerald-950/20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-center mb-4 font-mono text-white"
            >
              Feature Comparison
            </motion.h2>
            <div className="overflow-x-auto mt-12">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-emerald-500/30">
                    <th className="text-left pb-6 pr-8 font-black text-emerald-400">Feature</th>
                    <th className="text-center pb-6 w-32 font-black text-gray-400">Developer</th>
                    <th className="text-center pb-6 w-32 font-black text-emerald-400/90">Team</th>
                    <th className="text-center pb-6 w-32 font-black text-gray-400">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/20">
                  {[
                    "Unlimited Public Repos", "Private Repos", "Storage", "CI/CD Minutes", 
                    "Team Collaboration", "SAML SSO", "SOC 2", "24/7 Support"
                  ].map((feature, i) => (
                    <tr key={i} className="h-16">
                      <td className="font-mono text-gray-400 pr-8 py-4">{feature}</td>
                      <td className="text-center py-4">
                        {feature === "Private Repos" ? "5" : feature.includes("Unlimited") ? "✓" : "2000/mo"}
                      </td>
                      <td className="text-center py-4 font-bold text-emerald-400">✓</td>
                      <td className="text-center py-4">✓</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 text-center max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-12 text-black shadow-2xl shadow-emerald-500/50"
          >
            <FiUsers className="w-24 h-24 mx-auto mb-8 opacity-80" />
            <h2 className="text-5xl font-black mb-6 font-mono tracking-tight">Join 150K+ developers</h2>
            <p className="text-2xl mb-12 font-mono leading-relaxed opacity-90">Start your 14-day free trial today</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="/login" className="px-12 py-6 bg-black text-emerald-400 font-black rounded-3xl hover:bg-white/20 transition-all font-mono text-xl shadow-2xl border-2 border-black tracking-wider">
                Start Free Trial →
              </a>
              <a href="/login" className="px-12 py-6 border-4 border-white/30 text-white font-black rounded-3xl hover:bg-white/10 transition-all font-mono text-xl tracking-wider">
                Talk to Sales
              </a>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t-4 border-emerald-500/30 py-16 px-6 bg-black/50 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto text-center text-gray-400 font-mono space-y-4">
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <FiZap className="w-5 h-5 text-emerald-400" />
                <span className="text-sm">Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="w-5 h-5 text-emerald-400" />
                <span className="text-sm">SOC 2 compliant</span>
              </div>
            </div>
            <p>© 2026 DevSync. Pricing designed for developers. <span className="text-emerald-500 font-black">♥</span></p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Pricing
