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

// ======================
// GET - Ambil semua pemesanan
// ======================
export async function GET() {
  try {
    const data = await prisma.pemesanans.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        pelanggans: {
          select: { id: true, nama_pelanggan: true, telepon: true }
        }
      }
    })

    return NextResponse.json(serializeBigInt(data))
  } catch (error) {
    console.error('[GET /api/pemesanans]', error)
    return NextResponse.json(
      { message: 'Gagal mengambil data pemesanan' },
      { status: 500 }
    )
  }
}

// ======================
// POST - Tambah pemesanan baru
// ======================
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id_pelanggan } = body

    if (!id_pelanggan) {
      return NextResponse.json(
        { message: 'id_pelanggan wajib diisi' },
        { status: 400 }
      )
    }

    const no_resi = `INV-${Date.now()}`

    const pemesanan = await prisma.pemesanans.create({
      data: {
        pelanggans: {
          connect: {
            id: BigInt(id_pelanggan)
          }
        },
        no_resi: no_resi,
        tgl_pesan: new Date(),
        total_bayar: BigInt(body.total_bayar || 0),
        status_pesan: 'Menunggu_Konfirmasi',
        ...(body.id_jenis_bayar ? {
          jenis_pembayarans: {
            connect: {
              id: BigInt(body.id_jenis_bayar)
            }
          }
        } : {}),
        ...(body.items && body.items.length > 0 ? {
          detail_pemesanans: {
            create: body.items.map((item: any) => ({
              id_paket: BigInt(item.id_paket),
              subtotal: BigInt(item.subtotal || 0)
            }))
          }
        } : {})
      }
    })

    return NextResponse.json(serializeBigInt(pemesanan), { status: 201 })
  } catch (error) {
    console.error('[POST /api/pemesanans]', error)
    return NextResponse.json(
      { message: 'Gagal membuat pemesanan', error: String(error) },
      { status: 500 }
    )
  }
}