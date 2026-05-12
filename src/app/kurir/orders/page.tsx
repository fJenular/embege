import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShoppingCart, Eye, Clock, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function KurirOrdersPage() {
  const pemesanans = await prisma.pemesanans.findMany({
    orderBy: { created_at: "desc" },
    include: {
      pelanggans: true,
      detail_pemesanans: { include: { pakets: true } },
      pengirimans: { include: { users: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-blue-950">Daftar Pesanan</h1>
        <p className="text-slate-500 mt-1">Lihat semua pesanan dan detail pengiriman</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase tracking-wider">
                <th className="p-4 font-semibold">No Resi</th>
                <th className="p-4 font-semibold">Pelanggan</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status Pesan</th>
                <th className="p-4 font-semibold">Status Kirim</th>
                <th className="p-4 font-semibold text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {pemesanans.map((p) => {
                const pengiriman = p.pengirimans[0];
                return (
                  <tr key={p.id.toString()} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-blue-950">{p.no_resi || `#${p.id.toString().padStart(4, "0")}`}</td>
                    <td className="p-4">
                      <div className="font-semibold text-blue-950">{p.pelanggans?.nama_pelanggan || "-"}</div>
                      <div className="text-xs text-slate-400">{p.pelanggans?.telepon || ""}</div>
                    </td>
                    <td className="p-4 text-slate-500">{p.detail_pemesanans.length} item</td>
                    <td className="p-4 font-bold text-emerald-600">Rp {p.total_bayar?.toLocaleString("id-ID") || "0"}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        p.status_pesan === "Menunggu_Konfirmasi" ? "bg-amber-100 text-amber-700"
                          : p.status_pesan === "Sedang_Diproses" ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {p.status_pesan === "Menunggu_Konfirmasi" ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {p.status_pesan?.replace(/_/g, " ") || "-"}
                      </span>
                    </td>
                    <td className="p-4">
                      {pengiriman ? (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          pengiriman.status_kirim === "Sedang_Dikirim" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                        }`}>
                          {pengiriman.status_kirim?.replace(/_/g, " ")}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/kurir/orders/${p.id}`} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-flex">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {pemesanans.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <ShoppingCart className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                    <p className="font-semibold text-slate-500">Belum ada pesanan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
