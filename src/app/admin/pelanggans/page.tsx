import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Users } from "lucide-react";
import DeletePelangganButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function PelanggansPage() {
  const pelanggans = await prisma.pelanggans.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">Daftar Pelanggan</h1>
          <p className="text-slate-500 mt-1">Kelola data pelanggan catering</p>
        </div>
        <Link href="/admin/pelanggans/create" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Tambah Pelanggan
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase tracking-wider">
                <th className="p-4 font-semibold">Nama</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Telepon</th>
                <th className="p-4 font-semibold">Alamat</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {pelanggans.map((p) => (
                <tr key={p.id.toString()} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 font-bold text-sm">
                        {(p.nama_pelanggan || "?").charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-blue-950">{p.nama_pelanggan}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500">{p.email || "-"}</td>
                  <td className="p-4 text-slate-500">{p.telepon || "-"}</td>
                  <td className="p-4 text-slate-500 max-w-[200px] truncate">{p.alamat1 || "-"}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/pelanggans/${p.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeletePelangganButton id={p.id.toString()} />
                    </div>
                  </td>
                </tr>
              ))}
              {pelanggans.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    <Users className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                    <p className="font-semibold text-slate-500">Belum ada data pelanggan</p>
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
