import prisma from '@/lib/prisma'
import * as api from '@/lib/services/api'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const [inbounds, users] = await Promise.all([
    api.list(),
    prisma.user.findMany({
      select: { id: true, name: true, model: { select: { id: true, name: true, host: true } } },
    }),
  ])

  const inboundMap = new Map<string, XInboundRecord>()
  inbounds.forEach(inbound => inboundMap.set(inbound.remark, inbound))

  const data = users.map(user => ({
    ...user,
    inbound: inboundMap.get(user.name),
  }))

  return Response.json({ code: 200, msg: 'ok', data })
}
