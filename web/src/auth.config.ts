import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      // Protect admin routes
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      if (isAdminRoute) {
        if (isLoggedIn && auth.user.role === 'ADMIN') return true
        return false // Redirect to login
      }
      // Protect dashboard routes
      const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard')
      if (isDashboardRoute) {
        if (isLoggedIn) return true
        return false // Redirect to login
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        if (user.id) token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
