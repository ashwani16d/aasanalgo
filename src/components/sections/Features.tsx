import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Cpu, BarChart3, Rocket, Code } from 'lucide-react';

const features = [
  {
    icon: Rocket,
    title: 'Ready-made Algos',
    description: 'Pre-built Options Buying strategies for Index trading in NIFTY50, BANKNIFTY, and SENSEX.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast Execution',
    description: 'Execute trades with microsecond precision, ensuring you never miss an opportunity.'
  },
  {
    icon: Shield,
    title: 'Advanced Security',
    description: 'Your assets are protected with military-grade encryption and multi-layer security protocols.'
  },
  {
    icon: Code,
    title: 'Easy Integration',
    description: 'Seamlessly connect with major brokers like Zerodha, Upstox, Angel One, Fyers, and Dhan.'
  },
  {
    icon: Cpu,
    title: 'Smart Automation',
    description: 'Fully automated trading with customizable parameters and risk management.'
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Comprehensive performance tracking and analysis tools for informed decision making.'
  }
];

const Features = () => {
  return (
    <section className="py-24 px-6 relative" id="features">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Lightning-fast algos that trade on your behalf</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the power of automated trading with our cutting-edge features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-primary-500/20 to-accent-500/20 p-3 rounded-lg w-fit mb-4">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            )}
          )}
        </div>
      </div>
    </section>
  );
};

export default Features;