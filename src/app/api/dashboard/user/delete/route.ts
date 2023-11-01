import prisma from '@/lib/prisma'
import * as api from '@/lib/services/api'
import getInbound from '@/lib/services/getInbound'

type TBody = { id: number }

export async function POST(request: Request) {
  const { id }: TBody = await request.json()

  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    return Response.json({
      code: 500,
      msg: '该用户不存在',
    })
  }

  const inbound = await getInbound(user.name)

  await Promise.allSettled([
    inbound && api.remove(inbound.id),
    prisma.user.delete({ where: { id } }),
  ])

  return Response.json({ code: 200, msg: 'ok' })
}
