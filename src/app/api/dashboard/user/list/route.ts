import prisma from '@/lib/prisma'
import * as api from '@/lib/services/api'

export async function GET() {
  const inbounds = await api.list()

  const users = await prisma.user.findMany({
    select: { id: true, name: true, model: { select: { id: true, name: true, host: true } } },
  })

  const data = users.map(user => ({
    inbound: inbounds.find(inbound => inbound.remark === user.name),
    ...user,
  }))

  return Response.json({ code: 200, msg: 'ok', data })
}
