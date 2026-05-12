import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { updatePaket } from "../../actions";

export default async function EditPaketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paket = await prisma.pakets.findUnique({ where: { id: BigInt(id) } });
  if (!paket) return notFound();

  const updateWithId = updatePaket.bind(null, id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pakets" className="p-2 bg-white text-slate-500 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm border border-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">Edit Paket</h1>
          <p className="text-slate-500 mt-1">Ubah detail paket menu</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form action={updateWithId} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nama Paket</label>
              <input name="nama_paket" type="text" required defaultValue={paket.nama_paket || ""} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Jenis</label>
              <select name="jenis" required defaultValue={paket.jenis || "Prasmanan"} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none">
                <option value="Prasmanan">Prasmanan</option>
                <option value="Box">Box</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Kategori</label>
              <select name="kategori" required defaultValue={paket.kategori || "Pernikahan"} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none">
                <option value="Pernikahan">Pernikahan</option>
                <option value="Selamatan">Selamatan</option>
                <option value="Ulang_Tahun">Ulang Tahun</option>
                <option value="Studi_Tour">Studi Tour</option>
                <option value="Rapat">Rapat</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Jumlah Pax</label>
              <input name="jumlah_pax" type="number" min="1" required defaultValue={paket.jumlah_pax || ""} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Harga Paket (Rp)</label>
              <input name="harga_paket" type="number" min="0" required defaultValue={paket.harga_paket || ""} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">URL Foto (Opsional)</label>
              <input name="foto1" type="text" defaultValue={paket.foto1 || ""} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Deskripsi</label>
            <textarea name="deskripsi" rows={4} required defaultValue={paket.deskripsi || ""} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"></textarea>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
              <Save className="w-5 h-5" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
