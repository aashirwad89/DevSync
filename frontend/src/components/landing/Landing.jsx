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
  },
  {
    icon: '⎇',
    title: 'Push & Pull',
    desc: 'Sync your code seamlessly. Push changes, pull updates, stay in perfect harmony.',
  },
  {
    icon: '↺',
    title: 'Revert & Commit',
    desc: 'Full commit history. Revert mistakes in seconds. Your code, your timeline.',
  },
  {
    icon: '⚑',
    title: 'Issue Tracking',
    desc: 'Raise, assign, and resolve issues. Keep your team aligned and bugs squashed.',
  },
  {
    icon: '◈',
    title: 'Init & Add',
    desc: 'Start fresh with devsync init. Stage changes with add. Simple, fast, reliable.',
  },
  {
    icon: '⊕',
    title: 'Open Collaboration',
    desc: 'Built for teams and solo devs alike. Fork, contribute, and build together.',
  },
];

function TerminalTyper() {
  const [cmdIndex, setCmdIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState('typing'); // typing | pause | clearing

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
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
      {/* Terminal bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
        <span className="w-3 h-3 rounded-full bg-red-500/70"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500/70"></span>
        <span className="w-3 h-3 rounded-full bg-emerald-500/70"></span>
        <span className="ml-3 text-gray-500 text-xs font-mono">~/myproject</span>
      </div>

      {/* Terminal body */}
      <div className="p-6 font-mono text-sm min-h-32">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-emerald-400">❯</span>
          <span className="text-gray-100">{typed}</span>
          <span className="w-2 h-4 bg-emerald-400 animate-pulse"></span>
        </div>
        <p className="text-gray-500 text-xs mt-1 ml-4">
          {commands[cmdIndex].desc}
        </p>
      </div>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'Courier New', monospace" }}>

      {/* Navbar */}
      <nav className="border-b border-gray-800/60 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-xl">⬡</span>
          <span className="text-white font-bold text-lg tracking-widest uppercase">DevSync</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-gray-400 text-sm">
          <a href="#features" className="hover:text-emerald-400 transition">Features</a>
          <a href="#commands" className="hover:text-emerald-400 transition">Commands</a>
          <a href="/signup" className="hover:text-emerald-400 transition">Docs</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="/auth" className="text-gray-400 hover:text-white text-sm transition px-4 py-2">
            Sign in
          </a>
          <a href="/signup" className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-sm px-5 py-2 rounded-lg transition">
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          Git-Inspired Version Control
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-none mb-6">
          Code Together.<br />
          <span className="text-emerald-400">Ship Faster.</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          DevSync is a developer platform for version control and collaboration.
          Push, pull, commit, revert — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <a href="/signup" className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-8 py-4 rounded-lg text-sm uppercase tracking-widest transition">
            Start for Free →
          </a>
          <a href="#commands" className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-4 rounded-lg text-sm uppercase tracking-widest transition">
            View Commands
          </a>
        </div>

        {/* Terminal */}
        <TerminalTyper />
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-emerald-400 text-xs uppercase tracking-widest mb-3">What you get</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Everything a dev needs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 hover:border-emerald-500/30 rounded-xl p-6 transition group">
              <div className="text-emerald-400 text-2xl mb-4 group-hover:scale-110 transition-transform inline-block">
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Commands Reference */}
      <section id="commands" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-emerald-400 text-xs uppercase tracking-widest mb-3">CLI Reference</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Commands at a glance</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {commands.map((c, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-emerald-500/20 rounded-lg px-5 py-4 transition group">
              <span className="text-emerald-400 font-mono text-sm">{c.cmd}</span>
              <span className="text-gray-500 text-xs hidden sm:block">{c.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gray-900 border border-emerald-500/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to sync your code?
          </h2>
          <p className="text-gray-400 text-base mb-8 max-w-md mx-auto">
            Join developers already using DevSync to build, collaborate, and ship.
          </p>
          <a href="/signup" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-sm uppercase tracking-widest px-10 py-4 rounded-lg transition">
            Create Free Account →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">⬡</span>
          <span className="text-gray-500 text-sm">DevSync © 2025</span>
        </div>
        <div className="flex gap-6 text-gray-600 text-sm">
          <a href="/auth" className="hover:text-gray-400 transition">Login</a>
          <a href="/signup" className="hover:text-gray-400 transition">Sign Up</a>
          <a href="#features" className="hover:text-gray-400 transition">Features</a>
        </div>
      </footer>

    </div>
  );
}

export default Landing;