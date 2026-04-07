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
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const size = Math.random() * 3 + 1.5; // Slightly larger & brighter particles
        const duration = Math.random() * 8 + 6; // 6s to 14s
        const delay = Math.random() * 12; // 0s to 12s
        const x = Math.random() * 100;
        const drift = (Math.random() - 0.5) * 80;
        
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
            // **Significantly brighter particle glow**
            boxShadow: `0 0 10px hsl(var(--primary)), 0 0 18px hsl(var(--primary)), 0 0 28px hsl(var(--accent))`,
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
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[250px] overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1: Soft, wide base glow */}
      <div className="absolute bottom-0 left-1/2 h-64 w-[300%] -translate-x-1/2 animate-luxury-pulse bg-[radial-gradient(50%_50%_at_50%_100%,hsl(var(--accent)/0.25)_0%,transparent_100%)] opacity-90" style={{ animationDuration: '10s' }}/>

      {/* Layer 2: Brighter primary color glow */}
      <div className="absolute bottom-0 left-1/2 h-56 w-[220%] -translate-x-1/2 animate-luxury-pulse-fast bg-[radial-gradient(50%_50%_at_50%_100%,hsl(var(--primary)/0.5)_0%,transparent_100%)]" style={{ animationDuration: '7s' }}/>
      
      {/* Layer 3: **Intense, bright core pulse** - this is the source of the seeds */}
      <div className="absolute bottom-0 left-1/2 h-48 w-[150%] -translate-x-1/2 animate-luxury-pulse-fast bg-[radial-gradient(50%_50%_at_50%_100%,hsl(var(--primary)/0.9)_0%,transparent_100%)] opacity-100" style={{ animationDuration: '5s' }}/>

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
