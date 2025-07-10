import React from 'react';
import { motion } from 'framer-motion';
import { Link2, PlayCircle, Settings, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Link2,
    title: "Connect Your Broker",
    description: "Easily integrate with your preferred trading platform - Zerodha, Upstox, Angel One, Fyers, or Dhan."
  },
  {
    icon: Settings,
    title: "Configure Strategy",
    description: "Choose from our pre-built options trading strategies and customize parameters to match your style."
  },
  {
    icon: PlayCircle,
    title: "Start Trading",
    description: "Activate your strategy and let our algorithms execute trades automatically with precision."
  },
  {
    icon: TrendingUp,
    title: "Track Performance",
    description: "Monitor your trading performance with real-time analytics and comprehensive reports."
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 px-4 relative" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get started with algorithmic trading in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 h-full">
                  <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-4 rounded-lg w-fit mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 w-full h-px bg-gradient-to-r from-primary-500/50 to-transparent transform translate-x-1/2" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;