import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Target, Users, Zap } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <section className="py-24 px-4 relative" id="about">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">About AASAN ALGO</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Aasan Algo aims to ignite a financial revolution by building the next-generation algo trading platform in India. We are on a mission to educate, enable and empower aspiring investors and traders in the country with the power of free automation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary-500/10 p-3 rounded-lg">
                <Target className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-gray-400">
                  To democratize algorithmic trading by making it accessible, affordable, and user-friendly for every trader in India.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary-500/10 p-3 rounded-lg">
                <Users className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Who We Serve</h3>
                <p className="text-gray-400">
                  Our platform caters to both beginners and experienced traders, providing ready-made algos that can be integrated with major trading platforms like Upstox, Fyers, Zerodha, Angel One & Dhan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary-500/10 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Technology</h3>
                <p className="text-gray-400">
                  We specialize in 100% pre-built Options Buying strategies for Index trading (NIFTY50, BANKNIFTY, SENSEX), designed for fast and accurate trade execution.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <LineChart className="w-8 h-8 text-primary-500" />
              <h3 className="text-2xl font-bold">Why Choose Us</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <p>Lightning-fast execution with microsecond precision</p>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <p>Integration with all major Indian brokers</p>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <p>Pre-built strategies ready for immediate deployment</p>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <p>Comprehensive educational resources and support</p>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <p>Advanced risk management systems</p>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;