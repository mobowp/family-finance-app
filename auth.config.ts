import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      console.log(`[Auth] Path: ${nextUrl.pathname}, LoggedIn: ${isLoggedIn}`);
      // Protect all routes except auth routes and public assets
      const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
      
      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/', nextUrl));
        }
        return true;
      }
      
      // If not logged in and not on auth route, redirect to login
      if (!isLoggedIn) {
        return false; // Redirects to login page
      }
      
      return true;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
