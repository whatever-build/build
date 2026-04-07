"use client"

import React, { useState, useEffect } from 'react';

const PARTICLE_COUNT = 40;

interface Particle {
  id: number;
  style: React.CSSProperties;
}

const BottomGlowEffect = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const size = Math.random() * 2 + 1; // 1px to 3px
        const duration = Math.random() * 8 + 5; // 5s to 13s
        const delay = Math.random() * 10; // 0s to 10s
        const x = Math.random() * 100; // 0% to 100%
        
        newParticles.push({
          id: i,
          style: {
            position: 'absolute',
            bottom: 0,
            left: `${x}%`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: 'hsl(var(--primary))',
            boxShadow: `0 0 4px hsl(var(--primary)), 0 0 8px hsl(var(--primary)), 0 0 12px hsl(var(--primary))`,
            animation: `impressive-particle-rise ${duration}s linear ${delay}s infinite`,
            opacity: 0,
            willChange: 'transform, opacity',
          },
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-48 overflow-hidden"
      aria-hidden="true"
    >
      {/* Main central glow */}
      <div className="absolute bottom-0 left-1/2 h-48 w-[200%] -translate-x-1/2 animate-luxury-pulse bg-[radial-gradient(50%_50%_at_50%_100%,hsl(var(--primary)/0.35)_0%,transparent_100%)]" />
      
      {/* Brighter core pulse */}
      <div className="absolute bottom-0 left-1/2 h-32 w-[100%] -translate-x-1/2 animate-luxury-pulse-fast bg-[radial-gradient(50%_50%_at_50%_100%,hsl(var(--primary)/0.5)_0%,transparent_100%)] opacity-75" />

      {/* Particles */}
      <div className="absolute inset-0">
        {particles.map(p => (
          <div key={p.id} style={p.style} />
        ))}
      </div>
    </div>
  );
};

export default BottomGlowEffect;
