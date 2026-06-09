import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Helper: serialize BigInt fields to string for JSON responses
function serializeBigInt(data: unknown): unknown {
  return JSON.parse(
    JSON.stringify(data, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = BigInt(resolvedParams.id)
    const body = await req.json()

    // Ambil data yang dikirim, bisa berupa status atau bukti_bayar
    const dataToUpdate: any = {}
    if (body.status_pesan !== undefined) {
      dataToUpdate.status_pesan = body.status_pesan
    }
    if (body.bukti_bayar !== undefined) {
      dataToUpdate.bukti_bayar = body.bukti_bayar
    }

    const updated = await prisma.pemesanans.update({
      where: { id },
      data: dataToUpdate
    })

    return NextResponse.json(serializeBigInt(updated))
  } catch (error) {
    console.error(`[PUT /api/pemesanans]`, error)
    return NextResponse.json(
      { message: 'Gagal mengupdate pemesanan' },
      { status: 500 }
    )
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = BigInt(resolvedParams.id)
    const pemesanan = await prisma.pemesanans.findUnique({
      where: { id },
      include: {
        pelanggans: true,
        jenis_pembayarans: true,
        detail_pemesanans: {
          include: {
            pakets: true
          }
        }
      }
    })

    if (!pemesanan) {
      return NextResponse.json(
        { message: 'Pemesanan tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json(serializeBigInt(pemesanan))
  } catch (error) {
    console.error(`[GET /api/pemesanans]`, error)
    return NextResponse.json(
      { message: 'Gagal mengambil detail pemesanan' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = BigInt(resolvedParams.id)

    // Delete related records first to avoid foreign key constraints
    await prisma.pengirimans.deleteMany({ where: { id_pesan: id } });
    await prisma.detail_pemesanans.deleteMany({ where: { id_pemesanan: id } });

    await prisma.pemesanans.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Pemesanan berhasil dibatalkan dan dihapus' })
  } catch (error) {
    console.error(`[DELETE /api/pemesanans]`, error)
    return NextResponse.json(
      { message: 'Gagal membatalkan pemesanan' },
      { status: 500 }
    )
  }
}
