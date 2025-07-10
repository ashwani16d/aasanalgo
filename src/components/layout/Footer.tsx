import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Mail, MessageSquare, Github } from 'lucide-react';
import { NAVIGATION_LINKS } from '../../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative py-16 bg-dark-800/80 border-t border-dark-700">
      <div className="absolute inset-0 bg-grid opacity-10"></div>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Company Info */}
          <div className="col-span-1 md:col-span-1">
            <motion.div 
              className="flex items-center gap-2 text-xl font-bold mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <LineChart className="h-6 w-6 text-primary-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
                AASANALGO
              </span>
            </motion.div>
            <p className="text-white/70 mb-6 text-sm">
              Advanced algorithmic trading solutions backed by cutting-edge technology and AI
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                className="text-white/60 hover:text-primary-400"
                whileHover={{ scale: 1.1 }}
              >
                <Github size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-white/60 hover:text-primary-400"
                whileHover={{ scale: 1.1 }}
              >
                <MessageSquare size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-white/60 hover:text-primary-400"
                whileHover={{ scale: 1.1 }}
              >
                <Mail size={20} />
              </motion.a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.href}>
                  <motion.a 
                    href={link.href}
                    className="text-white/70 hover:text-primary-400 text-sm"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <motion.a 
                  href="#" 
                  className="text-white/70 hover:text-primary-400 text-sm"
                  whileHover={{ x: 5 }}
                >
                  Documentation
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#" 
                  className="text-white/70 hover:text-primary-400 text-sm"
                  whileHover={{ x: 5 }}
                >
                  API Reference
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#" 
                  className="text-white/70 hover:text-primary-400 text-sm"
                  whileHover={{ x: 5 }}
                >
                  Blog
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#" 
                  className="text-white/70 hover:text-primary-400 text-sm"
                  whileHover={{ x: 5 }}
                >
                  Tutorials
                </motion.a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Stay Updated</h3>
            <p className="text-white/70 mb-4 text-sm">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-dark-700 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <motion.button 
                type="submit"
                className="button-primary text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-dark-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            © {currentYear} AASANALGO. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-white/60 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-white/60 hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-white/60 hover:text-white text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;