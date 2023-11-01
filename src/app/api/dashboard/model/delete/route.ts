import prisma from '@/lib/prisma'

type TBody = { id: number }

export async function POST(request: Request) {
  const { id }: TBody = await request.json()

  const model = await prisma.model.findUnique({
    where: { id },
    select: { _count: { select: { users: true } } },
  })

  if (!model) {
    return Response.json({
      code: 500,
      msg: '该模型不存在',
    })
  }

  if (model._count.users) {
    return Response.json({
      code: 500,
      msg: '该模型还有用户使用中，无法删除',
    })
  }

  await prisma.model.delete({ where: { id } })

  return Response.json({ code: 200, msg: 'ok' })
}
