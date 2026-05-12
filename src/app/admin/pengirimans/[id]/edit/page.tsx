import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { updatePengiriman } from "../../actions";

export default async function EditPengirimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pengiriman = await prisma.pengirimans.findUnique({
    where: { id: BigInt(id) },
    include: { pemesanans: { include: { pelanggans: true } }, users: true },
  });
  if (!pengiriman) return notFound();

  const pemesanans = await prisma.pemesanans.findMany({
    include: { pelanggans: true },
    orderBy: { created_at: "desc" },
  });
  const kurirs = await prisma.users.findMany({ where: { level: "kurir" } });

  const updateWithId = updatePengiriman.bind(null, id);

  const formatDateForInput = (date: Date | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/pengirimans"
          className="p-2 bg-white text-slate-500 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm border border-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">Edit Pengiriman</h1>
          <p className="text-slate-500 mt-1">Perbarui data pengiriman #{id.padStart(4, "0")}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form action={updateWithId} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Pesanan</label>
              <select
                name="id_pesan"
                required
                defaultValue={pengiriman.id_pesan?.toString() || ""}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
              >
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
              <select
                name="id_user"
                defaultValue={pengiriman.id_user?.toString() || ""}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="">Pilih kurir...</option>
                {kurirs.map((k) => (
                  <option key={k.id.toString()} value={k.id.toString()}>{k.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tanggal Kirim</label>
              <input
                name="tgl_kirim"
                type="datetime-local"
                defaultValue={formatDateForInput(pengiriman.tgl_kirim)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Status Kirim</label>
              <select
                name="status_kirim"
                defaultValue={pengiriman.status_kirim || "Sedang_Dikirim"}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
              >
                <option value="Sedang_Dikirim">Sedang Dikirim</option>
                <option value="Tiba_Ditujuan">Tiba di Tujuan</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Save className="w-5 h-5" /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
