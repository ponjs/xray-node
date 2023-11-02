import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
