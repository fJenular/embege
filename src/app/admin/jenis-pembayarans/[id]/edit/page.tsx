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
    <div className="max-w-xl mx-auto space-y-6 p-1">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/jenis-pembayarans" 
          className="p-2.5 bg-white text-zinc-500 rounded-xl hover:bg-zinc-50 hover:text-zinc-900 transition-all border border-zinc-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] active:scale-95 duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Edit Metode Bayar</h1>
          <p className="text-zinc-400 mt-1 text-xs font-medium">Ubah metode pembayaran untuk transaksi</p>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] border border-zinc-200/60 overflow-hidden">
        <form action={updateWithId} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Metode Pembayaran</label>
            <input 
              name="metode_pembayaran" 
              type="text" 
              required 
              defaultValue={item.metode_pembayaran || ""} 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-zinc-900" 
            />
          </div>
          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" /> Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
