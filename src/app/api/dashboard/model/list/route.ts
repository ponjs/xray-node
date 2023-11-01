import prisma from '@/lib/prisma'

export async function GET() {
  const models = await prisma.model.findMany({
    include: {
      _count: {
        select: { users: true },
      },
    },
  })

  return Response.json({ code: 200, msg: 'ok', data: models })
}
