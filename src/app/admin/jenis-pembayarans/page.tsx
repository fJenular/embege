import prisma from "@/lib/prisma";
import { CreditCard, Plus, Edit } from "lucide-react";
import Link from "next/link";
import DeleteJenisBayarButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function JenisPembayaransPage() {
  const data = await prisma.jenis_pembayarans.findMany({ orderBy: { created_at: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">Jenis Pembayaran</h1>
          <p className="text-slate-500 mt-1">Kelola metode pembayaran</p>
        </div>
        <Link href="/admin/jenis-pembayarans/create" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-5 h-5" /> Tambah
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Metode Pembayaran</th>
                <th className="p-4 font-semibold">Dibuat</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {data.map((item) => (
                <tr key={item.id.toString()} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-blue-950">#{item.id.toString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-blue-950">{item.metode_pembayaran}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500">{item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : "-"}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/jenis-pembayarans/${item.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteJenisBayarButton id={item.id.toString()} />
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400">
                    <CreditCard className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                    <p className="font-semibold text-slate-500">Belum ada data</p>
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
