import { useEffect, useState } from 'react'
import SplashCursor from '../ReactBits/TextSplit/SplashCursor'

/** Réglages visuels très discrets (tous profils). */
const SMOKE_VISUAL = {
  DENSITY_DISSIPATION: 6,
  VELOCITY_DISSIPATION: 3.2,
  PRESSURE: 0.1,
  CURL: 1.5,
  SPLAT_RADIUS: 0.09,
  SPLAT_FORCE: 1100,
  COLOR_UPDATE_SPEED: 6,
  TRANSPARENT: true,
  RAINBOW_MODE: false,
  COLOR: '#4ade80',
  BACK_COLOR: { r: 0.02, g: 0.06, b: 0.02 },
}

/** Résolution / FPS selon la machine. */
const PERF_PROFILES = {
  low: {
    SIM_RESOLUTION: 48,
    DYE_RESOLUTION: 320,
    CAPTURE_RESOLUTION: 256,
    PRESSURE_ITERATIONS: 5,
    TARGET_FPS: 24,
    PIXEL_RATIO_MAX: 1,
    SHADING: false,
  },
  medium: {
    SIM_RESOLUTION: 64,
    DYE_RESOLUTION: 448,
    CAPTURE_RESOLUTION: 320,
    PRESSURE_ITERATIONS: 7,
    TARGET_FPS: 30,
    PIXEL_RATIO_MAX: 1,
    SHADING: false,
  },
  high: {
    SIM_RESOLUTION: 64,
    DYE_RESOLUTION: 512,
    CAPTURE_RESOLUTION: 384,
    PRESSURE_ITERATIONS: 8,
    TARGET_FPS: 40,
    PIXEL_RATIO_MAX: 1.15,
    SHADING: false,
  },
}

function detectPerfProfile() {
  if (typeof window === 'undefined') return 'medium'

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'off'
  }

  const cores = navigator.hardwareConcurrency || 4
  const mem = navigator.deviceMemory ?? 4

  if (cores <= 2 || mem <= 2) return 'low'
  if (cores <= 4 || mem <= 4) return 'medium'
  return 'high'
}

/**
 * Fumée fluide néon verte très légère, optimisée PC lent.
 */
export default function NeonSmokeCursor() {
  const [profile, setProfile] = useState('medium')

  useEffect(() => {
    setProfile(detectPerfProfile())
  }, [])

  if (profile === 'off') return null

  const perf = PERF_PROFILES[profile] ?? PERF_PROFILES.medium

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(34, 197, 94, 0.03) 0%, transparent 55%)',
          }}
        />
      </div>
      <SplashCursor {...SMOKE_VISUAL} {...perf} />
    </>
  )
}
