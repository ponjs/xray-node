import prisma from '@/lib/prisma'
import * as api from '@/lib/services/api'
import getInbound from '@/lib/services/getInbound'
import convertModel from '@/lib/services/convertModel'

type TBody = { id: number; status: boolean }

export async function POST(request: Request) {
  const { id, status }: TBody = await request.json()

  const user = await prisma.user.findUnique({ where: { id }, include: { model: true } })

  if (!user) {
    return Response.json({
      code: 500,
      msg: '该用户不存在',
    })
  }

  const inbound = await getInbound(user.name)

  if (inbound) {
    await api.update(inbound.id, { ...inbound, enable: !!status })
  } else {
    await api.add({
      remark: user.name,
      up: 0,
      down: 0,
      total: 0,
      enable: !!status,
      expiryTime: 0,
      ...convertModel(user.model),
    })
  }

  return Response.json({ code: 200, msg: 'ok', data: user })
}
