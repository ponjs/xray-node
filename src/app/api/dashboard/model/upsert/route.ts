import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const formData = await request.formData()
  const { id, ...body }: any = Object.fromEntries(formData.entries())

  const model = id
    ? await prisma.model.update({
        where: { id: Number(id) },
        data: body,
      })
    : await prisma.model.create({ data: body })

  return Response.json({ code: 200, msg: 'ok', data: model })
}
