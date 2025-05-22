import Lenis from '@studio-freight/lenis'

let lenis: Lenis | null = null

export function initSmoothScroll() {
  if (typeof window === 'undefined') return

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 1,
  })

  function raf(time: number) {
    lenis?.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
}

export function scrollTo(target: string | number | HTMLElement) {
  lenis?.scrollTo(target)
}