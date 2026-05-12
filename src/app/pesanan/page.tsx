import prisma from "@/lib/prisma";
import { PackageOpen, CheckCircle, Clock, Utensils, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PesananPage() {
  const pesananList = await prisma.pemesanans.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      pelanggans: true,
    }
  });

  return (
    <main className="flex-1 flex flex-col overflow-y-auto px-8 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-950 mb-1">Daftar Pesanan</h1>
          <p className="text-sm text-blue-500">Kelola dan pantau semua pesanan katering Anda.</p>
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
          <input 
            type="text" 
            placeholder="Cari pesanan..." 
            className="pl-10 pr-4 py-2 rounded-full border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
          />
        </div>
      </div>

      {pesananList.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-blue-100 shadow-sm flex flex-col items-center justify-center flex-1">
          <Utensils className="w-16 h-16 text-zinc-200 mb-4" />
          <h2 className="text-lg font-bold text-blue-950 mb-2">Belum Ada Pesanan</h2>
          <p className="text-sm text-blue-500">Belum ada pesanan katering untuk saat ini.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-blue-50/50 border-b border-blue-100 text-blue-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID Pesanan</th>
                  <th className="px-6 py-4 font-semibold">Pelanggan</th>
                  <th className="px-6 py-4 font-semibold">Tanggal Pesan</th>
                  <th className="px-6 py-4 font-semibold">Total Harga</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {pesananList.map((pesanan) => (
                  <tr key={pesanan.id.toString()} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-blue-950">#{pesanan.id.toString().padStart(4, '0')}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-blue-950">{pesanan.pelanggans?.nama_pelanggan || "Tanpa Nama"}</div>
                      <div className="text-xs text-blue-500">{pesanan.pelanggans?.telepon || "-"}</div>
                    </td>
                    <td className="px-6 py-4 text-blue-500">
                      {pesanan.tgl_pesan ? new Date(pesanan.tgl_pesan).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }) : "-"}
                    </td>
                    <td className="px-6 py-4 font-black text-blue-950">
                      Rp {pesanan.total_bayar?.toLocaleString("id-ID") || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        pesanan.status_pesan === "Menunggu_Konfirmasi" 
                          ? "bg-amber-100 text-amber-700" 
                          : pesanan.status_pesan === "Sedang_Diproses"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {pesanan.status_pesan === "Menunggu_Konfirmasi" ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        {pesanan.status_pesan === "Menunggu_Konfirmasi" ? "Menunggu Konfirmasi" : pesanan.status_pesan?.replace(/_/g, ' ') || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
