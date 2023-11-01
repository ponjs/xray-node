import { CookieName, clsCookie } from '@/lib/cookie'

export async function POST() {
  const cookieHeader = clsCookie(CookieName.MANAGES)

  return Response.json(
    { code: 200, msg: 'ok' },
    {
      headers: cookieHeader,
    }
  )
}
