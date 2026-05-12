import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, User, CreditCard, Calendar, MapPin } from "lucide-react";

export default async function PemesananDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pemesanan = await prisma.pemesanans.findUnique({
    where: { id: BigInt(id) },
    include: {
      pelanggans: true,
      jenis_pembayarans: true,
      detail_pemesanans: { include: { pakets: true } },
      pengirimans: { include: { users: true } },
    },
  });
  if (!pemesanan) return notFound();

  const statusColor = pemesanan.status_pesan === "Menunggu_Konfirmasi" ? "bg-amber-100 text-amber-700"
    : pemesanan.status_pesan === "Sedang_Diproses" ? "bg-blue-100 text-blue-700"
    : "bg-green-100 text-green-700";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pemesanans" className="p-2 bg-white text-slate-500 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm border border-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-blue-950">Detail Pemesanan</h1>
          <p className="text-slate-500 mt-1">{pemesanan.no_resi || `#${id.padStart(4, "0")}`}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColor}`}>
          {pemesanan.status_pesan?.replace(/_/g, " ")}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-blue-600" /> Pelanggan</h2>
          <div className="space-y-3 text-sm">
            <div><span className="text-slate-400 font-semibold">Nama:</span> <span className="text-blue-950 font-bold">{pemesanan.pelanggans?.nama_pelanggan || "-"}</span></div>
            <div><span className="text-slate-400 font-semibold">Telepon:</span> <span className="text-slate-600">{pemesanan.pelanggans?.telepon || "-"}</span></div>
            <div><span className="text-slate-400 font-semibold">Email:</span> <span className="text-slate-600">{pemesanan.pelanggans?.email || "-"}</span></div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-600" /> Pembayaran</h2>
          <div className="space-y-3 text-sm">
            <div><span className="text-slate-400 font-semibold">Metode:</span> <span className="text-blue-950 font-bold">{pemesanan.jenis_pembayarans?.metode_pembayaran || "-"}</span></div>
            <div><span className="text-slate-400 font-semibold">Total:</span> <span className="text-blue-600 font-black text-lg">Rp {pemesanan.total_bayar?.toLocaleString("id-ID") || "0"}</span></div>
            <div><span className="text-slate-400 font-semibold">Tanggal:</span> <span className="text-slate-600">{pemesanan.tgl_pesan ? new Date(pemesanan.tgl_pesan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}</span></div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2"><Package className="w-5 h-5 text-blue-600" /> Item Pesanan</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="p-4 font-semibold">Paket</th>
              <th className="p-4 font-semibold">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pemesanan.detail_pemesanans.map((d) => (
              <tr key={d.id.toString()}>
                <td className="p-4 font-bold text-blue-950">{d.pakets?.nama_paket || "-"}</td>
                <td className="p-4 font-bold text-blue-600">Rp {d.subtotal?.toLocaleString("id-ID") || "0"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delivery Info */}
      {pemesanan.pengirimans.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600" /> Pengiriman</h2>
          {pemesanan.pengirimans.map((pg) => (
            <div key={pg.id.toString()} className="text-sm space-y-2">
              <div><span className="text-slate-400 font-semibold">Kurir:</span> <span className="text-blue-950 font-bold">{pg.users?.name || "-"}</span></div>
              <div><span className="text-slate-400 font-semibold">Status:</span> <span className="font-semibold">{pg.status_kirim?.replace(/_/g, " ") || "-"}</span></div>
              <div><span className="text-slate-400 font-semibold">Tgl Kirim:</span> <span>{pg.tgl_kirim ? new Date(pg.tgl_kirim).toLocaleDateString("id-ID") : "-"}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
