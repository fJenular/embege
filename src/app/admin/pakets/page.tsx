import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Search, Package, MoreVertical, Filter, ArrowUpRight } from "lucide-react";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function PaketsPage() {
  const pakets = await prisma.pakets.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <Package className="w-4 h-4" />
            Catalog Management
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Paket Menu</h1>
          <p className="text-slate-400 mt-2 font-medium">Manage your catering packages and pricing.</p>
        </div>
        
        <Link 
          href="/admin/pakets/create" 
          className="flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Package
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative group flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search packages..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:border-emerald-500/50 rounded-2xl text-sm font-medium outline-none transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4 text-slate-400" />
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Product Information</th>
                <th className="px-6 py-6">Category</th>
                <th className="px-6 py-6">Service Type</th>
                <th className="px-6 py-6">Pax Capacity</th>
                <th className="px-6 py-6 text-right">Unit Price</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pakets.map((paket) => (
                <tr key={paket.id.toString()} className="hover:bg-emerald-50/30 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-[1.25rem] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-emerald-100 transition-colors overflow-hidden border-2 border-white">
                        {paket.foto1 ? (
                          <img src={paket.foto1} alt={paket.nama_paket || ""} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 opacity-40" />
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg leading-tight group-hover:text-emerald-700 transition-colors">{paket.nama_paket}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">ID: {paket.id.toString().padStart(4, "0")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      {paket.kategori?.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      {paket.jenis}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-slate-500 font-bold">
                    {paket.jumlah_pax} <span className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Persons</span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <p className="font-black text-emerald-600 text-lg">Rp {paket.harga_paket?.toLocaleString("id-ID")}</p>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/pakets/${paket.id}/edit`}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 rounded-xl transition-all shadow-sm group-hover:bg-white"
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
                  <td colSpan={6} className="p-32 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-slate-300" />
                      </div>
                      <p className="font-black text-slate-900 text-xl tracking-tight">Catalog Empty</p>
                      <p className="text-slate-400 text-sm mt-2 font-medium">You haven&apos;t added any packages yet. Start by creating your first menu.</p>
                      <Link 
                        href="/admin/pakets/create" 
                        className="inline-flex items-center gap-2 text-emerald-600 font-black text-sm mt-6 hover:gap-4 transition-all"
                      >
                        Create Now <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Showing {pakets.length} Total Packages</p>
          <div className="flex gap-2">
            <button disabled className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-300 rounded-xl cursor-not-allowed">1</button>
          </div>
        </div>
      </div>
    </div>
  );
}
