import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const path = req.nextUrl.pathname

  if (path.startsWith('/dashboard')) {
    if (!token) return NextResponse.redirect(new URL('/login', req.url))
    if (token.role !== 'author') return NextResponse.redirect(new URL('/', req.url))
  }

  if ((path === '/login' || path === '/register') && token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}