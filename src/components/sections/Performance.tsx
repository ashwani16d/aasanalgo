import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PERFORMANCE_STATS } from '../../constants';
import TradingChart from '../3d/TradingChart';
import { Canvas } from '@react-three/fiber';

const Performance: React.FC = () => {
  const [hoveredChart, setHoveredChart] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section id="performance" className="section">
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Stats */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">
                Proven <span className="text-gradient">Performance</span>
              </h2>
              <p className="text-lg text-white/70">
                Our algorithms consistently outperform traditional trading strategies with advanced risk management and real-time market analysis.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {PERFORMANCE_STATS.map((stat) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 * stat.id }}
                  className="glassmorphism p-6 rounded-xl"
                >
                  <div className="text-3xl font-bold text-gradient mb-2">
                    {stat.prefix}{stat.value}{stat.suffix}
                  </div>
                  <div className="text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold">Why These Metrics Matter</h3>
              <p className="text-white/70">
                Our high win rate and Sharpe ratio demonstrate consistent profitability while maintaining optimal risk management. The profit factor shows strong risk-adjusted returns across various market conditions.
              </p>
            </motion.div>
          </motion.div>

          {/* Right side - 3D Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="h-[600px] relative"
            onMouseEnter={() => setHoveredChart(true)}
            onMouseLeave={() => setHoveredChart(false)}
          >
            <div className="absolute inset-0 bg-radial-gradient opacity-30" />
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <TradingChart
                hovering={hoveredChart}
                scale={[1.2, 1.2, 1.2]}
                position={[0, 0, 0]}
                rotation={[0, Math.PI / 6, 0]}
              />
            </Canvas>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Performance;