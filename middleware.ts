import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  
  const cookieHeader = req.headers.get('cookie') || '';
  const cookieSize = new Blob([cookieHeader]).size;
  
  if (cookieSize > 4096) {
    console.warn(`Cookie size too large: ${cookieSize} bytes`);
    
    const cookiesToKeep = ['next-auth.session-token', '__Secure-next-auth.session-token'];
    const cookies = cookieHeader.split(';').map(c => c.trim());
    
    cookies.forEach(cookie => {
      const [name] = cookie.split('=');
      if (!cookiesToKeep.some(keep => name.includes(keep))) {
        response.cookies.delete(name);
      }
    });
  }
  
  return response;
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_next|favicon.ico|@vite|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|map)$).*)',
  ],
};
