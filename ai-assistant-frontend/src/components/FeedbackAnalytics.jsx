import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFeedbackStats } from '../utils/api';
import '../styles/ComponentPages.css';
import '../styles/modern-components.css';
import '../styles/glassmorphism.css';

const FeedbackAnalytics = ({ onBack }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getFeedbackStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <motion.div className="modern-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
        <motion.button className="modern-back-button" onClick={onBack} whileHover={{ scale: 1.02, x: -5 }} whileTap={{ scale: 0.98 }}>
          ← Back to Menu
        </motion.button>
        <motion.h1 className="modern-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Feedback Analytics
        </motion.h1>
        <motion.p className="modern-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          Performance statistics and user feedback insights
        </motion.p>
        <div className="loading">Loading analytics...</div>
      </motion.div>
    );
  }

  return (
    <motion.div className="modern-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
      <motion.button className="modern-back-button" onClick={onBack} whileHover={{ scale: 1.02, x: -5 }} whileTap={{ scale: 0.98 }}>
        ← Back to Menu
      </motion.button>
      <motion.h1 className="modern-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        Feedback Analytics
      </motion.h1>
      <motion.p className="modern-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        Performance statistics and user feedback insights
      </motion.p>

      {error && (
        <motion.div className="modern-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {error}
        </motion.div>
      )}

      {stats && (
        <div className="analytics-content">
          {stats.message ? (
            <div className="no-data">
              <p>{stats.message}</p>
            </div>
          ) : (
            <>
              <div className="stats-overview">
                <div className="stat-card">
                  <h3>📈 Total Feedback</h3>
                  <div className="stat-value">{stats.total_feedback || 0}</div>
                </div>
                <div className="stat-card">
                  <h3>⭐ Average Rating</h3>
                  <div className="stat-value">{stats.average_rating || 0}/5.0</div>
                </div>
              </div>

              <div className="function-performance">
                <h3>📋 Function Performance</h3>
                {stats.function_stats && Object.keys(stats.function_stats).length > 0 ? (
                  Object.entries(stats.function_stats).map(([func, data]) => (
                    <div key={func} className="performance-item">
                      <div className="function-name">
                        {func.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div className="performance-stats">
                        <span className="rating">{data.avg_rating?.toFixed(1) || 0}/5.0</span>
                        <span className="count">({data.count || 0} responses)</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${((data.avg_rating || 0) / 5) * 100}%` }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data">
                    <p>No function performance data available yet.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default FeedbackAnalytics;
