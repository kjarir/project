import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { signOut as nextAuthSignOut } from 'next-auth/react'

export interface User {
  id: string
  name: string
  email: string
  image?: string
  accessToken: string
}

export const getCurrentUser = async (): Promise<User | null> => {
  const session = await getServerSession(authOptions)

  if (!session?.user) return null

  return {
    id: (session.user as any).id,
    name: (session.user as any).name || '',
    email: (session.user as any).email || '',
    image: (session.user as any).image,
    accessToken: (session.user as any).accessToken,
  }
}

export const signOut = async (): Promise<void> => {
  await nextAuthSignOut({ callbackUrl: '/' })
}
