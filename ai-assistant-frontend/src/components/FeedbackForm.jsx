import React, { useState } from 'react';
import { submitFeedback } from '../utils/api';
import '../styles/Components.css';

const FeedbackForm = ({ functionType, query, response, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [suggestions, setSuggestions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await submitFeedback({
        function_type: functionType,
        query: query,
        response: response,
        rating: rating,
        suggestions: suggestions
      });
      
      onSubmit();
    } catch (error) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-form">
      <h4>📊 Feedback Collection</h4>
      
      <form onSubmit={handleSubmit}>
        <div className="rating-section">
          <label>Rate this response (1-5):</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${rating >= star ? 'active' : ''}`}
                onClick={() => setRating(star)}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        <div className="suggestions-section">
          <label htmlFor="suggestions">Any suggestions for improvement? (optional)</label>
          <textarea
            id="suggestions"
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            placeholder="Your suggestions..."
            rows="3"
          />
        </div>

        <div className="feedback-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting || rating === 0} className="submit-button">
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
