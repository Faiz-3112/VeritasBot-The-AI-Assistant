import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sendQuery } from '../utils/api';
import ResponseDisplay from '../components/ResponseDisplay';
import '../styles/ComponentPages.css';
import '../styles/modern-components.css';
import '../styles/glassmorphism.css';

const QuestionAnswering = ({ onBack, onAddToHistory, setIsLoading }) => {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const styles = [
    { id: 'factual', name: 'Factual & Direct', description: 'Clear, direct answers with facts' },
    { id: 'analytical', name: 'Analytical & Detailed', description: 'In-depth analysis with reasoning' },
    { id: 'educational', name: 'Educational & Teaching', description: 'Learning-focused explanations' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStyle || !query.trim()) {
      setError('Please select a style and enter your question');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await sendQuery('question_answering', selectedStyle, query);
      setResponse(result.response);
      
      onAddToHistory({
        function: 'Question Answering',
        style: selectedStyle,
        query: query,
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
        Question Answering
      </motion.h1>

      <motion.p 
        className="modern-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Get intelligent answers to your questions with different response styles
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
            <span role="img" aria-label="style">🎨</span> Select Response Style
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
          <label htmlFor="question" className="modern-input-label">
            <span role="img" aria-label="question">💭</span> What would you like to know?
          </label>
          <textarea
            id="question"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your question here..."
            rows="4"
            className="modern-textarea"
            required
          />
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
          disabled={!selectedStyle || !query.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Get Answer
        </motion.button>
      </motion.form>

      {response && (
        <ResponseDisplay
          title="🤖 AI Response"
          content={response}
          functionType="question_answering"
          query={query}
        />
      )}
    </motion.div>
  );
};

export default QuestionAnswering;
