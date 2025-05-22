import GithubProvider from 'next-auth/providers/github'
import { JWT } from 'next-auth/jwt'
import { Session, Account } from 'next-auth'

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      authorization: {
        params: {
          scope: 'read:user repo',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: Account | null }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
} 