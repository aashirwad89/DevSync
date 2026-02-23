import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      login(data.userId, data.token);   // authContext mein save
      navigate('/dashboard');           // dashboard pe redirect

    } catch (err) {
      setError('Unable to connect to server. Please try again.');
      console.log('Login error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4">
            <span className="text-emerald-400 text-2xl">⬡</span>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-wide">DevSync</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">
            ⚠ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-950 border border-gray-800 text-gray-100 text-sm rounded-lg px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-widest">Password</label>
              <a href="/forgot-password" className="text-emerald-400 hover:text-emerald-300 text-xs transition">Forgot password?</a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-gray-950 border border-gray-800 text-gray-100 text-sm rounded-lg px-4 py-3 pr-12 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition text-sm"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-gray-950 font-bold text-sm uppercase tracking-widest py-3 rounded-lg transition duration-200 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="text-gray-600 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium py-3 rounded-lg border border-gray-700 transition flex items-center justify-center gap-2">
          <span>🐙</span> Continue with GitHub
        </button>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <a href="/signup" className="text-emerald-400 hover:text-emerald-300 transition font-medium">Sign up</a>
        </p>

      </div>
    </div>
  );
}

export default Login;