import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import FeedbackForm from './FeedbackForm';
import '../styles/ResponseDisplay.css';

const ResponseDisplay = ({ title, content, functionType, query }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    setShowFeedback(false);
    setFeedbackSubmitted(false);
  }, [content]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    alert('Response copied to clipboard!');
  };

  const handleFeedbackSubmit = () => {
    setFeedbackSubmitted(true);
    setShowFeedback(false);
  };

  return (
    <div className="response-container">
      <div className="response-header">
        <h3>{title}</h3>
        <div className="response-actions">
          <button onClick={copyToClipboard} className="action-button">
            📋 Copy
          </button>
          <button 
            onClick={() => setShowFeedback(!showFeedback)} 
            className="action-button"
            disabled={feedbackSubmitted}
          >
            {feedbackSubmitted ? '✅ Feedback Sent' : '📝 Feedback'}
          </button>
        </div>
      </div>
      
      <div className="response-content">
        {/* UPDATED: Remove className prop, use wrapper div instead */}
        <div className="markdown-content">
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {showFeedback && !feedbackSubmitted && (
        <FeedbackForm
          functionType={functionType}
          query={query}
          response={content}
          onSubmit={handleFeedbackSubmit}
          onCancel={() => setShowFeedback(false)}
        />
      )}
    </div>
  );
};

export default ResponseDisplay;
