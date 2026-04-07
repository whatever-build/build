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
        const drift = (Math.random() - 0.5) * 150; // Increased horizontal drift
        
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
            boxShadow: `0 0 15px hsl(var(--primary)), 0 0 25px hsl(var(--primary)), 0 0 40px hsl(var(--accent))`,
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
        className="absolute bottom-0 left-1/2 h-40 w-[150%] -translate-x-1/2 animate-luxury-pulse-fast
                   bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary))_0%,transparent_75%)]
                   opacity-100 blur-2xl"
        style={{ animationDuration: '6s' }}
      />
      <div 
        className="absolute bottom-0 left-1/2 h-28 w-[80%] -translate-x-1/2 animate-luxury-pulse-fast
                   bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary))_10%,transparent_65%)]
                   opacity-100 blur-lg"
        style={{ animationDuration: '5s' }}
      />

      {/* === FADE LAYER 2 (MIDDLE / PARTIAL VISIBILITY) === */}
      {/* This layer is semi-transparent, allowing text to start becoming visible. */}
      <div 
        className="absolute bottom-0 left-1/2 h-72 w-[300%] -translate-x-1/2 animate-luxury-pulse-fast
                   bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.5)_0%,transparent_70%)]
                   opacity-100"
        style={{ animationDuration: '8s' }}
      />
      
      {/* === FADE LAYER 3 (TOP / AMBIENT GLOW) === */}
      {/* The softest, widest glow for overall atmosphere. Text is fully visible here. */}
      <div 
        className="absolute bottom-0 left-1/2 h-96 w-[400%] -translate-x-1/2 animate-luxury-pulse
                   bg-[radial-gradient(ellipse_at_bottom,hsl(var(--accent)/0.3)_0%,transparent_70%)]
                   opacity-90"
        style={{ animationDuration: '12s' }}
      />

      {/* === Ultra Premium Reflective Scan Line === */}
      <div 
        className="absolute left-1/2 top-[calc(100%-1.2rem)] w-[70%] h-0.5 -translate-x-1/2
                  animate-scanline-glow"
        style={{ 
            willChange: 'transform, box-shadow, opacity',
            maskImage: 'linear-gradient(to right, transparent, white 25%, white 75%, transparent)'
        }}
      >
        {/* The solid white line in the middle */}
        <div className="w-full h-full bg-white opacity-90" />
        
        {/* The reflection below */}
        <div 
          className="absolute top-full w-full h-12
                     bg-[linear-gradient(to_top,hsl(var(--primary)/0.35)_0%,transparent_75%)]
                     blur-md"
        />
      </div>


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
