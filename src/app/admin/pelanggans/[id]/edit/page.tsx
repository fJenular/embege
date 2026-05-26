import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { updatePelanggan } from "../../actions";

export default async function EditPelangganPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.pelanggans.findUnique({ where: { id: BigInt(id) } });
  if (!p) return notFound();
  const updateWithId = updatePelanggan.bind(null, id);

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-1">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/pelanggans" 
          className="p-2.5 bg-white text-zinc-500 rounded-xl hover:bg-zinc-50 hover:text-zinc-900 transition-all border border-zinc-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] active:scale-95 duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Edit Pelanggan</h1>
          <p className="text-zinc-400 mt-1 text-xs font-medium">Ubah data pelanggan catering yang sudah terdaftar</p>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] border border-zinc-200/60 overflow-hidden">
        <form action={updateWithId} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Nama Pelanggan</label>
              <input 
                name="nama_pelanggan" 
                type="text" 
                required 
                defaultValue={p.nama_pelanggan || ""} 
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-zinc-900" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email</label>
              <input 
                name="email" 
                type="email" 
                defaultValue={p.email || ""} 
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-zinc-900" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Telepon</label>
              <input 
                name="telepon" 
                type="text" 
                defaultValue={p.telepon || ""} 
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-zinc-900" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tanggal Lahir</label>
              <input 
                name="tgl_lahir" 
                type="date" 
                defaultValue={p.tgl_lahir ? new Date(p.tgl_lahir).toISOString().split("T")[0] : ""} 
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-zinc-900 cursor-pointer" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Alamat</label>
            <textarea 
              name="alamat1" 
              rows={3} 
              defaultValue={p.alamat1 || ""} 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all resize-none text-sm font-medium text-zinc-900"
            ></textarea>
          </div>
          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
