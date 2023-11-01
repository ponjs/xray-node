import { dashboardVerify } from './lib/cookie'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/api/dashboard/:path*'],
}

export async function middleware(request: NextRequest) {
  if (!/\/(login|logout)$/.test(request.nextUrl.pathname) && !(await dashboardVerify())) {
    return Response.json({
      code: 401,
      msg: '登录过期，请重新登录',
    })
  }
}
