import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// ======================
// GET - Ambil semua data
// ======================
export async function GET() {
  try {
    const data = await prisma.pakets.findMany({
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal mengambil data' },
      { status: 500 }
    )
  }
}


// ======================
// POST - Tambah data
// ======================
export async function POST(req: Request) {
  try {
    const body = await req.json()

    // VALIDASI
    if (!body.nama_paket || !body.jenis) {
      return NextResponse.json(
        { message: 'nama_paket dan jenis wajib diisi' },
        { status: 400 }
      )
    }

    const data = await prisma.pakets.create({
      data: {
        nama_paket: body.nama_paket,
        jenis: body.jenis,
        kategori: body.kategori,
        jumlah_pax: body.jumlah_pax,
        harga_paket: body.harga_paket,
        deskripsi: body.deskripsi
      }
    })

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal menambahkan data' },
      { status: 500 }
    )
  }
}


// ======================
// PUT - Update data
// ======================
export async function PUT(req: Request) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json(
        { message: 'ID wajib diisi' },
        { status: 400 }
      )
    }

    const data = await prisma.pakets.update({
      where: {
        id: BigInt(body.id)
      },
      data: {
        ...(body.nama_paket && { nama_paket: body.nama_paket }),
        ...(body.jenis && { jenis: body.jenis }),
        ...(body.kategori && { kategori: body.kategori }),
        ...(body.jumlah_pax && { jumlah_pax: body.jumlah_pax }),
        ...(body.harga_paket && { harga_paket: body.harga_paket }),
        ...(body.deskripsi && { deskripsi: body.deskripsi })
      }
    })

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal update data' },
      { status: 500 }
    )
  }
}


// ======================
// DELETE - Hapus data
// ======================
export async function DELETE(req: Request) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json(
        { message: 'ID wajib diisi' },
        { status: 400 }
      )
    }

    await prisma.pakets.delete({
      where: {
        id: BigInt(body.id)
      }
    })

    return NextResponse.json({
      message: 'Data berhasil dihapus'
    })

  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal menghapus data' },
      { status: 500 }
    )
  }
}