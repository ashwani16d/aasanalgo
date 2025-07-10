import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader, AlertCircle, Phone, User } from 'lucide-react';
import Logo from '../layout/Logo';
import axios from 'axios';

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const isSignup = localStorage.getItem("signupform") === "true";
    if (!isSignup) {
      navigate("/signup");
    }
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      interface RegisterPayload {
        email: string;
        full_name: string;
        mobile_number: string;
        password: string;
      }

      const payload: RegisterPayload = {
        email,
        full_name: fullName,
        mobile_number: mobile,
        password,
      };

      const response = await axios.post('http://localhost:5000/api/register', payload);

      if (response.data.success) {
        navigate('/login', {
          state: {
            message: 'Account created successfully! You can now login.',
          },
        });
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Server error');
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

          <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 p-3 rounded-lg bg-slate-700/50 border border-slate-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-10 p-3 rounded-lg bg-slate-700/50 border border-slate-600"
                  required
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 p-3 rounded-lg bg-slate-700/50 border border-slate-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full button-primary flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : 'Create Account'}
            </button>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary-500 hover:text-primary-400"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpForm;
