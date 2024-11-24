import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const session = cookies().get('session')?.value || '';

  //Verify the session cookie
  if (!session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    await getAuth().verifySessionCookie(session, true);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}