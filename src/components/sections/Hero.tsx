import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { ArrowRight, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import AlgorithmCube from '../3d/AlgorithmCube';
import DataParticles from '../3d/DataParticles';
import TradingChart from '../3d/TradingChart';
import { useMousePosition } from '../../hooks/useMousePosition';

const Hero: React.FC = () => {
  const { normalizedPosition } = useMousePosition();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <section id="home" className="section relative">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <AlgorithmCube
              position={[0, 0, 0]}
              rotation={[0.5, 0.5, 0]}
              scale={[1.5, 1.5, 1.5]}
              color="#0073f5"
            />
            <DataParticles
              count={200}
              scale={[1, 1, 1]}
              position={[2, 1, -2]}
            />
            <TradingChart
              position={[-2, -1, -1]}
              rotation={[0, 0.5, 0]}
              scale={[0.5, 0.5, 0.5]}
            />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={0.5}
              color="#0073f5"
            />
            <directionalLight
              position={[-5, -5, -5]}
              intensity={0.3}
              color="#7d00ff"
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10 pt-32">
        <div className="max-w-3xl">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Algo Trading Platform for{' '}
            <span className="text-gradient">Everyone</span>
          </motion.h1>

          <motion.p
            className="text-xl text-white/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover a tech-driven algo trading platform that can supercharge your trading journey. Take fast and accurate trades with pre-built option buying algo strategy.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {!user && (
              <>
                <button 
                  onClick={handleGetStarted}
                  className="button-primary flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleSignIn}
                  className="button-secondary flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              </>
            )}
            <button className="button-secondary">
              View Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="glassmorphism p-4 rounded-lg">
              <h3 className="text-3xl font-bold text-gradient">87%</h3>
              <p className="text-white/60">Win Rate</p>
            </div>
            <div className="glassmorphism p-4 rounded-lg">
              <h3 className="text-3xl font-bold text-gradient">0.8</h3>
              <p className="text-white/60">Sharpe Ratio</p>
            </div>
            <div className="glassmorphism p-4 rounded-lg">
              <h3 className="text-3xl font-bold text-gradient">2.7</h3>
              <p className="text-white/60">Profit Factor</p>
            </div>
            <div className="glassmorphism p-4 rounded-lg">
              <h3 className="text-3xl font-bold text-gradient">32%</h3>
              <p className="text-white/60">Annual Return</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;