import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShoppingCart, Eye, Clock, CheckCircle } from "lucide-react";
import DeletePemesananButton from "./DeleteButton";
import StatusSelect from "./StatusSelect";

export const dynamic = "force-dynamic";

export default async function PemesanansPage() {
  const pemesanans = await prisma.pemesanans.findMany({
    orderBy: { created_at: "desc" },
    include: {
      pelanggans: true,
      jenis_pembayarans: true,
      detail_pemesanans: { include: { pakets: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-blue-950">Daftar Pemesanan</h1>
        <p className="text-slate-500 mt-1">Kelola dan pantau semua pesanan katering</p>
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
                <th className="p-4 font-semibold">Pembayaran</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {pemesanans.map((p) => (
                <tr key={p.id.toString()} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-blue-950">{p.no_resi || `#${p.id.toString().padStart(4, "0")}`}</td>
                  <td className="p-4">
                    <div className="font-semibold text-blue-950">{p.pelanggans?.nama_pelanggan || "-"}</div>
                    <div className="text-xs text-slate-400">{p.pelanggans?.telepon || ""}</div>
                  </td>
                  <td className="p-4 text-slate-500">{p.detail_pemesanans.length} item</td>
                  <td className="p-4 font-bold text-blue-600">Rp {p.total_bayar?.toLocaleString("id-ID") || "0"}</td>
                  <td className="p-4 text-slate-500">{p.jenis_pembayarans?.metode_pembayaran || "-"}</td>
                  <td className="p-4">
                    <StatusSelect id={p.id.toString()} current={p.status_pesan || ""} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/pemesanans/${p.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <DeletePemesananButton id={p.id.toString()} />
                    </div>
                  </td>
                </tr>
              ))}
              {pemesanans.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <ShoppingCart className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                    <p className="font-semibold text-slate-500">Belum ada pemesanan</p>
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
