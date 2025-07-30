import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ResponseDisplay from './ResponseDisplay';
import { sendQuery } from '../utils/api';
import '../styles/ComponentPages.css';
import '../styles/modern-components.css';
import '../styles/glassmorphism.css';

const TextSummarization = ({ onBack, onAddToHistory, setIsLoading }) => {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const styles = [
    { id: 'concise', name: 'Concise Paragraph', description: 'Brief, well-structured summary' },
    { id: 'bullet_points', name: 'Bullet Points', description: 'Key points in bullet format' },
    { id: 'executive', name: 'Executive Summary', description: 'Business-focused summary' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStyle || !text.trim()) {
      setError('Please select a style and enter text to summarize');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await sendQuery('text_summarization', selectedStyle, text);
      setResponse(result.response);
      onAddToHistory({
        function: 'Text Summarization',
        style: selectedStyle,
        query: text.substring(0, 100) + '...',
        response: result.response
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
        Text Summarization
      </motion.h1>

      <motion.p
        className="modern-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Get concise summaries of your documents and articles
      </motion.p>

      <motion.form
        onSubmit={handleSubmit}
        className="modern-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="modern-form-section">
          <h2 className="modern-section-title">
            <span role="img" aria-label="style">🎨</span> Select Summary Style
          </h2>
          <div className="modern-options-grid">
            {styles.map((style) => (
              <motion.label
                key={style.id}
                className={`modern-style-option ${selectedStyle === style.id ? 'selected' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="radio"
                  name="style"
                  value={style.id}
                  checked={selectedStyle === style.id}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                />
                <div className="modern-style-content">
                  <strong>{style.name}</strong>
                  <span>{style.description}</span>
                </div>
              </motion.label>
            ))}
          </div>
        </div>

        <div className="modern-query-section">
          <label htmlFor="text" className="modern-input-label">
            <span role="img" aria-label="text">📄</span> Enter text to summarize
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your article, document, or any text content here..."
            rows="8"
            className="modern-textarea"
            required
          />
          <div className="text-stats">
            Characters: {text.length} | Words: {text.trim() ? text.trim().split(/\s+/).length : 0}
          </div>
        </div>

        {error && (
          <motion.div
            className="modern-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          className="modern-submit-button"
          disabled={!selectedStyle || !text.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Generate Summary
        </motion.button>
      </motion.form>

      {response && (
        <ResponseDisplay
          title="📋 Summary"
          content={response}
          functionType="text_summarization"
          query={text.substring(0, 100) + '...'}
        />
      )}
    </motion.div>
  );
};

export default TextSummarization;
