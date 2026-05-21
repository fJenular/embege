"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, Package, User, Phone, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";

type Paket = {
  id: string;
  nama_paket: string | null;
  foto1?: string | null;
  kategori?: string | null;
  jenis?: string | null;
  deskripsi?: string | null;
  jumlah_pax?: number | null;
  harga_paket?: number | null;
};

export default function OrderForm({ paket }: { paket: Paket }) {
  const [formData, setFormData] = useState({ nama: "", no_hp: "", alamat: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create Pelanggan
      const resPelanggan = await fetch("/api/pelanggans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const dataPelanggan = await resPelanggan.json();

      if (!resPelanggan.ok) {
        throw new Error(dataPelanggan.message || "Gagal menyimpan data pelanggan");
      }

      // 2. Create Pemesanan using the created pelanggan ID
      const resPemesanan = await fetch("/api/pemesanans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_pelanggan: dataPelanggan.id }),
      });
      
      const dataPemesanan = await resPemesanan.json();

      if (!resPemesanan.ok) {
        throw new Error(dataPemesanan.message || "Gagal membuat pesanan");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Pesanan Berhasil!</h2>
          <p className="text-slate-600 mb-8">
            Terima kasih, <strong>{formData.nama}</strong>. Pesanan Anda untuk paket <strong>{paket.nama_paket}</strong> sedang menunggu konfirmasi.
          </p>
          <Link
            href="/pesan"
            className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors w-full"
          >
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/pesan"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Kembali ke Menu
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Package Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 sticky top-8">
              <div className="flex items-center gap-3 text-emerald-600 font-bold text-lg mb-4 pb-4 border-b border-slate-100">
                <Package className="w-5 h-5" /> Detail Paket
              </div>

              {/* Package Image */}
              <div className="aspect-video bg-slate-100 rounded-xl mb-4 overflow-hidden">
                {paket.foto1 ? (
                  <img
                    src={paket.foto1}
                    alt={paket.nama_paket || "Paket"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    Tidak ada gambar
                  </div>
                )}
              </div>

              {/* Package Details */}
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Nama Paket</p>
                  <p className="text-lg font-black text-slate-900">{paket.nama_paket}</p>
                </div>

                {paket.deskripsi && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Deskripsi</p>
                    <p className="text-sm text-slate-700">{paket.deskripsi}</p>
                  </div>
                )}

                {paket.jumlah_pax && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Jumlah Pax</p>
                    <p className="text-sm font-semibold text-slate-900">{paket.jumlah_pax} orang</p>
                  </div>
                )}

                <div className="bg-emerald-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Harga</p>
                  <p className="text-2xl font-black text-emerald-600">
                    Rp {(paket.harga_paket || 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Data Pemesan</h2>
                <p className="text-sm text-slate-500">Lengkapi informasi Anda untuk melanjutkan pesanan</p>
              </div>

              {/* Nama */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Masukkan nama lengkap Anda"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* No HP */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={formData.no_hp}
                  onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                  placeholder="Contoh: 08123456789"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Alamat Pengiriman
                </label>
                <textarea
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Masukkan alamat pengiriman lengkap"
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm font-semibold text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Konfirmasi Pesanan"
                )}
              </button>

              <p className="text-xs text-slate-500 text-center">
                Dengan mengklik tombol di atas, Anda setuju dengan syarat dan ketentuan kami
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
