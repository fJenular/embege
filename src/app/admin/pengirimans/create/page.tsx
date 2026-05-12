import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createPengiriman } from "../actions";

export default async function CreatePengirimPage() {
  const pemesanans = await prisma.pemesanans.findMany({
    where: { status_pesan: "Menunggu_Kurir" },
    include: { pelanggans: true },
  });
  const kurirs = await prisma.users.findMany({ where: { level: "kurir" } });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pengirimans" className="p-2 bg-white text-slate-500 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm border border-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">Buat Pengiriman</h1>
          <p className="text-slate-500 mt-1">Assign kurir untuk pesanan</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form action={createPengiriman} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Pesanan</label>
              <select name="id_pesan" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none">
                <option value="">Pilih pesanan...</option>
                {pemesanans.map((p) => (
                  <option key={p.id.toString()} value={p.id.toString()}>
                    {p.no_resi} - {p.pelanggans?.nama_pelanggan || ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Kurir</label>
              <select name="id_user" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none">
                <option value="">Pilih kurir...</option>
                {kurirs.map((k) => (
                  <option key={k.id.toString()} value={k.id.toString()}>{k.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tanggal Kirim</label>
              <input name="tgl_kirim" type="datetime-local" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
              <Save className="w-5 h-5" /> Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
