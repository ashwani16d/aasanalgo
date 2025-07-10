import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader, AlertCircle } from 'lucide-react';
import Logo from '../layout/Logo';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, setUser, setProfile } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { error: loginError } = await signIn(email, password);
      if (loginError) {
        throw new Error(
          loginError.message === 'Invalid login credentials'
            ? 'The email or password you entered is incorrect.'
            : loginError.message
        );
      }

      const { data: sessionData } = await supabase.auth.getUser();
      if (!sessionData.user) throw new Error('Login succeeded but no user returned');

      setUser(sessionData.user);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionData.user.id)
        .single();

      if (profileError) throw new Error('Could not fetch profile');
      setProfile(profile);

      if (profile.role === 'admin') {
        navigate('/admin-login');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccessMessage('Password reset instructions have been sent to your email.');
      setIsResettingPassword(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-700">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">
            {isResettingPassword ? 'Reset Password' : 'Welcome Back'}
          </h2>

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={isResettingPassword ? handlePasswordReset : handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 rounded-lg bg-slate-700/50 border border-slate-600"
                  required
                />
              </div>
            </div>

            {!isResettingPassword && (
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 p-3 rounded-lg bg-slate-700/50 border border-slate-600"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full button-primary flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : isResettingPassword ? 'Send Reset Instructions' : 'Sign In'}
            </button>

            <div className="flex flex-col items-center gap-2 text-sm text-slate-400">
              {isResettingPassword ? (
                <button type="button" onClick={() => setIsResettingPassword(false)} className="text-primary-500 hover:text-primary-400">
                  Back to Sign In
                </button>
              ) : (
                <>
                  <button type="button" onClick={() => setIsResettingPassword(true)} className="text-primary-500 hover:text-primary-400">
                    Forgot Password?
                  </button>
                  <div>
                    Don't have an account?{' '}
                    <button type="button" onClick={() => navigate('/signup')} className="text-primary-500 hover:text-primary-400">
                      Create Account
                    </button>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
