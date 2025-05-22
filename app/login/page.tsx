'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    gsap.from(cardRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  }, [])

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    await signIn('github', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md" ref={cardRef}>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome to GitDocify</CardTitle>
          <CardDescription>
            Log in with GitHub to start creating beautiful documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button 
            onClick={handleGitHubLogin} 
            disabled={isLoading} 
            className="w-full gap-2"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Github className="h-4 w-4" />
            )}
            {isLoading ? "Connecting..." : "Continue with GitHub"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
          <div>
            By continuing, you agree to our{' '}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}