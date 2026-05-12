"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Utensils, ArrowLeft, CheckCircle, Package, User, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function OrderForm({ paket }: { paket: any }) {
  const router = useRouter();
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
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Pesanan Berhasil!</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Terima kasih, <strong>{formData.nama}</strong>. Pesanan Anda untuk paket <strong>{paket.nama_paket}</strong> sedang menunggu konfirmasi.
          </p>
          <Link
            href="/"
            className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold hover:bg-orange-600 dark:hover:bg-orange-500 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] py-12 px-6 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-orange-500 selection:text-white">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-600 transition-colors mb-8 font-medium">
          <ArrowLeft className="w-5 h-5" /> Kembali
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Package Summary */}
          <div>
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-12">
              <div className="flex items-center gap-3 text-orange-600 dark:text-orange-500 font-bold text-xl mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                <Package className="w-6 h-6" /> Detail Paket
              </div>
              
              <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-6 overflow-hidden relative">
                 {paket.foto1 ? (
                    <img src={`/storage/${paket.foto1}`} alt={paket.nama_paket} className="object-cover w-full h-full" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Utensils className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
                    </div>
                  )}
              </div>
              
              <h2 className="text-2xl font-extrabold mb-2">{paket.nama_paket}</h2>
              <div className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-semibold mb-4 text-zinc-600 dark:text-zinc-400">
                {paket.kategori} • {paket.jenis}
              </div>
              
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 leading-relaxed">
                {paket.deskripsi || "Tidak ada deskripsi."}
              </p>
              
              <div className="flex justify-between items-end pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Total Kapasitas</div>
                  <div className="font-semibold">{paket.jumlah_pax} Orang</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-zinc-500 mb-1">Harga Paket</div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    Rp {paket.harga_paket?.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl">
              <h1 className="text-3xl font-bold mb-2">Pesan Sekarang</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8">Lengkapi informasi Anda di bawah ini untuk memproses pesanan.</p>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 dark:border-red-900/50">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-zinc-400" /> Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-400" /> Nomor Telepon / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.no_hp}
                    onChange={(e) => setFormData({...formData, no_hp: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                    placeholder="Contoh: 081234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-400" /> Alamat Pengiriman
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.alamat}
                    onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow resize-none"
                    placeholder="Masukkan alamat lengkap pengiriman"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-lg transition-all hover:shadow-lg flex justify-center items-center gap-2 mt-8"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Konfirmasi Pesanan"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
