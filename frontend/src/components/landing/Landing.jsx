/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Github, Twitter, Linkedin, Mail, ArrowRight, Zap, Code2, Users, Shield, Rocket, GitBranch } from 'lucide-react';

const commands = [
  { cmd: 'devsync init', desc: 'Initialize a new repository' },
  { cmd: 'devsync add .', desc: 'Stage all changes' },
  { cmd: 'devsync commit -m "feat: init"', desc: 'Commit with message' },
  { cmd: 'devsync push origin main', desc: 'Push to remote' },
  { cmd: 'devsync pull origin main', desc: 'Pull latest changes' },
  { cmd: 'devsync revert HEAD~1', desc: 'Revert last commit' },
];

const features = [
  {
    icon: <Code2 className="w-8 h-8" />,
    title: 'Smart Repository Management',
    desc: 'Lightning-fast repository creation and management. Version control built for developers, by developers.',
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Instant Sync',
    desc: 'Push and pull with zero latency. Real-time collaboration that keeps your team perfectly synchronized.',
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    icon: <GitBranch className="w-8 h-8" />,
    title: 'Advanced Branching',
    desc: 'Powerful branching strategies. Revert mistakes in milliseconds. Complete control over your timeline.',
    gradient: 'from-teal-500/20 to-green-500/20',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Enterprise Security',
    desc: 'Bank-grade encryption. Compliance-ready. Your code stays safe with military-grade protection.',
    gradient: 'from-green-500/20 to-cyan-500/20',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Team Collaboration',
    desc: 'Built-in issue tracking, reviews, and discussions. Keep your team aligned and shipping faster.',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: 'Deploy in Seconds',
    desc: 'One-click deployments. CI/CD pipelines that actually work. Ship code with confidence.',
    gradient: 'from-cyan-500/20 to-emerald-500/20',
  },
];

const stats = [
  { number: '50K+', label: 'Active Developers' },
  { number: '1M+', label: 'Repos Managed' },
  { number: '99.99%', label: 'Uptime' },
  { number: '10ms', label: 'Avg Sync Time' },
];

