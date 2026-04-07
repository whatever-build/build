"use client"

import React, { useState, useEffect } from 'react';

const PARTICLE_COUNT = 100; // Increased for a denser, more impressive flow

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
        const size = Math.random() * 2 + 1; // Smaller, more numerous particles
        const duration = Math.random() * 10 + 8;
        const delay = Math.random() * 15;
        const x = Math.random() * 100;
        const drift = (Math.random() - 0.5) * 200; // Wider drift for a more expansive feel
        
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
            // More intense particle glow
            boxShadow: `0 0 18px hsl(var(--primary)), 0 0 30px hsl(var(--primary)), 0 0 50px hsl(var(--accent))`,
            animation: `impressive-particle-rise ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s infinite`,
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
      {/* Layer 1: The "Ultra-Bright" white-hot core. This is the heart of the light. */}
      <div 
        className="absolute bottom-0 left-1/2 h-20 w-[80%] -translate-x-1/2 animate-luxury-pulse-fast
                   bg-[radial-gradient(ellipse_at_bottom,white_30%,hsl(var(--primary))_50%,transparent_70%)]
                   opacity-100 blur-lg"
        style={{ animationDuration: '4s' }}
      />
      
      {/* Layer 2: The main, intense primary color glow. This provides the volume and color. */}
      <div 
        className="absolute bottom-0 left-1/2 h-32 w-[150%] -translate-x-1/2 animate-luxury-pulse
                   bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary))_20%,transparent_65%)]
                   opacity-100 blur-2xl"
        style={{ animationDuration: '6s' }}
      />

      {/* Layer 3: A wider, softer primary glow to smooth the transition. */}
      <div 
        className="absolute bottom-0 left-1/2 h-48 w-[200%] -translate-x-1/2 animate-luxury-pulse-fast
                   bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.6)_10%,transparent_70%)]
                   opacity-100 blur-2xl"
        style={{ animationDuration: '8s' }}
      />
      
      {/* Layer 4: The final, ambient accent color haze for overall atmosphere. */}
      <div 
        className="absolute bottom-0 left-1/2 h-80 w-[350%] -translate-x-1/2 animate-luxury-pulse
                   bg-[radial-gradient(ellipse_at_bottom,hsl(var(--accent)/0.3)_20%,transparent_75%)]
                   opacity-90 blur-3xl"
        style={{ animationDuration: '12s' }}
      />

      {/* === Ultra Premium Reflective Scan Line (Now brighter) === */}
      <div 
        className="absolute left-1/2 top-[calc(100%-1.2rem)] w-[70%] h-0.5 -translate-x-1/2
                  animate-scanline-glow"
        style={{ 
            willChange: 'transform, box-shadow, opacity',
            maskImage: 'linear-gradient(to right, transparent, white 25%, white 75%, transparent)'
        }}
      >
        <div className="w-full h-full bg-white opacity-100" />
        <div 
          className="absolute top-full w-full h-16
                     bg-[linear-gradient(to_top,hsl(var(--primary)/0.7)_0%,transparent_75%)]
                     blur-lg"
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
