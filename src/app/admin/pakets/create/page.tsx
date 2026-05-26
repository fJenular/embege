import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createPaket } from "../actions";

export default function CreatePaketPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 p-1">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/pakets"
          className="p-2.5 bg-white text-zinc-500 rounded-xl hover:bg-zinc-50 hover:text-zinc-900 transition-all border border-zinc-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] active:scale-95 duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Tambah Paket Baru</h1>
          <p className="text-zinc-400 mt-1 text-xs font-medium">Masukkan detail paket menu baru untuk catering</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] border border-zinc-200/60 overflow-hidden">
        <form action={createPaket} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Nama Paket</label>
              <input 
                name="nama_paket" 
                type="text" 
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-zinc-900 placeholder-zinc-400"
                placeholder="Contoh: Paket Mewah 1"
              />
            </div>
            <div className="space-y-2 relative">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Jenis</label>
              <select 
                name="jenis" 
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-zinc-900 appearance-none cursor-pointer"
              >
                <option value="Prasmanan">Prasmanan</option>
                <option value="Box">Box</option>
              </select>
            </div>
            <div className="space-y-2 relative">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Kategori</label>
              <select 
                name="kategori" 
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-zinc-900 appearance-none cursor-pointer"
              >
                <option value="Pernikahan">Pernikahan</option>
                <option value="Selamatan">Selamatan</option>
                <option value="Ulang_Tahun">Ulang Tahun</option>
                <option value="Studi_Tour">Studi Tour</option>
                <option value="Rapat">Rapat</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Jumlah Pax</label>
              <input 
                name="jumlah_pax" 
                type="number" 
                min="1"
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-zinc-900 placeholder-zinc-400"
                placeholder="Contoh: 100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Harga Paket (Rp)</label>
              <input 
                name="harga_paket" 
                type="number" 
                min="0"
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-zinc-900 placeholder-zinc-400"
                placeholder="Contoh: 5000000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">URL Foto (Opsional)</label>
              <input 
                name="foto1" 
                type="url" 
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-zinc-900 placeholder-zinc-400"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Deskripsi</label>
            <textarea 
              name="deskripsi" 
              rows={4}
              required
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all resize-none text-sm font-medium text-zinc-900 placeholder-zinc-400"
              placeholder="Jelaskan detail menu yang termasuk dalam paket ini..."
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              Simpan Paket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
