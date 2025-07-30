import React from 'react';
import { motion } from 'framer-motion';
import '../styles/ComponentPages.css';
import '../styles/modern-components.css';
import '../styles/glassmorphism.css';

const SessionHistory = ({ history, onBack }) => {
  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString();
    } catch (error) {
      return 'Invalid time';
    }
  };

  const formatFunction = (functionName) => {
    if (!functionName) return 'Unknown Function';
    return functionName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'No text available';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  return (
    <motion.div
      className="modern-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        className="modern-back-button"
        onClick={onBack}
        whileHover={{ scale: 1.02, x: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        ← Back to Menu
      </motion.button>

      <motion.h1
        className="modern-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Session History
      </motion.h1>

      <motion.p
        className="modern-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Review your current session interactions ({(history || []).length} items)
      </motion.p>

      <div className="history-content">
        {!history || history.length === 0 ? (
          <div className="no-data">
            <div className="no-history-icon">📝</div>
            <h3>No Session History Yet</h3>
            <p>Start using the AI Assistant to see your interaction history here.</p>
            <div className="history-suggestions">
              <p>Try:</p>
              <ul>
                <li>Ask a question using Question Answering</li>
                <li>Summarize some text</li>
                <li>Generate creative content</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="history-list">
            {history.map((interaction, index) => (
              <motion.div
                key={`history-${index}`}
                className="history-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <div className="history-header">
                  <span className="history-index">#{index + 1}</span>
                  <span className="history-time">
                    [{formatTime(interaction.timestamp)}]
                  </span>
                  <span className="history-function">
                    {formatFunction(interaction.function)}
                  </span>
                  {interaction.style && (
                    <span className="history-style">({interaction.style})</span>
                  )}
                </div>
                <div className="history-details">
                  <div className="history-query">
                    <strong>Query:</strong> 
                    <span className="query-text">
                      {truncateText(interaction.query)}
                    </span>
                  </div>
                  <div className="history-response">
                    <strong>Response:</strong> 
                    <span className="response-text">
                      {truncateText(interaction.response, 200)}
                    </span>
                  </div>
                </div>
                <div className="history-actions">
                  <button 
                    className="view-full-button"
                    onClick={() => {
                      alert(`Full Query: ${interaction.query}\n\nFull Response: ${interaction.response}`);
                    }}
                  >
                    View Full
                  </button>
                  <button 
                    className="copy-button"
                    onClick={() => {
                      navigator.clipboard.writeText(`Query: ${interaction.query}\n\nResponse: ${interaction.response}`);
                      alert('Copied to clipboard!');
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SessionHistory;
