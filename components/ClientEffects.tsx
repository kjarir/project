'use client'
import { useEffect } from 'react'
import { initSmoothScroll } from '@/lib/smooth-scroll'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ClientEffects() {
  useEffect(() => {
    initSmoothScroll()
  }, [])
  return null
} 