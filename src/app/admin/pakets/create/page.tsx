import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createPaket } from "../actions";

export default function CreatePaketPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/pakets"
          className="p-2 bg-white text-slate-500 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm border border-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">Tambah Paket Baru</h1>
          <p className="text-slate-500 mt-1">Masukkan detail paket menu baru</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form action={createPaket} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nama Paket</label>
              <input 
                name="nama_paket" 
                type="text" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Contoh: Paket Mewah 1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Jenis</label>
              <select 
                name="jenis" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="Prasmanan">Prasmanan</option>
                <option value="Box">Box</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Kategori</label>
              <select 
                name="kategori" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="Pernikahan">Pernikahan</option>
                <option value="Selamatan">Selamatan</option>
                <option value="Ulang_Tahun">Ulang Tahun</option>
                <option value="Studi_Tour">Studi Tour</option>
                <option value="Rapat">Rapat</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Jumlah Pax</label>
              <input 
                name="jumlah_pax" 
                type="number" 
                min="1"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Contoh: 100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Harga Paket (Rp)</label>
              <input 
                name="harga_paket" 
                type="number" 
                min="0"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Contoh: 5000000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">URL Foto (Opsional)</label>
              <input 
                name="foto1" 
                type="url" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Deskripsi</label>
            <textarea 
              name="deskripsi" 
              rows={4}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              placeholder="Jelaskan detail menu yang termasuk dalam paket ini..."
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Save className="w-5 h-5" />
              Simpan Paket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
