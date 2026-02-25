/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';

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
    icon: '⬡',
    title: 'Repository Management',
    desc: 'Create, browse, and manage your repositories with a clean and powerful interface.',
    color: 'from-emerald-500/20 to-cyan-500/20',
    accent: 'emerald',
  },
  {
    icon: '⎇',
    title: 'Push & Pull',
    desc: 'Sync your code seamlessly. Push changes, pull updates, stay in perfect harmony.',
    color: 'from-blue-500/20 to-emerald-500/20',
    accent: 'blue',
  },
  {
    icon: '↺',
    title: 'Revert & Commit',
    desc: 'Full commit history. Revert mistakes in seconds. Your code, your timeline.',
    color: 'from-purple-500/20 to-pink-500/20',
    accent: 'purple',
  },
  {
    icon: '⚑',
    title: 'Issue Tracking',
    desc: 'Raise, assign, and resolve issues. Keep your team aligned and bugs squashed.',
    color: 'from-orange-500/20 to-red-500/20',
    accent: 'orange',
  },
  {
    icon: '◈',
    title: 'Init & Add',
    desc: 'Start fresh with devsync init. Stage changes with add. Simple, fast, reliable.',
    color: 'from-cyan-500/20 to-blue-500/20',
    accent: 'cyan',
  },
  {
    icon: '⊕',
    title: 'Open Collaboration',
    desc: 'Built for teams and solo devs alike. Fork, contribute, and build together.',
    color: 'from-pink-500/20 to-purple-500/20',
    accent: 'pink',
  },
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
        const t = setTimeout(() => setPhase('clearing'), 1800);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'clearing') {
      if (typed.length > 0) {
        const t = setTimeout(() => {
          setTyped(t => t.slice(0, -1));
        }, 25);
        return () => clearTimeout(t);
      } else {
        setCharIndex(0);
        setCmdIndex(i => (i + 1) % commands.length);
        setPhase('typing');
      }
    }
  }, [phase, charIndex, typed, cmdIndex]);

  return (
    <div className="relative group max-w-2xl mx-auto">
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      <div className="relative bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm hover:border-emerald-500/30 transition-colors duration-300">
        {/* Terminal bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-900/50 border-b border-gray-800/50">
          <span className="w-3 h-3 rounded-full bg-red-500/70 shadow-lg shadow-red-500/50"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/70 shadow-lg shadow-yellow-500/50"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/70 shadow-lg shadow-emerald-500/50"></span>
          <span className="ml-3 text-gray-500 text-xs font-mono">~/myproject</span>
        </div>

        {/* Terminal body */}
        <div className="p-8 font-mono text-sm min-h-40 bg-gradient-to-br from-gray-950 to-gray-900/30">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-emerald-400 text-lg">❯</span>
            <span className="text-gray-100 text-lg tracking-tight">{typed}</span>
            <span className="w-2 h-5 bg-emerald-400 animate-pulse rounded-sm"></span>
          </div>
          <p className="text-gray-500 text-xs mt-4 ml-6 opacity-70 font-light">
            {commands[cmdIndex].desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function GradientOrb({ color = 'emerald' }) {
  const colors = {
    emerald: 'from-emerald-500 to-cyan-500',
    blue: 'from-blue-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
  };
  return (
    <div className={`absolute w-96 h-96 bg-gradient-to-r ${colors[color]} rounded-full blur-3xl opacity-10 animate-pulse`}></div>
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
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900 text-white" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      
      {/* Scroll progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <GradientOrb color="emerald" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full blur-3xl opacity-5 animate-pulse" style={{ animation: 'pulse 8s ease-in-out infinite' }}></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-gray-950/50 border-b border-gray-800/30 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center font-black text-gray-950 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            ⬡
          </div>
          <span className="text-white font-black text-lg tracking-widest uppercase bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">DevSync</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-gray-400 text-sm">
          <a href="#features" className="hover:text-emerald-400 transition-colors duration-200 relative group">
            Features
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#commands" className="hover:text-emerald-400 transition-colors duration-200 relative group">
            Commands
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="/docs" className="hover:text-emerald-400 transition-colors duration-200 relative group">
            Docs
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a href="/auth" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 px-4 py-2">
            Sign in
          </a>
          <a href="/signup" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-black text-sm px-5 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center overflow-hidden">
        
        {/* Animated grid background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2.5 rounded-full mb-8 tracking-widest uppercase backdrop-blur-sm hover:border-emerald-500/50 transition-colors duration-300 animate-fade-in">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          Git-Inspired Version Control
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Code Together.<br />
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Ship Faster.</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-16 leading-relaxed animate-fade-in font-light" style={{ animationDelay: '0.2s' }}>
          DevSync is a lightning-fast developer platform for version control and real-time collaboration. Push, pull, commit, and revert — all with the speed and reliability your team deserves.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <a href="/signup" className="group relative bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-black px-8 py-4 rounded-lg text-sm uppercase tracking-widest transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Start for Free <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </a>
          <a href="#commands" className="border-2 border-emerald-500/30 hover:border-emerald-500/60 text-gray-300 px-8 py-4 rounded-lg text-sm uppercase tracking-widest transition-all duration-200 hover:bg-emerald-500/5 backdrop-blur-sm">
            View Commands
          </a>
        </div>

        {/* Terminal */}
        <TerminalTyper />
      </section>

      {/* Features */}
      <section id="features" className="relative max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <p className="text-emerald-400 text-xs uppercase tracking-widest mb-4 font-bold">What you get</p>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">Everything a dev needs</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Powerful features designed to accelerate your workflow and keep your team synchronized.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="group relative bg-gray-900/40 border border-gray-800/50 hover:border-emerald-500/40 rounded-2xl p-8 transition-all duration-300 backdrop-blur-sm overflow-hidden"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="text-4xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 inline-block">
                  {f.icon}
                </div>
                <h3 className="text-white font-black text-xl mb-3 group-hover:text-emerald-300 transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{f.desc}</p>
              </div>

              {/* Border glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/20 group-hover:via-transparent group-hover:to-transparent rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Commands Reference */}
      <section id="commands" className="relative max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <p className="text-emerald-400 text-xs uppercase tracking-widest mb-4 font-bold">CLI Reference</p>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">Commands at a glance</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Master DevSync with these essential commands. Fast, intuitive, powerful.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {commands.map((c, i) => (
            <div 
              key={i} 
              className="group flex items-center justify-between bg-gray-900/40 border border-gray-800/50 hover:border-emerald-500/40 rounded-xl px-6 py-5 transition-all duration-300 backdrop-blur-sm cursor-pointer hover:bg-gray-800/30"
            >
              <span className="text-emerald-400 font-mono text-sm font-bold group-hover:text-emerald-300 transition-colors">{c.cmd}</span>
              <span className="text-gray-500 text-xs hidden sm:block group-hover:text-gray-400 transition-colors">{c.desc}</span>
              <span className="sm:hidden text-gray-600 group-hover:text-emerald-400 transition-colors">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-32">
        <div className="relative bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-gray-900/60 border border-emerald-500/20 rounded-3xl p-16 text-center overflow-hidden backdrop-blur-sm group">
          
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5 group-hover:from-emerald-500/10 group-hover:to-cyan-500/10 transition-all duration-500"></div>
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Ready to sync your code?
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of developers already using DevSync to build, collaborate, and ship at scale. Free forever, with optional premium features.
            </p>
            <a href="/signup" className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-black text-sm uppercase tracking-widest px-12 py-5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-105">
              Create Free Account →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/30 px-6 py-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 text-gray-500">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-md flex items-center justify-center font-black text-xs text-gray-950">⬡</div>
          <span className="text-sm">DevSync © 2025. Built for developers.</span>
        </div>
        <div className="flex gap-8 text-sm">
          <a href="/auth" className="hover:text-emerald-400 transition-colors duration-200">Login</a>
          <a href="/signup" className="hover:text-emerald-400 transition-colors duration-200">Sign Up</a>
          <a href="#features" className="hover:text-emerald-400 transition-colors duration-200">Features</a>
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
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}

export default Landing;