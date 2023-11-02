import prisma from '@/lib/prisma'
import * as api from '@/lib/services/api'
import getInbound from '@/lib/services/getInbound'
import convertModel from '@/lib/services/convertModel'
import toInbound from '@/lib/services/toInbound'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request, { params: { node } }: { params: { node: string } }) {
  const user = await prisma.user.findUnique({
    where: { name: node },
    include: { model: true },
  })

  if (!user) return new Response(null, { status: 404 })

  const inbound = await getInbound(node)

  const params: XInboundParams = {
    remark: user.name,
    up: inbound?.up ?? 0,
    down: inbound?.down ?? 0,
    total: inbound?.total ?? 0,
    enable: inbound?.enable ?? true,
    expiryTime: inbound?.expiryTime ?? 0,
    listen: '',
    ...convertModel(user.model),
  }

  inbound ? await api.update(inbound.id, params) : await api.add(params)

  const _inbound = toInbound(params)
  const address = user.model.host || new URL(process.env.X_BASE_URL || '').hostname
  const link = _inbound.genLink(address, user.name)
  const linkBase64 = Buffer.from(link).toString('base64')

  return new Response(linkBase64)
}
