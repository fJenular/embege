import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Search, Package, Filter, ArrowUpRight } from "lucide-react";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function PaketsPage() {
  const pakets = await prisma.pakets.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="space-y-6 p-1">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1591dc] font-bold text-xs uppercase tracking-[0.15em] mb-1.5">
            <Package className="w-3.5 h-3.5" />
            Catalog Management
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Paket Menu</h1>
          <p className="text-zinc-400 mt-1.5 text-sm font-medium">Manage your catering packages and pricing.</p>
        </div>
        
        <Link 
          href="/admin/pakets/create" 
          className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-[0_2px_8px_rgba(24,24,27,0.05)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Package
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] border border-zinc-200/60 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-4 bg-zinc-50/10">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 focus-within:text-zinc-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search packages..." 
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-200/60 focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 rounded-xl text-sm font-medium outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer">
              <Filter className="w-4 h-4 text-zinc-400" />
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-100">
                <th className="px-8 py-4">Product Information</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Service Type</th>
                <th className="px-6 py-4">Pax Capacity</th>
                <th className="px-6 py-4 text-right">Unit Price</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {pakets.map((paket) => (
                <tr key={paket.id.toString()} className="hover:bg-zinc-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-zinc-50 text-zinc-400 flex items-center justify-center shrink-0 border border-zinc-200/50 overflow-hidden">
                        {paket.foto1 ? (
                          <img src={paket.foto1} alt={paket.nama_paket || ""} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 opacity-30" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 leading-tight group-hover:text-[#1591dc] transition-colors">{paket.nama_paket}</p>
                        <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">ID: {paket.id.toString().padStart(4, "0")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-blue-50/60 text-blue-600 border border-blue-100/50 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                      {paket.kategori?.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-zinc-100 text-zinc-500 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                      {paket.jenis}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-zinc-600 font-medium">
                    {paket.jumlah_pax} <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-0.5">Pax</span>
                  </td>
                  <td className="px-6 py-5 text-right font-semibold text-zinc-950">
                    Rp {paket.harga_paket?.toLocaleString("id-ID")}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link 
                        href={`/admin/pakets/${paket.id}/edit`}
                        className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteButton id={paket.id.toString()} />
                    </div>
                  </td>
                </tr>
              ))}
              {pakets.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-zinc-300" />
                      </div>
                      <p className="font-semibold text-zinc-900 text-lg tracking-tight">Catalog Empty</p>
                      <p className="text-zinc-400 text-xs mt-1.5 font-medium leading-relaxed">You haven&apos;t added any packages yet. Start by creating your first menu.</p>
                      <Link 
                        href="/admin/pakets/create" 
                        className="inline-flex items-center gap-1 text-[#1591dc] hover:text-blue-700 font-bold text-xs mt-4 group"
                      >
                        Create Now <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-zinc-100 bg-zinc-50/10 flex justify-between items-center">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Showing {pakets.length} Total Packages</p>
          <div className="flex gap-2">
            <button disabled className="w-8 h-8 flex items-center justify-center bg-white border border-zinc-200 text-zinc-300 rounded-lg text-xs cursor-not-allowed">1</button>
          </div>
        </div>
      </div>
    </div>
  );
}
