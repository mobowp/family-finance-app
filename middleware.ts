import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_next|favicon.ico|@vite|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|map)$).*)',
  ],
};
