import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, AlertCircle } from 'lucide-react';
import Logo from '../layout/Logo';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      if (email === 'admin' && password === 'ashwani16D@') {
        localStorage.setItem('adminLoggedIn', 'true'); // 
        navigate('/admin/dashboard');
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Access denied');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-700">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-6 text-white">Admin Login</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-4 flex items-start gap-3">
              <AlertCircle className="shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium">Access Denied</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Admin ID</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:outline-none focus:border-blue-500 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:outline-none focus:border-blue-500 text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors"
            >
              {loading ? <Loader className="animate-spin mx-auto" size={20} /> : 'Login'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
