import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Loader } from 'lucide-react';
import { authService } from '../services/supabase';
import { store } from '../services/store';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try Supabase first if configured
      const result = await authService.signIn(email, password);
      if (result.user) {
        store.setCurrentUser(result.user);
        navigate('/dashboard');
        return;
      }
      if (result.error && result.error.toLowerCase().includes('configured')) {
        // Supabase not configured, try local auth
        throw new Error('Supabase not configured');
      }
    } catch (err) {
      // Fall back to local auth
      console.log('Supabase login failed, trying local auth');
    }

    // Fall back to local authentication
    try {
      const users = store.getUsers();
      const user = users.find(u => u.email === email);
      
      if (user) {
        // In production, verify password hash. For demo, allow any password.
        store.setCurrentUser(user);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setError('');
    setLoading(true);

    try {
      const demoUser = store.getUsers().find((user) => user.email === 'poshalaprabhanjali@gmail.com');
      if (!demoUser) {
        setError('Demo admin account is unavailable.');
        return;
      }

      store.setCurrentUser(demoUser);
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-900 hidden sm:inline">
              Wireframe<span className="text-blue-600">AI</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Welcome back</h1>
          <p className="text-zinc-600">Sign in to continue to Wireframe Studio</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-zinc-200 p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-900 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-200">
            <p className="text-center text-sm text-zinc-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Users */}
          <div className="mt-6 pt-6 border-t border-zinc-200">
            <p className="text-xs text-zinc-500 text-center mb-3">Demo accounts:</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full text-sm px-3 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition text-zinc-700"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
