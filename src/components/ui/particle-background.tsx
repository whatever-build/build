"use client"

import React, { useEffect, useState, useMemo } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import type { Container, ISourceOptions } from "@tsparticles/engine"

/**
 * @fileOverview Professional-grade blockchain network particle background.
 * Optimized for performance with subtle glowing connections and interactive "grab" effect.
 */

export function ParticleBackground() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: -1,
      },
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "grab",
            parallax: {
              enable: true,
              force: 20,
              smooth: 10,
            },
          },
          resize: {
            enable: true,
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          grab: {
            distance: 140,
            links: {
              opacity: 0.8,
              color: "#4facfe",
            },
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#4facfe",
          distance: 140,
          enable: true,
          opacity: 0.35,
          width: 1,
          shadow: {
            enable: true,
            blur: 8,
            color: "#4facfe",
          },
        },
        move: {
          direction: "top",
          enable: true,
          outModes: {
            default: "out",
          },
          random: false,
          speed: 0.8,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 80,
        },
        opacity: {
          value: { min: 0.1, max: 0.5 },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    []
  )

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={options}
        className="fixed inset-0 pointer-events-none z-0"
      />
    )
  }

  return null
}
