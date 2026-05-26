import prisma from "@/lib/prisma";
import { CreditCard, Plus, Edit, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import DeleteJenisBayarButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function JenisPembayaransPage() {
  const data = await prisma.jenis_pembayarans.findMany({ orderBy: { created_at: "desc" } });

  return (
    <div className="space-y-6 p-1">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1591dc] font-bold text-xs uppercase tracking-[0.15em] mb-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            Finances & Methods
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Jenis Pembayaran</h1>
          <p className="text-zinc-400 mt-1.5 text-sm font-medium">Manage and activate various payment channels for catering customers.</p>
        </div>
        
        <Link 
          href="/admin/jenis-pembayarans/create" 
          className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-[0_2px_8px_rgba(24,24,27,0.05)] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] border border-zinc-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-100">
                <th className="px-8 py-4">ID</th>
                <th className="px-6 py-4">Metode Pembayaran</th>
                <th className="px-6 py-4">Dibuat</th>
                <th className="px-8 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {data.map((item) => (
                <tr key={item.id.toString()} className="hover:bg-zinc-50/30 transition-colors group">
                  <td className="px-8 py-5 font-semibold text-zinc-400">#{item.id.toString()}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center shrink-0 border border-zinc-200/50 group-hover:text-[#1591dc] group-hover:bg-[#1591dc]/5 transition-colors">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-zinc-900 group-hover:text-[#1591dc] transition-colors">{item.metode_pembayaran}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-zinc-500">{item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : "-"}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link 
                        href={`/admin/jenis-pembayarans/${item.id}/edit`} 
                        className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteJenisBayarButton id={item.id.toString()} />
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-zinc-300" />
                      </div>
                      <p className="font-semibold text-zinc-900 text-lg tracking-tight">No Payment Methods</p>
                      <p className="text-zinc-400 text-xs mt-1.5 font-medium leading-relaxed">Define payment options to offer transactions during checkout.</p>
                      <Link 
                        href="/admin/jenis-pembayarans/create" 
                        className="inline-flex items-center gap-1 text-[#1591dc] hover:text-blue-700 font-bold text-xs mt-4 group"
                      >
                        Add Method <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
