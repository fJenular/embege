import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { updateJenisBayar } from "../../actions";

export default async function EditJenisBayarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.jenis_pembayarans.findUnique({ where: { id: BigInt(id) } });
  if (!item) return notFound();
  const updateWithId = updateJenisBayar.bind(null, id);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/jenis-pembayarans" className="p-2 bg-white text-slate-500 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm border border-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">Edit Metode Bayar</h1>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form action={updateWithId} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Metode Pembayaran</label>
            <input name="metode_pembayaran" type="text" required defaultValue={item.metode_pembayaran || ""} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
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
