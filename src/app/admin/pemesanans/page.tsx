import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShoppingCart, Eye, ArrowUpRight } from "lucide-react";
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
    <div className="space-y-6 p-1">
      {/* Header section */}
      <div>
        <div className="flex items-center gap-2 text-[#1591dc] font-bold text-xs uppercase tracking-[0.15em] mb-1.5">
          <ShoppingCart className="w-3.5 h-3.5" />
          Order Flow
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Daftar Pemesanan</h1>
        <p className="text-zinc-400 mt-1.5 text-sm font-medium">Monitor payments, track items, and manage delivery statuses.</p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] border border-zinc-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-100">
                <th className="px-8 py-4">No Resi</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Pembayaran</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-8 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {pemesanans.map((p) => (
                <tr key={p.id.toString()} className="hover:bg-zinc-50/30 transition-colors group">
                  <td className="px-8 py-5 font-semibold text-zinc-900">
                    {p.no_resi || `#${p.id.toString().padStart(4, "0")}`}
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-semibold text-zinc-900 group-hover:text-[#1591dc] transition-colors">
                      {p.pelanggans?.nama_pelanggan || "Guest"}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-medium mt-0.5">{p.pelanggans?.telepon || ""}</div>
                  </td>
                  <td className="px-6 py-5 text-zinc-500 font-medium">{p.detail_pemesanans.length} item</td>
                  <td className="px-6 py-5 font-semibold text-zinc-950">
                    Rp {p.total_bayar?.toLocaleString("id-ID") || "0"}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-zinc-200/50">
                      {p.jenis_pembayarans?.metode_pembayaran || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <StatusSelect id={p.id.toString()} current={p.status_pesan || ""} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link 
                        href={`/admin/pemesanans/${p.id}`} 
                        className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <DeletePemesananButton id={p.id.toString()} />
                    </div>
                  </td>
                </tr>
              ))}
              {pemesanans.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-8 h-8 text-zinc-300" />
                      </div>
                      <p className="font-semibold text-zinc-900 text-lg tracking-tight">No Orders Yet</p>
                      <p className="text-zinc-400 text-xs mt-1.5 font-medium leading-relaxed">Incoming customer orders will appear here automatically.</p>
                      <Link 
                        href="/pesan" 
                        className="inline-flex items-center gap-1 text-[#1591dc] hover:text-blue-700 font-bold text-xs mt-4 group"
                      >
                        Go to POS Menu <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
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
