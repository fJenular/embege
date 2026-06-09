"use client";

import { useEffect, useState } from "react";
import { X, Utensils, ShoppingCart, Truck, Star } from "lucide-react";

export default function CustomerWelcome() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("customer_welcome_seen");
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("customer_welcome_seen", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          
          <div className="relative z-10 bg-white/20 p-4 rounded-2xl mb-4">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-center relative z-10">Selamat Datang! 👋</h2>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-slate-600 text-center leading-relaxed mb-6">
            Nikmati kemudahan memesan catering berkualitas tinggi dengan layanan terbaik dari EMBEGE.
          </p>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <ShoppingCart className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">Pilih Paket Favorit</p>
                <p className="text-slate-500 text-xs">Berbagai menu pilihan untuk acara Anda</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">Pengiriman Cepat</p>
                <p className="text-slate-500 text-xs">Lacak pesanan Anda secara real-time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">Kualitas Terjamin</p>
                <p className="text-slate-500 text-xs">Produk segar dan pelayanan profesional</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Mulai Pesan Sekarang
          </button>

          {/* Secondary Action */}
          <button
            onClick={handleClose}
            className="w-full mt-3 px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
          >
            Pelajari Lebih Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}
