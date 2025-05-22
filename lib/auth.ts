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
    id: session.user.id,
    name: session.user.name || '',
    email: session.user.email || '',
    image: session.user.image,
    accessToken: session.user.accessToken,
  }
}

export const signOut = async (): Promise<void> => {
  await nextAuthSignOut({ callbackUrl: '/' })
}
