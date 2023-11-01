import prisma from '@/lib/prisma'
import { CookieName, setCookie } from '@/lib/cookie'

type TBody = { username: string }

export async function POST(request: Request) {
  const body: TBody = await request.json()

  const username = body.username?.trim()
  if (!username) {
    return Response.json({ code: 422, msg: '用户不存在' })
  }

  const userinfo = await prisma.user.findUnique({ where: { name: username } })
  if (!userinfo) {
    return Response.json({ code: 422, msg: '用户不存在' })
  }

  const cookieHeader = await setCookie(CookieName.SESSION, {
    username: userinfo.name,
  })

  return Response.json(
    { code: 200, msg: 'ok' },
    {
      headers: cookieHeader,
    }
  )
}
