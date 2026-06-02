import React, { useState } from 'react';
import { Lock, Mail, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', email);
        onLoginSuccess(data.token);
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-dark mb-2">Admin Console</h1>
            <p className="text-sm text-muted">Access restricted to authorized administrators</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nepahealth.com"
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg text-sm text-dark placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:bg-neutral-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg text-sm text-dark placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:bg-neutral-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-hover transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-5 h-5" />
              <span>{isLoading ? 'Authenticating...' : 'Login to Admin Console'}</span>
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-xs text-muted text-center mb-3">Demo Credentials (for testing):</p>
            <div className="space-y-2 bg-neutral-50 p-3 rounded-lg">
              <p className="text-xs text-dark"><span className="font-semibold">Email:</span> admin@nepahealth.com</p>
              <p className="text-xs text-dark"><span className="font-semibold">Password:</span> admin123</p>
            </div>
            <p className="text-xs text-muted text-center mt-3">Change these credentials in production</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
