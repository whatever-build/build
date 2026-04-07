"use client"

import React, { useState, useEffect } from 'react';

const PARTICLE_COUNT = 75; // Increased for a denser, more impressive flow

interface Particle {
  id: number;
  style: React.CSSProperties;
}

const BottomGlowEffect = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Client-side only effect
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const size = Math.random() * 2.5 + 1.5;
        const duration = Math.random() * 8 + 6;
        const delay = Math.random() * 12;
        const x = Math.random() * 100;
        const drift = (Math.random() - 0.5) * 120;
        
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
            boxShadow: `0 0 12px hsl(var(--primary)), 0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--accent))`,
            animation: `impressive-particle-rise ${duration}s ease-in-out ${delay}s infinite`,
            opacity: 0,
            willChange: 'transform, opacity',
            ['--particle-drift' as any]: `${drift}px`,
          },
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[300px] overflow-hidden"
      aria-hidden="true"
    >
      {/* === FADE LAYER 1 (BOTTOM / OBSCURES TEXT) === */}
      {/* This is the brightest layer, designed to wash out text behind it completely. */}
      <div 
        className="absolute bottom-0 left-1/2 h-32 w-[150%] -translate-x-1/2 animate-luxury-pulse-fast
                   bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary))_0%,transparent_80%)]
                   opacity-100 blur-2xl"
        style={{ animationDuration: '6s' }}
      />
      <div 
        className="absolute bottom-0 left-1/2 h-24 w-[100%] -translate-x-1/2 animate-luxury-pulse-fast
                   bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary))_10%,transparent_70%)]
                   opacity-100 blur-xl"
        style={{ animationDuration: '6s' }}
      />

      {/* === FADE LAYER 2 (MIDDLE / PARTIAL VISIBILITY) === */}
      {/* This layer is semi-transparent, allowing text to start becoming visible. */}
      <div 
        className="absolute bottom-0 left-1/2 h-64 w-[250%] -translate-x-1/2 animate-luxury-pulse-fast
                   bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.5)_0%,transparent_70%)]
                   opacity-90"
        style={{ animationDuration: '8s' }}
      />
      
      {/* === FADE LAYER 3 (TOP / AMBIENT GLOW) === */}
      {/* The softest, widest glow for overall atmosphere. Text is fully visible here. */}
      <div 
        className="absolute bottom-0 left-1/2 h-80 w-[350%] -translate-x-1/2 animate-luxury-pulse
                   bg-[radial-gradient(ellipse_at_bottom,hsl(var(--accent)/0.3)_0%,transparent_70%)]
                   opacity-80"
        style={{ animationDuration: '12s' }}
      />

      {/* Particles shooting up from the bright core */}
      <div className="absolute inset-0">
        {particles.map(p => (
          <div key={p.id} style={p.style} />
        ))}
      </div>
    </div>
  );
};

export default BottomGlowEffect;
