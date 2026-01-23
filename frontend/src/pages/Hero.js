import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
 <header className="hero" style={{
  width: '100%',            // Ensures it covers the full width
  padding: '200px 20px 120px', // Adds space so it doesn't look cramped
  textAlign: 'center', 
  maxWidth: '100%',         // REMOVES the "box" constraint
  margin: '0',              // Removes side margins
  background: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}}>
      <motion.span 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'inline-block',
          padding: '6px 16px',
          background: '#f1f5f9', // Light gray-blue tag background
          color: '#1a73e8',      // Blue tag text
          borderRadius: '100px',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '24px'
        }}
      >
        2026 Academic Edition
      </motion.span>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: 'clamp(48px, 8vw, 84px)', 
          fontWeight: 800, 
          letterSpacing: '-3px', 
          lineHeight: 1,
          color: '#000000' // FIXED: Explicitly Black text
        }}
      >
        The single source of truth for <span style={{
          background: 'linear-gradient(to right, #1a73e8, #8b5cf6)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent'
        }}>College Records.</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          fontSize: '22px', 
          color: '#4b5563', // FIXED: Dark gray for visibility
          margin: '24px auto 48px', 
          maxWidth: '800px',
          lineHeight: '1.6'
        }}
      >
        Centralized student information management. From admission through graduation—secure, paperless, and instantaneous.
      </motion.p>
    </header>
  );
};

export default Hero;

