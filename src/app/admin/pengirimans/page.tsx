import prisma from "@/lib/prisma";
import Link from "next/link";
import { Truck, Plus, Edit, ArrowUpRight, Image as ImageIcon } from "lucide-react";
import DeletePengirimButton from "./DeleteButton";
import PengirimStatusSelect from "./StatusSelect";

export const dynamic = "force-dynamic";

export default async function PengirimansPage() {
  const pengirimans = await prisma.pengirimans.findMany({
    orderBy: { created_at: "desc" },
    include: {
      pemesanans: { include: { pelanggans: true } },
      users: true,
    },
  });

  return (
    <div className="space-y-6 p-1">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1591dc] font-bold text-xs uppercase tracking-[0.15em] mb-1.5">
            <Truck className="w-3.5 h-3.5" />
            Logistic Center
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Daftar Pengiriman</h1>
          <p className="text-zinc-400 mt-1.5 text-sm font-medium">Assign couriers, adjust schedules, and verify successful deliveries.</p>
        </div>
        
        <Link 
          href="/admin/pengirimans/create" 
          className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-[0_2px_8px_rgba(24,24,27,0.05)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Buat Pengiriman
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] border border-zinc-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-100">
                <th className="px-8 py-4">ID</th>
                <th className="px-6 py-4">Pesanan</th>
                <th className="px-6 py-4">Kurir</th>
                <th className="px-6 py-4">Tgl Kirim</th>
                <th className="px-6 py-4">Tgl Tiba</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-8 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {pengirimans.map((pg) => (
                <tr key={pg.id.toString()} className="hover:bg-zinc-50/30 transition-colors group">
                  <td className="px-8 py-5 font-semibold text-zinc-400">#{pg.id.toString().padStart(4, "0")}</td>
                  <td className="px-6 py-5">
                    <div className="font-semibold text-zinc-900 group-hover:text-[#1591dc] transition-colors">{pg.pemesanans?.no_resi || "-"}</div>
                    <div className="text-[10px] text-zinc-400 font-medium mt-0.5">{pg.pemesanans?.pelanggans?.nama_pelanggan || ""}</div>
                  </td>
                  <td className="px-6 py-5 text-zinc-600 font-medium">{pg.users?.name || "-"}</td>
                  <td className="px-6 py-5 text-zinc-500">{pg.tgl_kirim ? new Date(pg.tgl_kirim).toLocaleDateString("id-ID") : "-"}</td>
                  <td className="px-6 py-5">
                    <div className="text-zinc-500">{pg.tgl_tiba ? new Date(pg.tgl_tiba).toLocaleDateString("id-ID") : "-"}</div>
                    {pg.bukti_foto && (
                      <a href={pg.bukti_foto} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:underline">
                        <ImageIcon className="w-3 h-3" /> BUKTI FOTO
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <PengirimStatusSelect id={pg.id.toString()} current={pg.status_kirim || ""} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/pengirimans/${pg.id}/edit`}
                        className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeletePengirimButton id={pg.id.toString()} />
                    </div>
                  </td>
                </tr>
              ))}
              {pengirimans.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Truck className="w-8 h-8 text-zinc-300" />
                      </div>
                      <p className="font-semibold text-zinc-900 text-lg tracking-tight">No Deliveries Dispatch</p>
                      <p className="text-zinc-400 text-xs mt-1.5 font-medium leading-relaxed">Incoming deliveries can be created for verified customer orders.</p>
                      <Link 
                        href="/admin/pengirimans/create" 
                        className="inline-flex items-center gap-1 text-[#1591dc] hover:text-blue-700 font-bold text-xs mt-4 group"
                      >
                        Dispatch Delivery <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
