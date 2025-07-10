import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { NAVIGATION_LINKS } from '../../constants';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/signup');
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-dark-800/95 backdrop-blur-md shadow-lg' : 'py-5 bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAVIGATION_LINKS.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                whileHover={{ scale: 1.05, color: '#fff' }}
              >
                {link.label}
              </motion.a>
            ))}
            
            {user && (
              <motion.button
                onClick={() => navigate('/dashboard')}
                className="text-sm font-medium text-primary-400 hover:text-primary-300"
                whileHover={{ scale: 1.05 }}
              >
                Dashboard
              </motion.button>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <motion.button
                    onClick={() => navigate('/admin')}
                    className="text-sm font-medium text-primary-400 hover:text-primary-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    Admin Panel
                  </motion.button>
                )}
                <motion.button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-white/80 hover:text-white"
                  whileHover={{ scale: 1.05 }}
                >
                  Sign Out
                </motion.button>
              </div>
            ) : (
              <motion.button
                className="button-primary"
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white/90 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 py-4 glassmorphism rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-4 px-4">
              {NAVIGATION_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/80 hover:text-white py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {user && (
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="text-primary-400 hover:text-primary-300 py-2 text-left"
                >
                  Dashboard
                </button>
              )}
              {user ? (
                <>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setIsMenuOpen(false);
                      }}
                      className="text-primary-400 hover:text-primary-300 py-2 text-left"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-white/80 hover:text-white py-2 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  className="button-primary mt-2"
                  onClick={() => {
                    handleGetStarted();
                    setIsMenuOpen(false);
                  }}
                >
                  Get Started
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;