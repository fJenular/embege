import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, User, CreditCard, Clock, MapPin, Truck, CheckCircle } from "lucide-react";

export default async function KurirOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
        <Link href="/kurir/orders" className="p-2 bg-white text-slate-500 rounded-xl hover:bg-slate-50 hover:text-emerald-600 transition-colors shadow-sm border border-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-blue-950">Detail Pesanan</h1>
          <p className="text-slate-500 mt-1">{pemesanan.no_resi || `#${id.padStart(4, "0")}`}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColor}`}>
          {pemesanan.status_pesan?.replace(/_/g, " ")}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-emerald-600" /> Info Pelanggan</h2>
          <div className="space-y-3 text-sm">
            <div><span className="text-slate-400 font-semibold">Nama:</span> <span className="text-blue-950 font-bold">{pemesanan.pelanggans?.nama_pelanggan || "-"}</span></div>
            <div><span className="text-slate-400 font-semibold">Telepon:</span> <span className="text-slate-600">{pemesanan.pelanggans?.telepon || "-"}</span></div>
            <div><span className="text-slate-400 font-semibold">Alamat:</span> <span className="text-slate-600">{pemesanan.pelanggans?.alamat1 || "-"}</span></div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-emerald-600" /> Info Pembayaran</h2>
          <div className="space-y-3 text-sm">
            <div><span className="text-slate-400 font-semibold">Metode:</span> <span className="text-blue-950 font-bold">{pemesanan.jenis_pembayarans?.metode_pembayaran || "-"}</span></div>
            <div><span className="text-slate-400 font-semibold">Total:</span> <span className="text-emerald-600 font-black text-lg">Rp {pemesanan.total_bayar?.toLocaleString("id-ID") || "0"}</span></div>
            <div><span className="text-slate-400 font-semibold">Tanggal Pesan:</span> <span className="text-slate-600">{pemesanan.tgl_pesan ? new Date(pemesanan.tgl_pesan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</span></div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2"><Package className="w-5 h-5 text-emerald-600" /> Item Pesanan</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {pemesanan.detail_pemesanans.map((d) => (
            <div key={d.id.toString()} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <span className="font-bold text-blue-950">{d.pakets?.nama_paket || "-"}</span>
              </div>
              <span className="font-bold text-emerald-600">Rp {d.subtotal?.toLocaleString("id-ID") || "0"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      {pemesanan.pengirimans.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-emerald-600" /> Info Pengiriman</h2>
          {pemesanan.pengirimans.map((pg) => {
            const isDelivered = pg.status_kirim === "Tiba_Ditujuan";
            return (
              <div key={pg.id.toString()} className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">Status:</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isDelivered ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                    {isDelivered ? <CheckCircle className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                    {pg.status_kirim?.replace(/_/g, " ")}
                  </span>
                </div>
                <div><span className="text-slate-400 font-semibold">Kurir:</span> <span className="text-blue-950 font-bold">{pg.users?.name || "-"}</span></div>
                <div><span className="text-slate-400 font-semibold">Tanggal Kirim:</span> <span>{pg.tgl_kirim ? new Date(pg.tgl_kirim).toLocaleDateString("id-ID") : "-"}</span></div>
                {pg.tgl_tiba && <div><span className="text-slate-400 font-semibold">Tanggal Tiba:</span> <span>{new Date(pg.tgl_tiba).toLocaleDateString("id-ID")}</span></div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
