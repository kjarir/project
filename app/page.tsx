'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Book, FileText, Github, RefreshCw, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

export default function Home() {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)

  useEffect(() => {
    // Hero section animation
    const heroText = new SplitType('#hero-title', { types: 'chars' })
    const heroParagraph = new SplitType('#hero-description', { types: 'lines' })

    gsap.from(heroText.chars, {
      opacity: 0,
      y: 50,
      stagger: 0.02,
      duration: 1,
      ease: 'power4.out',
    })

    gsap.from(heroParagraph.lines, {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out',
    })

    // Features section parallax
    const features = gsap.utils.toArray('.feature-card')
    features.forEach((feature: any) => {
      gsap.from(feature, {
        y: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: feature,
          start: 'top bottom-=100',
          end: 'top center',
          scrub: 1,
        },
      })
    })

    // How it works section
    const steps = gsap.utils.toArray('.step')
    steps.forEach((step: any, index) => {
      gsap.from(step, {
        x: index % 2 === 0 ? -100 : 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: step,
          start: 'top bottom-=100',
          end: 'top center',
          scrub: 1,
        },
      })
    })
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Beautiful documentation from your GitHub repos
            </h1>
            <p id="hero-description" className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Turn your GitHub repository Markdown files into professional documentation sites with just a few clicks. No configuration needed.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/login">
                  <Github className="h-5 w-5" />
                  <span>Get Started with GitHub</span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/docs">
                  <span>View Documentation</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Why Choose GitDocify?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform makes documentation simple, beautiful, and connected to your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card bg-card p-6 rounded-lg shadow-sm border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                <Github className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">GitHub Integration</h3>
              <p className="text-muted-foreground">
                Connect directly with your GitHub repositories. No need to maintain separate documentation systems.
              </p>
            </div>

            <div className="feature-card bg-card p-6 rounded-lg shadow-sm border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Markdown Rendering</h3>
              <p className="text-muted-foreground">
                Beautiful rendering of your Markdown files with support for code syntax highlighting, tables, and more.
              </p>
            </div>

            <div className="feature-card bg-card p-6 rounded-lg shadow-sm border">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto-Sync</h3>
              <p className="text-muted-foreground">
                Your documentation automatically updates when you push changes to your repository.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get your documentation online
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="step text-center">
              <div className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Connect GitHub</h3>
              <p className="text-muted-foreground">
                Authorize GitDocify to access your GitHub repositories.
              </p>
            </div>

            <div className="step text-center">
              <div className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Select Repository</h3>
              <p className="text-muted-foreground">
                Choose the repository containing your documentation Markdown files.
              </p>
            </div>

            <div className="step text-center">
              <div className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Share Your Docs</h3>
              <p className="text-muted-foreground">
                Get a unique URL to share your beautiful documentation with the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">Ready to simplify your documentation?</h2>
            <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of developers who have already streamlined their documentation process with GitDocify.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8 gap-2">
              <Link href="/login">
                <Github className="h-5 w-5" />
                <span>Start for Free</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}