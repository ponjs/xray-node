import prisma from '@/lib/prisma'
import * as api from '@/lib/services/api'
import convertModel from '@/lib/services/convertModel'
import getInbound from '@/lib/services/getInbound'
import getStatus from '@/lib/services/getStatus'
import testConnect from '@/lib/services/testConnect'
import toInbound from '@/lib/services/toInbound'
import ForceUpdate from './ForceUpdate'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const forceUpdate = new ForceUpdate({
  maximum: 2,
  interval: 30 * 1000,
  continuous: 2,
})

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

  const upsert = async () => {
    const params: XInboundParams = {
      remark: user.name,
      up: inbound?.up ?? 0,
      down: inbound?.down ?? 0,
      total: inbound?.total ?? 0,
      enable: inbound?.enable ?? true,
      expiryTime: inbound?.expiryTime ?? 0,
      ...convertModel(user.model),
    }
    inbound ? await api.update(inbound.id, params) : await api.add(params)
    return genLink(params)
  }

  const forceUpdatedLink = await forceUpdate.call(user.name, upsert)
  if (forceUpdatedLink) return new Response(forceUpdatedLink)

  if (inbound) {
    const { isBexpired, isExceeded, isDisabled } = getStatus(inbound)
    if (isBexpired || isExceeded || isDisabled || (await testConnect(service, inbound.port))) {
      return new Response(genLink(inbound))
    }
  }

  const link = await upsert()
  return new Response(link)
}
