import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Users, ArrowUpRight } from "lucide-react";
import DeletePelangganButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function PelanggansPage() {
  const pelanggans = await prisma.pelanggans.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="space-y-6 p-1">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1591dc] font-bold text-xs uppercase tracking-[0.15em] mb-1.5">
            <Users className="w-3.5 h-3.5" />
            Customer Registry
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Daftar Pelanggan</h1>
          <p className="text-zinc-400 mt-1.5 text-sm font-medium">Manage and review your catering customer details.</p>
        </div>
        
        <Link 
          href="/admin/pelanggans/create" 
          className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-[0_2px_8px_rgba(24,24,27,0.05)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Pelanggan
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] border border-zinc-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-100">
                <th className="px-8 py-4">Nama Pelanggan</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Telepon</th>
                <th className="px-6 py-4">Alamat</th>
                <th className="px-8 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {pelanggans.map((p) => (
                <tr key={p.id.toString()} className="hover:bg-zinc-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center font-bold text-xs">
                        {(p.nama_pelanggan || "?").charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-zinc-900 group-hover:text-[#1591dc] transition-colors">{p.nama_pelanggan}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-zinc-500">{p.email || "-"}</td>
                  <td className="px-6 py-5 text-zinc-500">{p.telepon || "-"}</td>
                  <td className="px-6 py-5 text-zinc-500 max-w-[240px] truncate">{p.alamat1 || "-"}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link 
                        href={`/admin/pelanggans/${p.id}/edit`} 
                        className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeletePelangganButton id={p.id.toString()} />
                    </div>
                  </td>
                </tr>
              ))}
              {pelanggans.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-zinc-300" />
                      </div>
                      <p className="font-semibold text-zinc-900 text-lg tracking-tight">No Customers Yet</p>
                      <p className="text-zinc-400 text-xs mt-1.5 font-medium leading-relaxed">Add details for your customers to process catering orders.</p>
                      <Link 
                        href="/admin/pelanggans/create" 
                        className="inline-flex items-center gap-1 text-[#1591dc] hover:text-blue-700 font-bold text-xs mt-4 group"
                      >
                        Add Customer <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
