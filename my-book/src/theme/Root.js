/**
 * Root layout component
 * Integrates the chatbot globally
 */

import React from 'react';
import Chatbot from '../components/Chatbot/index.jsx';

export default function Root({ children }) {
  return (
    <>
      {children}
      <Chatbot />
    </>
  );
}
