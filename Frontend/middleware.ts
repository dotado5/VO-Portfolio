import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

const allowedOrigins = [
  'http://localhost:3000',
  'https://www.vofatoki.work',
  'https://vo-portfolio-virid.vercel.app'
  // Add your accepted URLs here
]

export async function middleware(request: NextRequest) {
  const response = await createClient(request)

  const origin = request.headers.get('origin') ?? ''

  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS')
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
  }

  // Handle preflight OPTIONS requests directly
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers: response.headers, status: 204 })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
