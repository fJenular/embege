import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShoppingCart, Truck, Package, Clock, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const [pemesanansCount, pengirimansActive, recentOrders] = await Promise.all([
    prisma.pemesanans.count(),
    prisma.pengirimans.count({ where: { status_kirim: "Sedang_Dikirim" } }),
    prisma.pemesanans.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      include: { pelanggans: true, detail_pemesanans: { include: { pakets: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-blue-950">Welcome, Owner 👋</h1>
        <p className="text-slate-500 mt-2">Pantau pesanan dan pengiriman catering Anda.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link href="/owner/pesan" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md hover:border-amber-200 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Total Pesanan</p>
            <p className="text-2xl font-black text-blue-950">{pemesanansCount}</p>
          </div>
        </Link>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Truck className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Pengiriman Aktif</p>
            <p className="text-2xl font-black text-blue-950">{pengirimansActive}</p>
          </div>
        </div>
        <Link href="/owner/pesan" className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-2xl shadow-sm border border-amber-400 flex items-center gap-5 hover:shadow-lg transition-all group text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80">Aksi Cepat</p>
            <p className="text-lg font-black">Pesan Paket →</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-blue-950">Pesanan Terbaru</h2>
          <Link href="/owner/pengiriman" className="text-sm font-semibold text-amber-600 hover:text-amber-700">Pantau Pengiriman →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-100">
              <tr>
                <th className="p-4 font-semibold">No Resi</th>
                <th className="p-4 font-semibold">Pelanggan</th>
                <th className="p-4 font-semibold">Item</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.id.toString()} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-blue-950">{order.no_resi || `#${order.id.toString().padStart(4, "0")}`}</td>
                  <td className="p-4 text-slate-600">{order.pelanggans?.nama_pelanggan || "-"}</td>
                  <td className="p-4 text-slate-500">{order.detail_pemesanans.length} item</td>
                  <td className="p-4 font-bold text-amber-600">Rp {order.total_bayar?.toLocaleString("id-ID") || "0"}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      order.status_pesan === "Menunggu_Konfirmasi" ? "bg-amber-100 text-amber-700"
                        : order.status_pesan === "Sedang_Diproses" ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {order.status_pesan === "Menunggu_Konfirmasi" ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      {order.status_pesan?.replace(/_/g, " ") || "-"}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Belum ada pesanan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
