import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()

  const data = await prisma.pelanggans.create({
    data: {
      nama_pelanggan: body.nama,
      telepon: body.no_hp,
      alamat1: body.alamat
    }
  })

  return Response.json(data)
}