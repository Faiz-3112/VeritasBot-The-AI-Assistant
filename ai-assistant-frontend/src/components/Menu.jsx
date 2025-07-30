import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaQuestionCircle, FaRegFileAlt, FaLightbulb, FaChartBar, FaHistory } from 'react-icons/fa';
import '../styles/Menu.css';
import '../styles/modern-components.css';
import '../styles/glassmorphism.css';

const Menu = ({ onSelectFunction, sessionCount }) => {
  const menuItems = [
    {
      id: 'question_answering',
      icon: <FaQuestionCircle size={36} />, // Professional Q&A icon
      title: 'Question Answering',
      description: 'Get factual information and explanations',
      color: '#4CAF50'
    },
    {
      id: 'text_summarization',
      icon: <FaRegFileAlt size={36} />, // Document icon
      title: 'Text Summarization',
      description: 'Summarize articles, documents, or content',
      color: '#2196F3'
    },
    {
      id: 'creative_generation',
      icon: <FaLightbulb size={36} />, // Lightbulb for creativity
      title: 'Creative Generation',
      description: 'Generate stories, essays, and creative content',
      color: '#FF9800'
    },
    {
      id: 'feedback_analytics',
      icon: <FaChartBar size={36} />, // Analytics icon
      title: 'Feedback Analytics',
      description: 'View performance statistics',
      color: '#9C27B0'
    },
    {
      id: 'session_history',
      icon: <FaHistory size={36} />, // History icon
      title: 'Session History',
      description: `Review interactions (${sessionCount} items)`,
      color: '#607D8B'
    }
  ];

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className="modern-container menu-container"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.div 
        className="welcome-section"
        variants={itemVariants}
      >
        <motion.h2
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Welcome to Your AI Assistant
        </motion.h2>
        <motion.p variants={itemVariants}>
          Select a function to get started with intelligent assistance
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="menu-grid"
        variants={containerVariants}>
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            className="modern-style-option menu-item"
            onClick={() => onSelectFunction(item.id)}
            style={{ borderColor: item.color }}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 4px 32px ${item.color}33`,
              transition: { type: "spring", stiffness: 300 }
            }}
          >
            <div
              className="menu-icon"
              style={{ color: item.color }}
            >
              {item.icon}
            </div>
            <motion.h3 
              className="menu-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {item.title}
            </motion.h3>
            <motion.p 
              className="menu-description"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {item.description}
            </motion.p>
            <motion.div 
              className="menu-arrow" 
              style={{ color: item.color }}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              →
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Menu;
