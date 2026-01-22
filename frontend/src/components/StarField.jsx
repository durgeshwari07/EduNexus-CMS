import React from 'react';

export default function StarField() {
  return (
    <div 
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)'
      }}
    >
      {/* Simple CSS Stars */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              boxShadow: '0 0 10px white'
            }}
          />
        ))}
      </div>
    </div>
  );
}