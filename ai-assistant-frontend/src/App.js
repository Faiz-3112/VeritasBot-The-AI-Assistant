import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Menu from './components/Menu';
import QuestionAnswering from './components/QuestionAnswering';
import TextSummarization from './components/TextSummarization';
import CreativeGeneration from './components/CreativeGeneration';
import FeedbackAnalytics from './components/FeedbackAnalytics';
import SessionHistory from './components/SessionHistory';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import './styles/globals.css'
import './App.css';
import './styles/footer.css';


function useSessionStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from sessionStorage or return initialValue
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return initialValue;
    }
  });

  // Update sessionStorage whenever state changes
  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to sessionStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}


function App() {
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [chatHistory, setChatHistory] = useSessionStorage('chatHistory', []);
  const [sessionHistory, setSessionHistory] = useSessionStorage('sessionHistory', []);
  const [currentView, setCurrentView] = useState('menu');
  const [isLoading, setIsLoading] = useState(false);
  
  // Add animated background bubbles
  const bubbles = (
    <>
      <div className="bubble" />
      <div className="bubble" />
      <div className="bubble" />
    </>
  );

  const addToHistory = (interaction) => {
    try {
      const historyEntry = {
        id: Date.now() + Math.random(), // Unique ID
        timestamp: interaction.timestamp || new Date().toISOString(),
        function: interaction.function || 'Unknown Function',
        style: interaction.style || 'default',
        query: interaction.query || 'No query provided',
        response: interaction.response || 'No response received'
      };
      
      console.log('Adding to history:', historyEntry); // Debug log
      setSessionHistory(prev => [...prev, historyEntry]);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  // Clear session history function
  const clearHistory = () => {
    setSessionHistory([]);
  };
  window.debugSessionHistory = () => {
    console.log('Current session history:', sessionHistory);
    return sessionHistory;
  };


  const renderCurrentView = () => {
    switch (currentView) {
      case 'question_answering':
        return (
          <QuestionAnswering 
            onBack={() => setCurrentView('menu')}
            onAddToHistory={addToHistory}
            setIsLoading={setIsLoading}
          />
        );
      case 'text_summarization':
        return (
          <TextSummarization 
            onBack={() => setCurrentView('menu')}
            onAddToHistory={addToHistory}
            setIsLoading={setIsLoading}
          />
        );
      case 'creative_generation':
        return (
          <CreativeGeneration 
            onBack={() => setCurrentView('menu')}
            onAddToHistory={addToHistory}
            setIsLoading={setIsLoading}
          />
        );
      case 'feedback_analytics':
        return (
          <FeedbackAnalytics 
            onBack={() => setCurrentView('menu')}
          />
        );
      case 'session_history':
        return (
          <SessionHistory 
            history={sessionHistory}
            onBack={() => setCurrentView('menu')}
            onClear={clearHistory}
          />
        );
      default:
        return (
          <Menu 
            onSelectFunction={setCurrentView}
            sessionCount={sessionHistory.length}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="App">
        {bubbles}
        <Header />
        
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              className="loading-overlay glass-morphism"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="loading-spinner"></div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                🔄 Processing your request...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.main
          className="main-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {renderCurrentView()}
          </AnimatePresence>
        </motion.main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
