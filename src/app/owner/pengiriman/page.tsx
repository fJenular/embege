import prisma from "@/lib/prisma";
import { Truck, MapPin, Clock, CheckCircle, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OwnerPengirimanPage() {
  const pengirimans = await prisma.pengirimans.findMany({
    orderBy: { created_at: "desc" },
    include: {
      pemesanans: { include: { pelanggans: true, detail_pemesanans: { include: { pakets: true } } } },
      users: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-blue-950">Pantau Pengiriman</h1>
        <p className="text-slate-500 mt-1">Monitor status pengiriman pesanan secara realtime</p>
      </div>

      {pengirimans.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <Truck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-blue-950 mb-2">Belum Ada Pengiriman</h2>
          <p className="text-sm text-slate-500">Pengiriman akan muncul di sini setelah pesanan siap dikirim.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pengirimans.map((pg) => {
            const isDelivered = pg.status_kirim === "Tiba_Ditujuan";
            return (
              <div key={pg.id.toString()} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${isDelivered ? "border-green-200" : "border-blue-200"}`}>
                <div className={`px-6 py-3 flex items-center justify-between ${isDelivered ? "bg-green-50" : "bg-blue-50"}`}>
                  <span className={`inline-flex items-center gap-2 text-sm font-bold ${isDelivered ? "text-green-700" : "text-blue-700"}`}>
                    {isDelivered ? <CheckCircle className="w-4 h-4" /> : <Truck className="w-4 h-4 animate-pulse" />}
                    {pg.status_kirim?.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">#{pg.id.toString().padStart(4, "0")}</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-blue-950">{pg.pemesanans?.pelanggans?.nama_pelanggan || "-"}</p>
                      <p className="text-xs text-slate-400">Resi: {pg.pemesanans?.no_resi || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-600">Kurir: {pg.users?.name || "Belum ditugaskan"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div className="text-sm text-slate-500">
                      <p>Kirim: {pg.tgl_kirim ? new Date(pg.tgl_kirim).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}</p>
                      {pg.tgl_tiba && <p>Tiba: {new Date(pg.tgl_tiba).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>}
                    </div>
                  </div>
                  {pg.pemesanans?.detail_pemesanans && pg.pemesanans.detail_pemesanans.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Item Pesanan</p>
                      <div className="space-y-1">
                        {pg.pemesanans.detail_pemesanans.map((d) => (
                          <div key={d.id.toString()} className="flex justify-between text-sm">
                            <span className="text-slate-600">{d.pakets?.nama_paket || "-"}</span>
                            <span className="font-bold text-blue-600">Rp {d.subtotal?.toLocaleString("id-ID") || "0"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
