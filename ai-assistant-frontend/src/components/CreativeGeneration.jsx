import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ResponseDisplay from './ResponseDisplay';
import { sendQuery } from '../utils/api';
import '../styles/ComponentPages.css';
import '../styles/modern-components.css';
import '../styles/glassmorphism.css';

const CreativeGeneration = ({ onBack, onAddToHistory, setIsLoading }) => {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const styles = [
    { id: 'storytelling', name: 'Creative Storytelling', description: 'Engaging narratives and stories' },
    { id: 'professional', name: 'Professional Content', description: 'Business and formal writing' },
    { id: 'innovative', name: 'Innovative & Unique', description: 'Creative and original approaches' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStyle || !prompt.trim()) {
      setError('Please select a style and describe what you want to create');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await sendQuery('creative_generation', selectedStyle, prompt);
      setResponse(result.response);
      onAddToHistory({
        function: 'Creative Generation',
        style: selectedStyle,
        query: prompt,
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
        Creative Generation
      </motion.h1>

      <motion.p
        className="modern-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Generate creative content, stories, and unique ideas
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
            <span role="img" aria-label="style">🎨</span> Select Creation Style
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
          <label htmlFor="prompt" className="modern-input-label">
            <span role="img" aria-label="prompt">✨</span> Describe what you'd like me to create
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Write a short story about time travel' or 'Create a product description for eco-friendly shoes'"
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
          disabled={!selectedStyle || !prompt.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Create Content
        </motion.button>
      </motion.form>

      {response && (
        <ResponseDisplay
          title="🎭 Creative Content"
          content={response}
          functionType="creative_generation"
          query={prompt}
        />
      )}
    </motion.div>
  );
};

export default CreativeGeneration;
