import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
// import '../styles/Header.css';
import '../styles/HeaderCustom.css';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.header 
      className="app-header glass-morphism"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="header-content">
        <motion.div 
          className="logo-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1 
            className="app-title veritas-title"
            whileHover={{ scale: 1.02 }}
          >
            VeritasBot
          </motion.h1>
          <motion.p 
            className="app-subtitle veritas-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Powered by Knowledge. Guided by Truth.
          </motion.p>
        </motion.div>
        
        <div className="header-right">
          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle light/dark mode"
          >
            {isDark ? <FiSun className="theme-icon" /> : <FiMoon className="theme-icon" />}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