function TerminalTyper() {
  const [cmdIndex, setCmdIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    const current = commands[cmdIndex].cmd;

    if (phase === 'typing') {
      if (charIndex < current.length) {
        const t = setTimeout(() => {
          setTyped(current.slice(0, charIndex + 1));
          setCharIndex(c => c + 1);
        }, 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('clearing'), 2000);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'clearing') {
      if (typed.length > 0) {
        const t = setTimeout(() => {
          setTyped(t => t.slice(0, -1));
        }, 30);
        return () => clearTimeout(t);
      } else {
        setCharIndex(0);
        setCmdIndex(i => (i + 1) % commands.length);
        setPhase('typing');
      }
    }
  }, [phase, charIndex, typed, cmdIndex]);

  return (
    <div className="relative group max-w-3xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-green-500/10 to-emerald-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      
      <div className="relative bg-gray-950/80 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl hover:border-emerald-400/50 transition-all duration-300">
        <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-900/80 to-gray-900/40 border-b border-emerald-500/20">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60 shadow-lg shadow-red-500/40"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/60 shadow-lg shadow-yellow-500/40"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/60 shadow-lg shadow-green-500/40"></div>
          </div>
          <span className="text-gray-400 text-xs font-mono ml-2">~/devsync-project</span>
        </div>

        <div className="p-8 font-mono text-sm min-h-48 bg-gradient-to-br from-gray-950/60 via-gray-950 to-gray-900/40">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-green-400 text-xl">❯</span>
            <span className="text-gray-100 text-base tracking-tight font-medium">{typed}</span>
            <span className="w-2 h-6 bg-gradient-to-b from-green-400 to-emerald-400 animate-pulse rounded-sm"></span>
          </div>
          <p className="text-gray-500 text-xs mt-6 ml-7 opacity-70 font-light leading-relaxed">
            {commands[cmdIndex].desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function GradientOrb({ color = 'emerald', size = 'large' }) {
  const sizes = {
    large: 'w-96 h-96',
    medium: 'w-80 h-80',
    small: 'w-60 h-60',
  };

  const colors = {
    emerald: 'from-emerald-500 via-green-500 to-teal-500',
    green: 'from-green-500 via-emerald-500 to-cyan-500',
    cyan: 'from-cyan-500 via-green-500 to-emerald-500',
  };

  return (
    <div className={`absolute ${sizes[size]} bg-gradient-to-r ${colors[color]} rounded-full blur-3xl opacity-5 animate-pulse`}></div>
  );
}

function Landing() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / totalScroll) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-950/95 to-gray-900 text-white overflow-hidden">
      
      {/* Scroll progress bar */}
      <div 
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 z-50 transition-all duration-300 shadow-lg shadow-green-500/50"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <GradientOrb color="emerald" size="large" />
        <div className="absolute top-1/3 right-0">
          <GradientOrb color="green" size="medium" />
        </div>
        <div className="absolute bottom-1/3 left-1/4">
          <GradientOrb color="cyan" size="small" />
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-gray-950/40 border-b border-emerald-500/20 px-8 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center font-black text-gray-950 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 shadow-lg shadow-green-500/40">
            ◆
          </div>
          <span className="text-white font-black text-lg tracking-widest uppercase bg-gradient-to-r from-green-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">DevSync</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-gray-400 text-sm">
          <a href="#features" className="hover:text-green-300 transition-colors duration-200 relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
          </a>
          <a href="#commands" className="hover:text-green-300 transition-colors duration-200 relative group">
            Commands
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
          </a>
          <a href="#stats" className="hover:text-green-300 transition-colors duration-200 relative group">
            Stats
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a href="/auth" className="text-gray-400 hover:text-green-300 text-sm transition-colors duration-200 px-4 py-2">
            Sign in
          </a>
          <a href="/signup" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-gray-950 font-black text-sm px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-green-500/40 hover:shadow-green-500/60 hover:scale-105">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-8 pt-40 pb-32 text-center overflow-hidden">
        
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(5,150,105,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(5,150,105,0.03)_1px,transparent_1px)] bg-[size:5rem_5rem]"></div>
        </div>

        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/40 text-green-300 text-xs px-5 py-3 rounded-full mb-10 tracking-widest uppercase backdrop-blur-sm hover:border-green-400/60 transition-all duration-300 group animate-fade-in shadow-lg shadow-green-500/10">
          <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/60"></span>
          Git-Inspired Version Control for Teams
        </div>

        <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-none mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Code. Ship.<br />
          <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">Dominate.</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-16 leading-relaxed animate-fade-in font-light" style={{ animationDelay: '0.2s' }}>
          DevSync is the modern developer platform for teams that want to collaborate faster, ship smarter, and build better software. Trusted by 50K+ developers worldwide.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-32 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <a href="/signup" className="group relative bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 hover:from-green-400 hover:via-emerald-400 hover:to-green-400 text-gray-950 font-black px-9 py-4 rounded-xl text-sm uppercase tracking-widest transition-all duration-200 shadow-lg shadow-green-500/50 hover:shadow-green-500/70 hover:scale-105 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Start Building Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          <a href="#commands" className="border-2 border-green-500/40 hover:border-green-400/70 text-gray-300 hover:text-green-300 px-9 py-4 rounded-xl text-sm uppercase tracking-widest transition-all duration-200 hover:bg-green-500/5 backdrop-blur-sm font-semibold">
            View Commands
          </a>
        </div>

        {/* Terminal */}
        <TerminalTyper />
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative max-w-7xl mx-auto px-8 py-24 border-y border-emerald-500/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group cursor-pointer">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative max-w-7xl mx-auto px-8 py-32">
        <div className="text-center mb-24">
          <p className="text-green-400 text-xs uppercase tracking-widest mb-4 font-bold">Crafted for Developers</p>
          <h2 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Everything you need to<br />
            <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">build great software</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Powerful features designed by developers for developers. No bloat, no complexity—just what you need.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="group relative bg-gray-900/40 border border-emerald-500/20 hover:border-green-400/50 rounded-2xl p-8 transition-all duration-300 backdrop-blur-sm overflow-hidden hover:shadow-xl hover:shadow-green-500/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl flex items-center justify-center text-green-400 mb-6 group-hover:scale-125 group-hover:text-green-300 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="text-white font-black text-xl mb-3 group-hover:text-green-300 transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{f.desc}</p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:via-transparent group-hover:to-transparent rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Commands Reference */}
      <section id="commands" className="relative max-w-4xl mx-auto px-8 py-32">
        <div className="text-center mb-20">
          <p className="text-green-400 text-xs uppercase tracking-widest mb-4 font-bold">CLI Mastery</p>
          <h2 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">Essential Commands</h2>
          <p className="text-gray-400 text-lg">Master DevSync with these powerful, intuitive commands. Built for speed.</p>
        </div>

        <div className="space-y-3">
          {commands.map((c, i) => (
            <div 
              key={i} 
              className="group flex items-center justify-between bg-gray-900/40 border border-emerald-500/20 hover:border-green-400/50 rounded-xl px-7 py-6 transition-all duration-300 backdrop-blur-sm cursor-pointer hover:bg-gray-800/30 hover:shadow-lg hover:shadow-green-500/10"
            >
              <span className="text-green-400 font-mono text-sm font-bold group-hover:text-green-300 transition-colors">{c.cmd}</span>
              <span className="text-gray-500 text-xs hidden sm:block group-hover:text-gray-400 transition-colors">{c.desc}</span>
              <span className="sm:hidden text-gray-600 group-hover:text-green-400 transition-colors">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-6xl mx-auto px-8 py-32">
        <div className="relative bg-gradient-to-br from-gray-900/80 via-green-900/20 to-gray-900/80 border border-green-500/30 rounded-3xl p-20 text-center overflow-hidden backdrop-blur-xl group">
          
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-cyan-500/10 group-hover:from-green-500/15 group-hover:to-cyan-500/15 transition-all duration-500"></div>
          
          <GradientOrb color="green" size="large" />
          
          <div className="relative z-10">
            <h2 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tight">
              Ready to ship faster?
            </h2>
            <p className="text-gray-400 text-xl mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Join the new generation of developers building with DevSync. Free forever, with powerful premium features when you're ready to scale.
            </p>
            <a href="/signup" className="inline-block bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 hover:from-green-400 hover:via-emerald-400 hover:to-green-400 text-gray-950 font-black text-sm uppercase tracking-widest px-12 py-5 rounded-xl transition-all duration-200 shadow-xl shadow-green-500/50 hover:shadow-green-500/70 hover:scale-105">
              Create Free Account Today →
            </a>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative border-t border-emerald-500/20 bg-gradient-to-b from-gray-950/50 to-gray-950 mt-24">
        <div className="max-w-7xl mx-auto px-8">
          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 py-20">
            
            {/* Brand */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center font-black text-gray-950 shadow-lg shadow-green-500/40">
                  ◆
                </div>
                <div>
                  <p className="text-white font-black text-lg bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">DevSync</p>
                  <p className="text-gray-500 text-xs">Ship Better Code</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">The modern developer platform for teams building amazing software at scale.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 transition-all duration-200 hover:scale-110">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 transition-all duration-200 hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 transition-all duration-200 hover:scale-110">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#features" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">Features</a></li>
                <li><a href="#commands" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">Security</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">API Docs</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">Status</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">Contact</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">Partners</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">Guides</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">Community</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">Support</a></li>
                <li><a href="#" className="text-gray-400 text-sm hover:text-green-300 transition-colors duration-200">Changelog</a></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-emerald-500/10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <p>© 2025 DevSync. All rights reserved.</p>
              <span className="hidden sm:inline text-emerald-500/20">•</span>
              <a href="#" className="hover:text-green-300 transition-colors duration-200">Privacy</a>
              <span className="text-emerald-500/20">•</span>
              <a href="#" className="hover:text-green-300 transition-colors duration-200">Terms</a>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-mono">
                v2.0.1
              </div>
              <a href="mailto:hello@devsync.dev" className="text-gray-400 hover:text-green-300 transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">hello@devsync.dev</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.9s ease-out forwards;
          opacity: 0;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(5, 150, 105, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #06b6d4);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #0891b2);
        }
      `}</style>
    </div>
  );
}

export default Landing;