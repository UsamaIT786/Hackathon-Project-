/**
 * Chatbot Component - RAG-powered chat widget
 * Integrates with Express backend at /api/chat
 */

import React, { useState, useRef, useEffect } from 'react';
import styles from './style.module.css';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m an AI assistant trained on "Physical AI, Prompt Engineering & Robotic Intelligence" textbook. Ask me anything! 🤖',
      sources: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Send message to backend
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      sources: []
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Call backend
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: inputValue })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add assistant response
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.reply,
        sources: data.sources || []
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message);
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Make sure the RAG server is running (npm run rag:serve).`,
        sources: []
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  /**
   * Clear chat history
   */
  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Chat cleared. What would you like to know about Physical AI, Prompt Engineering, or Robotics?',
        sources: []
      }
    ]);
    setError(null);
  };

  return (
    <>
      {/* Floating button */}
      <button
        className={styles.chatbotButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Open AI Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className={styles.chatbotContainer}>
          {/* Header */}
          <div className={styles.header}>
            <div>
              <h3>AI Textbook Assistant</h3>
              <p className={styles.subtitle}>Powered by RAG</p>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messagesContainer}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${styles[msg.role]}`}
              >
                <div className={styles.avatar}>
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className={styles.content}>
                  <p>{msg.content}</p>
                  
                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className={styles.sources}>
                      <small>
                        <strong>📚 Sources:</strong>
                        {msg.sources.map((source, idx) => (
                          <div key={idx} className={styles.sourceItem}>
                            <span className={styles.confidence}>
                              {source.confidence}%
                            </span>
                            <span>{source.title}</span>
                            <span className={styles.section}>
                              ({source.section})
                            </span>
                          </div>
                        ))}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.avatar}>🤖</div>
                <div className={styles.content}>
                  <div className={styles.typing}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error display */}
          {error && (
            <div className={styles.error}>
              ⚠️ {error}
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSendMessage} className={styles.inputForm}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about the textbook..."
              className={styles.input}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={isLoading || !inputValue.trim()}
              title="Send (Enter)"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </form>

          {/* Footer */}
          <div className={styles.footer}>
            <button
              className={styles.clearButton}
              onClick={handleClearChat}
              title="Clear chat history"
            >
              Clear
            </button>
            <small>💡 Tip: Press Enter to send, Shift+Enter for new line</small>
          </div>
        </div>
      )}
    </>
  );
}
