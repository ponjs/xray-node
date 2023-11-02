import prisma from '@/lib/prisma'
import * as api from '@/lib/services/api'
import convertModel from '@/lib/services/convertModel'
import getInbound from '@/lib/services/getInbound'
import testConnect from '@/lib/services/testConnect'
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
  const service = new URL(process.env.X_BASE_URL || '').hostname

  const genLink = (json: XInboundParams) => {
    const _inbound = toInbound(json)
    const address = user.model.host || service
    const link = _inbound.genLink(address, user.name)
    return Buffer.from(link).toString('base64')
  }

  if (inbound && (await testConnect(service, inbound.port))) {
    return new Response(genLink(inbound))
  }

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

  return new Response(genLink(params))
}
