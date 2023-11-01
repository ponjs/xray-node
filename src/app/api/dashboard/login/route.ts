import { CookieName, setCookie } from '@/lib/cookie'

type TBody = { username: string; password: string }

export async function POST(request: Request) {
  const body: TBody = await request.json()

  if (body.username !== process.env.X_USERNAME || body.password !== process.env.X_PASSWORD) {
    return Response.json({ code: 422, msg: '用户名或密码错误' })
  }

  const cookieHeader = await setCookie(CookieName.MANAGES, {
    username: process.env.X_USERNAME,
    password: process.env.X_PASSWORD,
  })

  return Response.json(
    { code: 200, msg: 'ok' },
    {
      headers: cookieHeader,
    }
  )
}
