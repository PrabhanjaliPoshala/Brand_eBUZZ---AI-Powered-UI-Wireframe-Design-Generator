import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/supabase';
import { Sparkles, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.resetPassword(email.trim());
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-zinc-900">
            Wireframe<span className="text-blue-600">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Reset your password</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Enter your email address and we'll send you a link to reset your account password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-zinc-200/50 rounded-2xl border border-zinc-200">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {successMessage ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 mb-1">Check your inbox</h3>
              <p className="text-sm text-zinc-600 mb-6">{successMessage}</p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-300 text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {isLoading ? 'Sending instructions...' : 'Send Reset Instructions'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
