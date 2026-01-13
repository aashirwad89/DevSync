/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FiHome, FiBookOpen, FiCode, FiZap, FiShield, FiUsers, 
  FiSearch, FiMenu, FiChevronRight, FiDownload, FiStar, FiTerminal,
  FiGitBranch, FiLock, FiServer, FiAlertCircle, FiCheckCircle, FiSettings,
  FiCpu, FiDatabase, FiGlobe, FiPackage, FiTool
} from 'react-icons/fi'

function DocsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('introduction')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-emerald-400 text-2xl font-bold animate-pulse">
          Loading Documentation...
        </div>
      </div>
    )
  }

  const docsSections = [
    { id: 'introduction', title: 'Introduction', icon: FiBookOpen },
    { id: 'quick-start', title: 'Quick Start', icon: FiZap },
    { id: 'commands', title: 'Commands', icon: FiCode },
    { id: 'api', title: 'API Reference', icon: FiServer },
    { id: 'deployment', title: 'Deployment', icon: FiDownload },
    { id: 'security', title: 'Security', icon: FiShield },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: FiAlertCircle },
  ]

  const IntroductionContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-3xl p-12 border border-emerald-500/20">
        <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6">
          Welcome to DevSync Documentation
        </h2>
        <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
          DevSync is the next-generation Git hosting platform built for speed, security, and developer happiness. 
          This documentation will guide you through installation, usage, and advanced features.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="group bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <FiDownload className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Get Started</h3>
          </div>
          <div className="space-y-3 text-lg">
            <code className="block bg-slate-900 p-4 rounded-xl font-mono text-emerald-400">npm i -g devsync</code>
            <p className="text-gray-300">Install CLI globally in 30 seconds</p>
          </div>
        </div>
        
        <div className="group bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center">
              <FiStar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">47ms Pushes</h3>
          </div>
          <div className="space-y-3 text-lg">
            <code className="block bg-slate-900 p-4 rounded-xl font-mono text-teal-400">git push origin main</code>
            <p className="text-gray-300">Lightning fast Git operations</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <FiCheckCircle className="w-7 h-7 text-emerald-400" />
          Key Features
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: FiZap, title: 'Blazing Fast', desc: 'Sub-50ms response times' },
            { icon: FiShield, title: 'Enterprise Security', desc: 'SOC 2 Type II certified' },
            { icon: FiGlobe, title: 'Global CDN', desc: 'Deploy to 200+ locations' }
          ].map((feature, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <feature.icon className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const QuickStartContent = () => (
    <div className="max-w-4xl space-y-12">
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl p-12 border border-emerald-500/20">
        <h2 className="text-4xl font-black text-emerald-400 mb-8">3 Commands to Start</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', cmd: 'npm i -g devsync', desc: 'Install CLI', icon: FiDownload },
            { step: '2', cmd: 'devsync login', desc: 'Authenticate', icon: FiLock },
            { step: '3', cmd: 'devsync init my-app', desc: 'Create repo', icon: FiGitBranch }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-emerald-400/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl font-black text-emerald-400">{item.step}</div>
                <item.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <code className="block bg-slate-900/80 p-6 rounded-xl text-lg font-bold mb-4 text-emerald-400">{item.cmd}</code>
              <p className="text-gray-300 text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
        <h3 className="text-2xl font-bold text-white mb-6">First Repository</h3>
        <div className="space-y-4">
          <div className="bg-slate-900/80 p-6 rounded-xl">
            <code className="text-emerald-400 font-mono">
              <div># Initialize a new project</div>
              <div>devsync init my-awesome-project</div>
              <div className="mt-2"># Add your files</div>
              <div>git add .</div>
              <div>git commit -m Initial commit</div>
              <div className="mt-2"># Push to DevSync</div>
              <div>git push devsync main</div>
            </code>
          </div>
        </div>
      </div>
    </div>
  )

  const CommandsContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl p-12 border border-emerald-500/20">
        <h2 className="text-4xl font-black text-emerald-400 mb-4">CLI Commands</h2>
        <p className="text-xl text-gray-300">Complete reference for DevSync CLI</p>
      </div>

      <div className="space-y-6">
        {[
          { 
            cmd: 'devsync init [name]',
            desc: 'Initialize a new DevSync repository',
            example: 'devsync init my-project',
            options: ['--private', '--template <name>', '--org <org-name>']
          },
          { 
            cmd: 'devsync login',
            desc: 'Authenticate with DevSync',
            example: 'devsync login',
            options: ['--token <token>', '--sso']
          },
          { 
            cmd: 'devsync clone <repo>',
            desc: 'Clone a repository from DevSync',
            example: 'devsync clone username/repo',
            options: ['--depth <n>', '--branch <name>']
          },
          { 
            cmd: 'devsync deploy',
            desc: 'Deploy your application',
            example: 'devsync deploy --env production',
            options: ['--env <environment>', '--build-cmd <cmd>', '--no-cache']
          },
          { 
            cmd: 'devsync status',
            desc: 'Check deployment and repository status',
            example: 'devsync status',
            options: ['--json', '--verbose']
          },
        ].map((command, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <FiTerminal className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <code className="text-xl font-bold text-emerald-400 block mb-2">{command.cmd}</code>
                <p className="text-gray-300 mb-4">{command.desc}</p>
                
                <div className="bg-slate-900/80 p-4 rounded-xl mb-4">
                  <div className="text-sm text-gray-500 mb-1">Example:</div>
                  <code className="text-teal-400 font-mono">{command.example}</code>
                </div>

                {command.options && (
                  <div>
                    <div className="text-sm font-semibold text-gray-400 mb-2">Options:</div>
                    <div className="flex flex-wrap gap-2">
                      {command.options.map((opt, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-900/60 rounded-lg text-sm text-emerald-400 font-mono">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const APIContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl p-12 border border-emerald-500/20">
        <h2 className="text-4xl font-black text-emerald-400 mb-4">API Reference</h2>
        <p className="text-xl text-gray-300">REST API endpoints and authentication</p>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <FiLock className="w-7 h-7 text-emerald-400" />
          Authentication
        </h3>
        <p className="text-gray-300 mb-6">All API requests require authentication using Bearer tokens.</p>
        
        <div className="bg-slate-900/80 p-6 rounded-xl">
          <code className="text-emerald-400 font-mono">
            <div>curl -H Authorization: Bearer YOUR_TOKEN \</div>
            <div className="ml-4">https://api.devsync.dev/v1/repos</div>
          </code>
        </div>
      </div>

      <div className="space-y-6">
        {[
          {
            method: 'GET',
            endpoint: '/v1/repos',
            desc: 'List all repositories',
            response: '{ "repos": [...] }'
          },
          {
            method: 'POST',
            endpoint: '/v1/repos',
            desc: 'Create a new repository',
            response: '{ "id": "...", "name": "..." }'
          },
          {
            method: 'GET',
            endpoint: '/v1/repos/:id',
            desc: 'Get repository details',
            response: '{ "id": "...", "name": "...", "private": true }'
          },
          {
            method: 'DELETE',
            endpoint: '/v1/repos/:id',
            desc: 'Delete a repository',
            response: '{ "success": true }'
          },
        ].map((endpoint, idx) => (
          <div key={idx} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-4 py-2 rounded-lg font-bold text-sm ${
                endpoint.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' :
                endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {endpoint.method}
              </span>
              <code className="text-lg text-white font-mono">{endpoint.endpoint}</code>
            </div>
            <p className="text-gray-300 mb-4">{endpoint.desc}</p>
            <div className="bg-slate-900/80 p-4 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Response:</div>
              <code className="text-teal-400 font-mono text-sm">{endpoint.response}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const DeploymentContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl p-12 border border-emerald-500/20">
        <h2 className="text-4xl font-black text-emerald-400 mb-4">Deployment Guide</h2>
        <p className="text-xl text-gray-300">Deploy your applications with zero configuration</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          {
            title: 'Automatic Deployments',
            icon: FiZap,
            desc: 'Push to main branch and deploy automatically',
            color: 'emerald'
          },
          {
            title: 'Custom Domains',
            icon: FiGlobe,
            desc: 'Connect your own domain in seconds',
            color: 'teal'
          },
          {
            title: 'Environment Variables',
            icon: FiSettings,
            desc: 'Manage secrets and configuration',
            color: 'emerald'
          },
          {
            title: 'CI/CD Pipeline',
            icon: FiCpu,
            desc: 'Automated testing and deployment',
            color: 'teal'
          }
        ].map((feature, idx) => (
          <div key={idx} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-emerald-500/30 transition-all">
            <div className={`w-12 h-12 bg-${feature.color}-500 rounded-2xl flex items-center justify-center mb-4`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
        <h3 className="text-2xl font-bold text-white mb-6">Deployment Configuration</h3>
        <div className="bg-slate-900/80 p-6 rounded-xl">
          <code className="text-emerald-400 font-mono text-sm">
            <div># devsync.config.js</div>
            <div className="mt-2">module.exports = {'{'}</div>
            <div className="ml-4">buildCommand: npm run build,</div>
            <div className="ml-4">outputDirectory: dist,</div>
            <div className="ml-4">installCommand: npm install,</div>
            <div className="ml-4">framework: react,</div>
            <div className="ml-4">nodeVersion: 18.x</div>
            <div>{'}'}</div>
          </code>
        </div>
      </div>
    </div>
  )

  const SecurityContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl p-12 border border-emerald-500/20">
        <h2 className="text-4xl font-black text-emerald-400 mb-4">Security</h2>
        <p className="text-xl text-gray-300">Enterprise-grade security features</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          {
            title: 'Two-Factor Authentication',
            icon: FiLock,
            desc: 'Secure your account with 2FA',
            features: ['TOTP support', 'SMS backup codes', 'Hardware keys']
          },
          {
            title: 'SSH Key Management',
            icon: FiShield,
            desc: 'Manage SSH keys for secure access',
            features: ['ED25519 keys', 'Key rotation', 'Audit logs']
          },
          {
            title: 'Access Control',
            icon: FiUsers,
            desc: 'Fine-grained permissions',
            features: ['Role-based access', 'Team management', 'IP whitelisting']
          },
          {
            title: 'Compliance',
            icon: FiCheckCircle,
            desc: 'Industry certifications',
            features: ['SOC 2 Type II', 'GDPR compliant', 'ISO 27001']
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4">
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-gray-300 mb-4">{item.desc}</p>
            <ul className="space-y-2">
              {item.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                  <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
        <h3 className="text-2xl font-bold text-white mb-6">Security Best Practices</h3>
        <div className="space-y-4">
          {[
            'Always use SSH keys instead of passwords',
            'Enable two-factor authentication on your account',
            'Regularly rotate access tokens and API keys',
            'Use environment variables for sensitive data',
            'Keep your dependencies up to date',
            'Review access logs regularly'
          ].map((practice, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <FiCheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300">{practice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const TroubleshootingContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl p-12 border border-emerald-500/20">
        <h2 className="text-4xl font-black text-emerald-400 mb-4">Troubleshooting</h2>
        <p className="text-xl text-gray-300">Common issues and solutions</p>
      </div>

      <div className="space-y-6">
        {[
          {
            problem: 'Authentication Failed',
            solution: 'Make sure your access token is valid and has not expired. Try running `devsync login` again.',
            commands: ['devsync logout', 'devsync login']
          },
          {
            problem: 'Push Rejected',
            solution: 'Your local branch is behind the remote. Pull the latest changes first.',
            commands: ['git pull devsync main', 'git push devsync main']
          },
          {
            problem: 'Build Failed',
            solution: 'Check your build logs for errors. Ensure all dependencies are installed.',
            commands: ['devsync logs build', 'npm install', 'devsync deploy --no-cache']
          },
          {
            problem: 'Slow Performance',
            solution: 'Try clearing your cache and optimizing your repository size.',
            commands: ['git gc', 'devsync cache clear']
          },
          {
            problem: 'Permission Denied',
            solution: 'Verify you have the correct access rights to the repository.',
            commands: ['devsync repo permissions', 'devsync team list']
          }
        ].map((issue, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
          >
            <div className="flex items-start gap-4 mb-4">
              <FiAlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{issue.problem}</h3>
                <p className="text-gray-300 mb-4">{issue.solution}</p>
                
                {issue.commands && (
                  <div className="bg-slate-900/80 p-4 rounded-xl">
                    <div className="text-sm text-gray-500 mb-2">Solution commands:</div>
                    <div className="space-y-1">
                      {issue.commands.map((cmd, i) => (
                        <code key={i} className="block text-emerald-400 font-mono text-sm">
                          {cmd}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <FiUsers className="w-7 h-7 text-emerald-400" />
          Need More Help?
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <a href="#" className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900/80 transition-colors">
            <FiBookOpen className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="font-semibold text-white">Documentation</div>
              <div className="text-sm text-gray-400">Read full guides</div>
            </div>
          </a>
          <a href="#" className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900/80 transition-colors">
            <FiUsers className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="font-semibold text-white">Community</div>
              <div className="text-sm text-gray-400">Join Discord</div>
            </div>
          </a>
          <a href="#" className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900/80 transition-colors">
            <FiShield className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="font-semibold text-white">Support</div>
              <div className="text-sm text-gray-400">Contact us</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    const contents = {
      introduction: <IntroductionContent />,
      'quick-start': <QuickStartContent />,
      commands: <CommandsContent />,
      api: <APIContent />,
      deployment: <DeploymentContent />,
      security: <SecurityContent />,
      troubleshooting: <TroubleshootingContent />
    }
    return contents[activeSection as keyof typeof contents] || <div>Select a section</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/10 to-slate-950 text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div className="relative z-10">
        {/* Top Navigation */}
        <nav className="backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <FiTerminal className="w-7 h-7 text-black relative z-10" />
                </div>
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">
                    DevSync Docs
                  </h1>
                  <span className="text-sm text-slate-400 font-mono">v2.1.0</span>
                </div>
              </Link>
              
              <div className="flex items-center gap-4">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-6 py-3 rounded-xl hover:bg-slate-800/50"
                >
                  <FiHome className="w-5 h-5" />
                  Home
                </Link>
                <div className="hidden md:block">
                  <div className="relative">
                    <FiSearch className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search docs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-6 py-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none w-80"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex max-w-7xl mx-auto">
          {/* Sidebar */}
          <aside className={`w-80 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/50 transform transition-transform ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static h-[calc(100vh-100px)] md:h-auto top-24 md:top-0 z-40 overflow-auto shadow-2xl`}>
            <nav className="p-8 space-y-2">
              {docsSections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id)
                    setMobileNavOpen(false)
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-4 p-6 rounded-2xl text-left transition-all group ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 hover:border-slate-700/50 border border-transparent'
                  }`}
                >
                  <section.icon className="w-6 h-6 flex-shrink-0" />
                  <span className="font-medium text-lg">{section.title}</span>
                  {activeSection === section.id && (
                    <FiChevronRight className="w-5 h-5 ml-auto text-emerald-400" />
                  )}
                </motion.button>
              ))}
            </nav>
          </aside>

          {/* Mobile menu button */}
          <button
            className="md:hidden fixed top-32 left-6 z-50 p-3 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-emerald-500/50"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <FiMenu className={`w-6 h-6 transition-colors ${mobileNavOpen ? 'text-emerald-400' : 'text-slate-400'}`} />
          </button>

          {/* Mobile overlay */}
          {mobileNavOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-h-[calc(100vh-100px)] p-12 md:pl-0 md:pr-12">
            <div className="max-w-6xl mx-auto">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </div>
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 mt-24 pt-12 pb-8">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <p className="text-slate-500 text-lg">
              © 2026 DevSync Documentation. Made with ❤️ for developers.
            </p>
            <p className="text-sm text-slate-600 mt-2 font-mono">
              Last updated: January 13, 2026
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default DocsPage