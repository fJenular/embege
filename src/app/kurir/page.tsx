import prisma from "@/lib/prisma";
import Link from "next/link";
import { Truck, Package, Clock, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function KurirDashboardPage() {
  const [totalPengiriman, activeDeliveries, completedDeliveries] = await Promise.all([
    prisma.pengirimans.count(),
    prisma.pengirimans.count({ where: { status_kirim: "Sedang_Dikirim" } }),
    prisma.pengirimans.count({ where: { status_kirim: "Tiba_Ditujuan" } }),
  ]);

  const myDeliveries = await prisma.pengirimans.findMany({
    take: 5,
    where: { status_kirim: "Sedang_Dikirim" },
    orderBy: { created_at: "desc" },
    include: {
      pemesanans: { include: { pelanggans: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-blue-950">Dashboard Kurir 🚚</h1>
        <p className="text-slate-500 mt-2">Lihat pesanan yang perlu dikirim.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <Package className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Total Pengiriman</p>
            <p className="text-2xl font-black text-blue-950">{totalPengiriman}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-200 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Truck className="w-7 h-7 text-blue-600 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Sedang Dikirim</p>
            <p className="text-2xl font-black text-blue-600">{activeDeliveries}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-200 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Selesai</p>
            <p className="text-2xl font-black text-green-600">{completedDeliveries}</p>
          </div>
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" /> Pengiriman Aktif
          </h2>
          <Link href="/kurir/orders" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Lihat Semua →</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {myDeliveries.map((pg) => (
            <Link href={`/kurir/orders/${pg.pemesanans?.id.toString()}`} key={pg.id.toString()} className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors block">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-blue-950">{pg.pemesanans?.pelanggans?.nama_pelanggan || "-"}</p>
                <p className="text-xs text-slate-400">{pg.pemesanans?.no_resi || "-"} · {pg.tgl_kirim ? new Date(pg.tgl_kirim).toLocaleDateString("id-ID") : "-"}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold shrink-0">
                <Clock className="w-3 h-3 inline mr-1" />
                Sedang Dikirim
              </span>
            </Link>
          ))}
          {myDeliveries.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              <CheckCircle className="w-12 h-12 mx-auto text-green-200 mb-3" />
              <p className="font-semibold text-slate-500">Tidak ada pengiriman aktif</p>
              <p className="text-sm mt-1">Semua pesanan telah dikirim!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
