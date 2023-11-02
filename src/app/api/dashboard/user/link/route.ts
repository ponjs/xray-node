import prisma from '@/lib/prisma'
import getInbound from '@/lib/services/getInbound'
import toInbound from '@/lib/services/toInbound'
import type { NextRequest } from 'next/server'

const failRes: TResponse = { code: 422, msg: '用户不存在' }

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id || isNaN(Number(id))) return Response.json(failRes)

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { model: true },
  })
  if (!user) return Response.json(failRes)

  const inbound = await getInbound(user.name)
  if (!inbound) return Response.json(failRes)

  const _inbound = toInbound(inbound)
  const address = user.model.host || new URL(process.env.X_BASE_URL || '').hostname
  const link = _inbound.genLink(address, user.name)

  return Response.json({ code: 200, msg: 'ok', data: link })
}
