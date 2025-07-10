import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const features = [
    'Real-time market data',
    'Advanced algorithmic trading',
    'Portfolio tracking',
    'Risk management tools',
    'Email support',
    'API access'
  ];

  const handleStartTrial = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="py-24 px-4 relative" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Start with a 7-day free trial. No credit card required.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-4xl font-bold">₹4,999</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">Everything you need to start algorithmic trading</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleStartTrial}
              className="w-full button-primary py-4 hover:scale-105 transition-transform"
            >
              {user ? 'Go to Dashboard' : 'Start 7-Day Free Trial'}
            </button>

            <p className="text-sm text-center text-gray-400 mt-4">
              No credit card required for trial
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;