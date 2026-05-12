import prisma from "@/lib/prisma";
import Link from "next/link";
import { Truck, Plus, Edit } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">Daftar Pengiriman</h1>
          <p className="text-slate-500 mt-1">Kelola data pengiriman pesanan</p>
        </div>
        <Link href="/admin/pengirimans/create" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Buat Pengiriman
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Pesanan</th>
                <th className="p-4 font-semibold">Kurir</th>
                <th className="p-4 font-semibold">Tgl Kirim</th>
                <th className="p-4 font-semibold">Tgl Tiba</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {pengirimans.map((pg) => (
                <tr key={pg.id.toString()} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-blue-950">#{pg.id.toString().padStart(4, "0")}</td>
                  <td className="p-4">
                    <div className="font-semibold text-blue-950">{pg.pemesanans?.no_resi || "-"}</div>
                    <div className="text-xs text-slate-400">{pg.pemesanans?.pelanggans?.nama_pelanggan || ""}</div>
                  </td>
                  <td className="p-4 text-slate-600">{pg.users?.name || "-"}</td>
                  <td className="p-4 text-slate-500">{pg.tgl_kirim ? new Date(pg.tgl_kirim).toLocaleDateString("id-ID") : "-"}</td>
                  <td className="p-4 text-slate-500">{pg.tgl_tiba ? new Date(pg.tgl_tiba).toLocaleDateString("id-ID") : "-"}</td>
                  <td className="p-4">
                    <PengirimStatusSelect id={pg.id.toString()} current={pg.status_kirim || ""} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/pengirimans/${pg.id}/edit`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Truck className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                    <p className="font-semibold text-slate-500">Belum ada data pengiriman</p>
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
