import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getRepositoryContent, getRepositoryReadme, GitHubError } from '@/lib/github'

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!(session?.user && (session.user as any).accessToken)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const owner = searchParams.get('owner')
    const repo = searchParams.get('repo')
    const path = searchParams.get('path') || ''

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const content = await getRepositoryContent(
      (session.user as any).accessToken as string,
      owner,
      repo,
      path
    )

    return NextResponse.json(content)
  } catch (error) {
    // Log error for debugging
    console.error('API /api/repo error:', error)
    if (error instanceof GitHubError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      )
    }
    // Return error details in development
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json(
        { error: error?.message || 'Internal server error', stack: error?.stack },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 