import prisma from "@/lib/prisma";
import Link from "next/link";
import { Utensils, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OwnerPesanPage() {
  const pakets = await prisma.pakets.findMany({ orderBy: { created_at: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-blue-950">Pesan Paket</h1>
        <p className="text-slate-500 mt-1">Pilih paket catering untuk membuat pesanan baru</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pakets.map((paket) => (
          <Link href={`/pesan/${paket.id}`} key={paket.id.toString()}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:border-amber-200 transition-all group">
            <div className="h-44 bg-slate-100 relative">
              {paket.foto1 ? (
                <img src={`/storage/${paket.foto1}`} alt={paket.nama_paket || ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Utensils className="w-8 h-8 text-blue-200" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-amber-600">
                  {paket.jenis}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-blue-950 mb-1">{paket.nama_paket}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{paket.deskripsi || "Paket catering berkualitas"}</p>
              <div className="flex items-center justify-between">
                <div className="text-lg font-black text-amber-600">
                  <span className="text-xs text-amber-500 mr-0.5">Rp</span>
                  {paket.harga_paket?.toLocaleString("id-ID")}
                </div>
                <span className="text-xs text-slate-400 font-semibold">{paket.jumlah_pax} pax</span>
              </div>
            </div>
          </Link>
        ))}
        {pakets.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-blue-950 mb-2">Belum Ada Paket</h2>
            <p className="text-sm text-slate-500">Hubungi admin untuk menambahkan paket.</p>
          </div>
        )}
      </div>
    </div>
  );
}
