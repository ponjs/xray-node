import prisma from '@/lib/prisma'
import * as api from '@/lib/services/api'
import getInbound from '@/lib/services/getInbound'
import convertModel from '@/lib/services/convertModel'
import { ONE_GB, toFixed } from '@/utils'

type TBody = { id?: number; name: string; modelId: number; total?: number; expiryTime?: number }

export async function POST(request: Request) {
  const { id, ...body }: TBody = await request.json()

  const user = id
    ? await prisma.user.update({
        where: { id },
        data: { modelId: body.modelId },
        select: { name: true, model: true },
      })
    : await prisma.user.create({
        data: { name: body.name, modelId: body.modelId },
        select: { name: true, model: true },
      })

  const inbound = await getInbound(user.name)

  const params: XInboundParams = {
    remark: user.name,
    up: inbound?.up ?? 0,
    down: inbound?.down ?? 0,
    total: toFixed((body.total || 0) * ONE_GB, 0),
    enable: inbound?.enable ?? true,
    expiryTime: body.expiryTime ?? 0,
    listen: '',
    ...convertModel(user.model),
  }

  inbound ? await api.update(inbound.id, params) : await api.add(params)

  return Response.json({ code: 200, msg: 'ok', data: user })
}
