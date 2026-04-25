"use client"

import React from 'react';

const BottomGlowEffect = () => {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[300px] overflow-hidden"
      aria-hidden="true"
    >
      {/* NEW Layer: Perspective Grid */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{
          perspective: '300px',
        }}
      >
        <div 
          className="absolute inset-0 animate-grid-pulse"
          style={{
            transform: 'rotateX(75deg)',
            transformOrigin: 'bottom center',
            backgroundImage: `
              repeating-linear-gradient(to right, hsl(var(--primary)/0.5), hsl(var(--primary)/0.5) 1px, transparent 1px, transparent 40px),
              repeating-linear-gradient(to bottom, hsl(var(--primary)/0.5), hsl(var(--primary)/0.5) 1px, transparent 1px, transparent 40px)
            `,
          }}
        />
      </div>

      {/* Layer 1: The "Ultra-Bright" white-hot core. This is the heart of the light. */}
      <div 
        className="absolute bottom-0 left-1/2 h-20 w-[80%] -translate-x-1/2 animate-luxury-pulse-fast
                   bg-[radial-gradient(ellipse_at_bottom,white_20%,hsl(var(--primary))_50%,transparent_70%)]
                   opacity-100 blur-lg"
        style={{ animationDuration: '5s' }}
      />
      
      {/* Layer 2: The main, intense primary color glow. This provides the volume and color. */}
      <div 
        className="absolute bottom-0 left-1/2 h-32 w-[150%] -translate-x-1/2 animate-luxury-pulse
                   bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary))_20%,transparent_65%)]
                   opacity-90 blur-2xl"
        style={{ animationDuration: '7s' }}
      />
      
      {/* Layer 3: The final, ambient accent color haze for overall atmosphere. */}
      <div 
        className="absolute bottom-0 left-1/2 h-48 w-[250%] -translate-x-1/2 animate-luxury-pulse
                   bg-[radial-gradient(ellipse_at_bottom,hsl(var(--accent)/0.3)_20%,transparent_75%)]
                   opacity-80 blur-3xl"
        style={{ animationDuration: '9s' }}
      />

      {/* Ultra Premium Reflective Scan Line */}
      <div 
        className="absolute left-1/2 top-[calc(100%-1.2rem)] w-[80%] h-0.5 -translate-x-1/2
                  animate-scanline-glow"
        style={{ 
            willChange: 'transform, box-shadow, opacity',
            maskImage: 'linear-gradient(to right, transparent, white 20%, white 80%, transparent)'
        }}
      >
        <div className="w-full h-full bg-white opacity-90" />
      </div>
    </div>
  );
};

export default BottomGlowEffect;
