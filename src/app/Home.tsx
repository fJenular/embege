"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Utensils, LayoutGrid, ListOrdered, Clock, Receipt, Bell, Search, Minus, Plus, ChevronRight } from "lucide-react";

export default function HomeClient({ pakets, recentOrders = [], jenisPembayarans = [] }: { pakets: any[], recentOrders?: any[], jenisPembayarans?: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<{ paket: any; quantity: number }[]>([]);
  const [customerInfo, setCustomerInfo] = useState({ nama: "", telepon: "", id_jenis_bayar: "" });
  const [loading, setLoading] = useState(false);

  const categories = ["All", ...Array.from(new Set(pakets.map(p => p.kategori).filter(Boolean)))];

  const filteredPakets = activeCategory === "All" 
    ? pakets 
    : pakets.filter(p => p.kategori === activeCategory);

  const addToCart = (paket: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.paket.id === paket.id);
      if (existing) {
        return prev.map(item => item.paket.id === paket.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { paket, quantity: 1 }];
    });
  };

  const removeFromCart = (paketId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.paket.id === paketId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.paket.id === paketId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.paket.id !== paketId);
    });
  };

  const getQuantity = (paketId: string) => {
    return cart.find(item => item.paket.id === paketId)?.quantity || 0;
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.paket.harga_paket * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleProcessTransaction = async () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    if (!customerInfo.nama || !customerInfo.telepon) return alert("Mohon lengkapi informasi pelanggan.");
    
    setLoading(true);
    try {
      // 1. Create Pelanggan
      const resPelanggan = await fetch("/api/pelanggans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: customerInfo.nama, no_hp: customerInfo.telepon || "-", alamat: "-" }),
      });
      const dataPelanggan = await resPelanggan.json();
      if (!resPelanggan.ok) throw new Error(dataPelanggan.message);

      // 2. Create Pemesanan
      const orderItems = cart.map(item => ({
        id_paket: item.paket.id,
        subtotal: item.paket.harga_paket * item.quantity
      }));

      const resPemesanan = await fetch("/api/pemesanans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id_pelanggan: dataPelanggan.id,
          id_jenis_bayar: customerInfo.id_jenis_bayar,
          total_bayar: total,
          items: orderItems
        }),
      });
      if (!resPemesanan.ok) throw new Error("Gagal memproses pesanan");

      alert("Transaksi Berhasil!");
      setCart([]);
      setCustomerInfo({ nama: "", telepon: "", id_jenis_bayar: "" });
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex overflow-hidden">
      {/* Left Column */}
      <div className="flex-1 flex flex-col overflow-y-auto px-8 py-6 pb-20">
        
        {/* Top Order List (Horizontal Scroll) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-950">Order List</h2>
            <Link href="/pesanan" className="text-sm font-semibold text-slate-400 hover:text-blue-600">See All</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {recentOrders.length > 0 ? recentOrders.map((order) => {
              const orderId = `#${order.id.padStart(5, '0')}`;
              const name = order.pelanggans?.nama_pelanggan || "Unknown";
              const itemsCount = order.detail_pemesanans?.length || 0;
              const table = order.pelanggans?.alamat || "-";
              const status = order.status_pesan === "Menunggu_Konfirmasi" ? "Waiting" : order.status_pesan?.replace(/_/g, ' ') || "Completed";
              const color = status === "Waiting" ? "bg-orange-400" : (status === "Sedang Diproses" ? "bg-blue-600" : "bg-green-500");

              return (
                <div key={order.id} className="min-w-[220px] bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col shrink-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-blue-950">{name}</h4>
                    <span className="text-xs font-semibold text-slate-300">{orderId}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-400 mb-4">
                    {itemsCount} items
                  </div>
                  <div className={`mt-auto inline-flex px-3 py-1 rounded-full text-[10px] font-bold text-white w-max ${color}`}>
                    {status}
                  </div>
                </div>
              );
            }) : (
              <div className="text-sm text-slate-400 italic">No recent orders</div>
            )}
          </div>
        </div>

        {/* Categories Pill Container */}
        <div className="bg-slate-100 rounded-full p-1.5 flex items-center justify-between mb-8 overflow-x-auto no-scrollbar">
          {categories.map((cat, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveCategory(cat as string)}
              className={`flex-1 px-6 py-2.5 text-sm font-bold whitespace-nowrap rounded-full transition-all ${
                activeCategory === cat 
                  ? "bg-white text-blue-950 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {cat === "All" ? "Main course" : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-blue-950">Menu</h2>
          <span className="text-sm font-medium text-slate-400">Showing {filteredPakets.length} Items</span>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPakets.map((paket) => (
            <div key={paket.id} className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-44 bg-slate-100 relative">
                {paket.foto1 ? (
                  <img src={`/storage/${paket.foto1}`} alt={paket.nama_paket} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Utensils className="w-8 h-8 text-blue-200" />
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-blue-950 mb-1.5 leading-tight">{paket.nama_paket}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {paket.deskripsi || "Fresh ingredients cooked to perfection with traditional mouth-watering flavors."}
                </p>
                <div className="text-[11px] font-semibold text-slate-400 mb-5">
                  12 Available • 6 Sold
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-lg font-black text-blue-950 flex items-start">
                    <span className="text-xs text-blue-600 mt-1 mr-0.5">Rp</span>
                    {paket.harga_paket?.toLocaleString("id-ID")}
                  </div>
                  
                  <div className="flex items-center gap-3 bg-slate-50/50 rounded-full p-1 border border-slate-100/50">
                    {getQuantity(paket.id) > 0 ? (
                      <>
                        <button 
                          onClick={() => removeFromCart(paket.id)}
                          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold w-4 text-center text-blue-950">{getQuantity(paket.id)}</span>
                        <button 
                          onClick={() => addToCart(paket)}
                          className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 shadow-sm transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          disabled
                          className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold w-4 text-center text-slate-300">0</span>
                        <button 
                          onClick={() => addToCart(paket)}
                          className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 shadow-sm transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column (Cart / Order Details) */}
      <div className="w-[380px] bg-white border-l border-slate-200 flex flex-col shrink-0">
        <div className="p-6 overflow-y-auto flex-1 no-scrollbar">
          
          <h2 className="text-lg font-bold text-blue-950 mb-4">Customer Information</h2>
          <div className="space-y-3 mb-8">
            <input 
              type="text" 
              placeholder="Customer Name" 
              value={customerInfo.nama}
              onChange={e => setCustomerInfo({...customerInfo, nama: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium placeholder:text-slate-300"
            />
            <input 
              type="text" 
              placeholder="Phone Number" 
              value={customerInfo.telepon}
              onChange={e => setCustomerInfo({...customerInfo, telepon: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium placeholder:text-slate-300"
            />
            <div className="relative">
              <select 
                value={customerInfo.id_jenis_bayar}
                onChange={e => setCustomerInfo({...customerInfo, id_jenis_bayar: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium text-slate-700 appearance-none"
              >
                <option value="">Payment Method</option>
                {jenisPembayarans.map((jp) => (
                  <option key={jp.id} value={jp.id}>{jp.metode_pembayaran}</option>
                ))}
              </select>
              <ChevronRight className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
            </div>
          </div>

          <h2 className="text-lg font-bold text-blue-950 mb-4">Order Details</h2>
          {cart.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm font-medium border-2 border-dashed border-slate-100 rounded-xl mb-8">
              Cart is empty
            </div>
          ) : (
            <div className="space-y-5 mb-8">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-100">
                    {item.paket.foto1 ? (
                      <img src={`/storage/${item.paket.foto1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-blue-200" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <h4 className="text-sm font-bold text-blue-950 truncate mb-2">{item.paket.nama_paket}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-slate-50 rounded-full px-1.5 py-1 border border-slate-100">
                        <button onClick={() => removeFromCart(item.paket.id)} className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-bold w-4 text-center text-blue-950">{item.quantity}</span>
                        <button onClick={() => addToCart(item.paket)} className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm"><Plus className="w-3 h-3" /></button>
                      </div>
                      <div className="text-sm font-black text-blue-950">
                        Rp {(item.paket.harga_paket * item.quantity).toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-lg font-bold text-blue-950 mb-4">Order Summary</h2>
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6 relative overflow-hidden">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-semibold">Subtotal</span>
                <span className="font-bold text-blue-950">Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-semibold">Tax (10%)</span>
                <span className="font-bold text-blue-950">Rp {tax.toLocaleString("id-ID")}</span>
              </div>
            </div>
            
            {/* Dashed line separator */}
            <div className="absolute left-0 right-0 border-t-2 border-dashed border-slate-200 my-1"></div>
            
            <div className="pt-5 flex justify-between items-center">
              <span className="font-bold text-blue-950">Total</span>
              <span className="font-black text-xl text-blue-600">Rp {total.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white">
          <button 
            onClick={handleProcessTransaction}
            disabled={loading || cart.length === 0}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center"
          >
            {loading ? "Processing..." : "Process Transaction"}
          </button>
        </div>
      </div>
    </main>
  );
}
