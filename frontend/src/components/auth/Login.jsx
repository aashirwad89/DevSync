import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed. Please try again.');
        return;
      }

      login(data.userId, data.token);
      navigate('/dashboard');

    } catch (err) {
      setError('Unable to connect to server. Please try again.');
      console.log('Login error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-tl from-blue-500/20 to-emerald-500/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Main form container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Animated background glow */}
        <div className="absolute -inset-6 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative bg-gray-950/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl p-8 transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl mb-5 group hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">⬡</span>
            </div>
            <h1 className="text-white text-3xl font-black tracking-tight mb-2">DevSync</h1>
            <p className="text-gray-400 text-sm font-light">Welcome back to your sync</p>
          </div>

          {/* Error message with animation */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl px-5 py-4 mb-6 flex items-start gap-3 animate-shake">
              <span className="text-lg mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email input */}
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Email Address</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : ''}`}>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full bg-gray-900/50 border border-gray-700/50 text-gray-100 text-sm rounded-xl px-5 py-4 placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 focus:bg-gray-900 transition-all duration-300"
                />
                <span className={`absolute right-4 top-4 text-xl transition-opacity duration-300 ${formData.email ? 'opacity-100' : 'opacity-0'}`}>✓</span>
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest">Password</label>
                <a href="/forgot-password" className="text-emerald-400 hover:text-emerald-300 text-xs font-medium transition-colors duration-200 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-105' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full bg-gray-900/50 border border-gray-700/50 text-gray-100 text-sm rounded-xl px-5 py-4 pr-14 placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 focus:bg-gray-900 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-400 transition-all duration-200 text-lg hover:scale-110"
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </button>
                <span className={`absolute right-12 top-4 text-xl transition-opacity duration-300 ${formData.password ? 'opacity-100' : 'opacity-0'}`}>✓</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:from-emerald-500/50 disabled:to-cyan-500/50 disabled:cursor-not-allowed text-gray-950 font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 mt-8 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin"></span>
                    Signing in...
                  </>
                ) : (
                  <>Sign In <span className="group-hover:translate-x-1 transition-transform">→</span></>
                )}
              </span>
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            <span className="text-gray-600 text-xs font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>

          {/* OAuth button */}
          <button className="w-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 text-gray-200 text-sm font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 hover:border-emerald-500/30 hover:text-emerald-300">
            <span className="text-xl">🐙</span>
            <span>Continue with GitHub</span>
          </button>

          {/* Signup link */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Don't have an account?{' '}
            <a href="/signup" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors duration-200 hover:underline">
              Create one now
            </a>
          </p>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-xs">Secure • Fast • Reliable</p>
        </div>
      </div>

      {/* Global animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        input::placeholder {
          font-weight: 300;
        }

        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}

export default Login;