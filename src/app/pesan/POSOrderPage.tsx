'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  Minus,
  Plus,
  Trash2,
  CreditCard,
  LogIn,
  MapPin,
  Phone,
  User,
  Clock,
  CheckCircle2,
  QrCode,
  Coins,
  Landmark,
  PhoneCall,
  X,
  ChevronRight,
  Menu,
  Layers,
  Sunrise,
  Sun,
  Moon,
  Gift,
  Coffee,
  PartyPopper,
  ForkKnife,
  Truck,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';

type Paket = {
  id: string;
  nama_paket: string;
  foto1?: string;
  kategori?: string;
  deskripsi?: string;
  harga_paket?: number;
  jenis?: string;
  jumlah_pax?: number;
};

type CartItem = {
  id: string;
  nama_paket: string;
  harga: number;
  quantity: number;
  foto1?: string;
};

const CATEGORIES: Array<{ id: string; label: string; icon: LucideIcon }> = [
  { id: 'all', label: 'Semua Menu', icon: Menu },
  { id: 'sarapan', label: 'Sarapan', icon: Coffee },
  { id: 'makan_siang', label: 'Makan Siang', icon: Sun },
  { id: 'makan_malam', label: 'Makan Malam', icon: Moon },
  { id: 'paket_acara', label: 'Paket Acara', icon: PartyPopper },
];

const CATEGORY_MAP: Record<string, string[]> = {
  all: [],
  sarapan: ['sarapan', 'breakfast', 'pagi'],
  makan_siang: ['siang', 'lunch', 'studi tour', 'box'],
  makan_malam: ['malam', 'dinner', 'sate', 'steak'],
  paket_acara: ['acara besar', 'event', 'pernikahan', 'selamatan', 'ulang tahun', 'prasmanan'],
};

export default function POSOrderPage() {
  const router = useRouter();
  const [pakets, setPakets] = useState<Paket[]>([]);
  const [filteredPakets, setFilteredPakets] = useState<Paket[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'pesan' | 'riwayat' | 'help'>('pesan');

  // Form states
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('3'); // Default QRIS (ID 3)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<any>(null);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchPakets = async () => {
      try {
        const res = await fetch('/api/pakets');
        const data = await res.json();
        setPakets(data);
        setFilteredPakets(data);
      } catch (error) {
        console.error('Error fetching pakets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPakets();
  }, []);

  useEffect(() => {
    let filtered = pakets;

    if (selectedCategory !== 'all') {
      const keywords = CATEGORY_MAP[selectedCategory] || [selectedCategory];
      filtered = filtered.filter((p) => {
        const text = `${p.nama_paket} ${p.kategori ?? ''} ${p.deskripsi ?? ''}`.toLowerCase();
        return keywords.some((keyword) => text.includes(keyword));
      });
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.nama_paket.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.deskripsi ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPakets(filtered);
  }, [selectedCategory, searchTerm, pakets]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('embege_order_history');
    if (!saved) return;

    try {
      setOrderHistory(JSON.parse(saved));
    } catch (error) {
      console.warn('Unable to parse order history', error);
    }
  }, []);

  const saveOrderHistory = (history: any[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('embege_order_history', JSON.stringify(history));
  };

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return pakets.length;
    const keywords = CATEGORY_MAP[catId] || [catId];
    return pakets.filter((p) => {
      const text = `${p.nama_paket} ${p.kategori ?? ''} ${p.deskripsi ?? ''}`.toLowerCase();
      return keywords.some((keyword) => text.includes(keyword));
    }).length;
  };

  const addToCart = (paket: Paket) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === paket.id);
      if (existing) {
        return prev.map((item) =>
          item.id === paket.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { 
        id: paket.id, 
        nama_paket: paket.nama_paket, 
        harga: paket.harga_paket || 0, 
        quantity: 1,
        foto1: paket.foto1 
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (next.length === 0) setCartOpen(false);
      return next;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const getItemQuantity = (id: string) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const subtotal = cart.reduce((sum, item) => sum + item.harga * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Keranjang belanja Anda masih kosong!');
      return;
    }
    if (!customerName || !customerPhone) {
      alert('Mohon isi nama dan nomor telepon Anda.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress) {
      alert('Mohon isi alamat pengiriman.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create Pelanggan
      const address = orderType === 'delivery' ? deliveryAddress : 'Ambil Sendiri di Toko';
      const pelangganRes = await fetch('/api/pelanggans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: customerName,
          no_hp: customerPhone,
          alamat: address,
        }),
      });

      if (!pelangganRes.ok) {
        const errorData = await pelangganRes.json().catch(() => null)
        throw new Error(errorData?.message || 'Gagal menyimpan data pelanggan');
      }
      const pelanggan = await pelangganRes.json();

      // 2. Create Pemesanan
      const pemesananRes = await fetch('/api/pemesanans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pelanggan: pelanggan.id,
          id_jenis_bayar: paymentMethodId,
          total_bayar: Math.round(total),
          items: cart.map(item => ({
            id_paket: item.id,
            subtotal: item.harga * item.quantity
          }))
        }),
      });

      if (!pemesananRes.ok) {
        const errorData = await pemesananRes.json().catch(() => null)
        throw new Error(errorData?.message || 'Gagal membuat pesanan');
      }
      const orderData = await pemesananRes.json();

      const invoice = {
        no_resi: orderData.no_resi,
        nama_pelanggan: customerName,
        telepon: customerPhone,
        alamat: address,
        paymentMethodName: paymentMethodId === '1' ? 'Cash / Tunai' : paymentMethodId === '2' ? 'Transfer Bank' : 'QRIS',
        items: [...cart],
        total: total,
        status: 'Selesai',
        createdAt: new Date().toISOString(),
      };

      setLastInvoice(invoice);
      setOrderHistory((prev) => {
        const next = [invoice, ...prev].slice(0, 8);
        saveOrderHistory(next);
        return next;
      });
      setShowSuccessModal(true);

      // Clear states
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryAddress('');
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased flex flex-col lg:flex-row">
      
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-[#e2e8f0] flex-col p-6 shrink-0 z-30 h-screen">
        <div className="flex flex-col h-full">
          <div>
            <div className="flex flex-col items-center gap-4 mb-6 text-center">
              <img src="/logo.svg" alt="EMBEGE" className="w-50" />
              <div>
                <p className="mt-1 text-sm font-black text-slate-900">Emang Beda Gizi & Enaknya</p>
              </div>
            </div>

            <nav className="space-y-2">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1 mb-1">Main Menu</p>
              <button
                onClick={() => setActiveSection('pesan')}
                className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-bold transition-all ${activeSection === 'pesan' ? 'sidebar-item-active text-white' : 'text-muted-foreground hover:text-[#0f172a] hover:bg-slate-50'}`}
              >
                <ForkKnife className="w-4.5 h-4.5" />
                Pesan Menu
              </button>
              <button
                onClick={() => setActiveSection('riwayat')}
                className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-bold transition-all ${activeSection === 'riwayat' ? 'sidebar-item-active text-white' : 'text-muted-foreground hover:text-[#0f172a] hover:bg-slate-50'}`}
              >
                <Clock className="w-4.5 h-4.5" />
                Riwayat Katering
              </button>
              <button
                onClick={() => setActiveSection('help')}
                className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-bold transition-all ${activeSection === 'help' ? 'sidebar-item-active text-white' : 'text-muted-foreground hover:text-[#0f172a] hover:bg-slate-50'}`}
              >
                <PhoneCall className="w-4.5 h-4.5" />
                Hubungi CS
              </button>
            </nav>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="mb-4 rounded-xl bg-slate-50 p-3 border border-slate-100 text-center">
              <p className="text-[11px] text-muted-foreground font-medium">Khusus Staf & Customer</p>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary/20 hover:border-primary text-primary hover:bg-primary-soft font-bold text-sm transition-all"
            >
              <LogIn className="w-4 h-4" />
              Login Karyawan
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 h-screen pb-[360px] lg:pb-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#e2e8f0] px-6 py-4.5 flex flex-col md:flex-row items-center justify-between gap-4 z-20">
          <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {activeSection === 'pesan' ? 'Katering Premium EMBEGE' : activeSection === 'riwayat' ? 'Riwayat Katering' : 'Hubungi Customer Service'}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeSection === 'pesan'
                    ? 'Pilih menu catering terbaik untuk kebutuhan acara Anda.'
                    : activeSection === 'riwayat'
                    ? 'Lihat riwayat pesanan dan status terakhir Anda.'
                    : 'Butuh bantuan? Customer service siap membantu Anda.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCartOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
            >
              <ShoppingCart className="w-4.5 h-4.5 text-primary" />
              {cart.length > 0 ? `${cart.length} item` : 'Keranjang'}
            </button>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nasi uduk, bento, tumpeng, prasmanan..."
              className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white rounded-xl text-sm font-medium outline-none transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden bg-slate-900/50 backdrop-blur-sm">
            <div className="absolute left-0 top-0 h-full w-72 bg-white p-6 shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src="/logo.svg" alt="EMBEGE" className="w-40" />
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="rounded-2xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-100 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
              <nav className="space-y-3">
                <button
                  onClick={() => { setActiveSection('pesan'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${activeSection === 'pesan' ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <ForkKnife className="w-4.5 h-4.5" />
                  Pesan Menu
                </button>
                <button
                  onClick={() => { setActiveSection('riwayat'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${activeSection === 'riwayat' ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <Clock className="w-4.5 h-4.5" />
                  Riwayat Katering
                </button>
                <button
                  onClick={() => { setActiveSection('help'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${activeSection === 'help' ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <PhoneCall className="w-4.5 h-4.5" />
                  Hubungi CS
                </button>
              </nav>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {activeSection === 'pesan' && (
            <>
            <div className="flex-shrink-0 bg-white border-b border-[#e2e8f0] px-6 py-4 overflow-x-auto scrollbar-none">
              <div className="flex gap-4">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  const count = getCategoryCount(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col items-start min-w-[125px] p-3.5 rounded-xl border text-left transition-all ${
                        isActive 
                          ? 'bg-primary-soft border-primary text-primary shadow-sm shadow-blue-500/5' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <cat.icon className="w-6 h-6 mb-2 text-primary" />
                      <span className="font-bold text-sm text-[#0f172a]">{cat.label}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">{count} menu</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                  <p className="font-bold text-sm">Sedang memuat menu catering...</p>
                </div>
              ) : filteredPakets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="font-black text-slate-900 text-lg">Menu Tidak Ditemukan</p>
                  <p className="text-muted-foreground text-xs mt-1.5">Tidak ada menu katering yang cocok dengan filter atau kata kunci pencarian Anda.</p>
                  <button 
                    onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
                    className="mt-5 text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1"
                  >
                    Reset Semua Filter <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredPakets.map((paket) => {
                    const qty = getItemQuantity(paket.id);
                    const hasDiscount = parseInt(paket.id) % 3 === 0; // Mock discounts
                    return (
                      <div 
                        key={paket.id} 
                        className={`rounded-2xl border bg-white overflow-hidden transition-all duration-300 flex flex-col justify-between group ${
                          qty > 0 
                            ? 'border-primary shadow-md shadow-blue-500/5 ring-1 ring-primary/20' 
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/40 hover:-translate-y-0.5'
                        }`}
                      >
                        <div>
                          <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                            {paket.foto1 ? (
                              <img 
                                src={paket.foto1} 
                                alt={paket.nama_paket} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-slate-400">No Image</div>
                            )}

                            <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                              {hasDiscount && (
                                <span className="bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.75 rounded-md shadow-sm">
                                  PROMO 10%
                                </span>
                              )}
                              <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.75 rounded-md shadow-sm border border-slate-200">
                                {paket.jenis || 'Box'}
                              </span>
                            </div>

                            {paket.jumlah_pax && paket.jumlah_pax > 1 && (
                              <div className="absolute bottom-3 right-3 bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
                                Porsi {paket.jumlah_pax} Pax
                              </div>
                            )}
                          </div>

                          <div className="p-4.5">
                            <div className="flex items-start justify-between gap-2.5 mb-1.5">
                              <h3 className="font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors text-base">
                                {paket.nama_paket}
                              </h3>
                            </div>
                            <p className="text-[12px] text-muted-foreground line-clamp-3 mb-4 min-h-[54px] leading-relaxed">
                              {paket.deskripsi ? paket.deskripsi.replace(/\[.*?\]\s*/, '') : 'Deskripsi menu belum diisi.'}
                            </p>
                          </div>
                        </div>

                        <div className="p-4.5 pt-0 border-t border-slate-50 flex items-center justify-between gap-4 mt-auto">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Harga Paket</p>
                            <p className="text-lg font-black text-primary">
                              Rp {(paket.harga_paket || 0).toLocaleString('id-ID')}
                            </p>
                          </div>

                          {qty > 0 ? (
                            <div className="flex items-center gap-2.5 bg-primary-soft border border-primary/20 rounded-xl px-2 py-1.5 shadow-inner">
                              <button 
                                onClick={() => updateQuantity(paket.id, qty - 1)}
                                className="w-7 h-7 rounded-lg bg-white border border-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-5 text-center font-bold text-primary text-sm">{qty}</span>
                              <button 
                                onClick={() => updateQuantity(paket.id, qty + 1)}
                                className="w-7 h-7 rounded-lg bg-white border border-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(paket)}
                              className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10"
                            >
                              <Plus className="w-3.5 h-3.5" /> Tambah
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {activeSection === 'riwayat' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid gap-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Riwayat Pesanan</p>
                    <h3 className="mt-2 text-xl font-black text-slate-900">Semua pesanan terakhir</h3>
                  </div>
                  <span className="rounded-2xl bg-primary-soft px-3 py-2 text-xs font-bold text-primary">Terbaru</span>
                </div>

                {orderHistory.length === 0 ? (
                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Belum ada pesanan</p>
                    <p className="mt-3 font-black text-slate-900">Tambahkan menu dan buat pesanan untuk melihat riwayat Anda di sini.</p>
                    <p className="mt-2 text-sm text-slate-500">Semua pesanan akan muncul otomatis setelah checkout berhasil.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <div key={order.no_resi} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">No. Resi</p>
                            <h4 className="mt-2 text-lg font-black text-slate-900">{order.no_resi}</h4>
                            <p className="text-sm text-slate-500 mt-1">{new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                          </div>
                          <span className="rounded-2xl bg-primary-soft px-3 py-2 text-xs font-bold text-primary">{order.status || 'Selesai'}</span>
                        </div>

                        <div className="mt-4 rounded-3xl bg-white p-4 border border-slate-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Detail Pesanan</span>
                            <span className="text-xs font-semibold text-slate-500">{order.items.length} paket</span>
                          </div>
                          <div className="space-y-3">
                            {order.items.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                                {item.foto1 ? (
                                  <img src={item.foto1} alt={item.nama_paket} className="h-14 w-14 rounded-2xl object-cover" />
                                ) : (
                                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-500">No Foto</div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-slate-900 truncate">{item.nama_paket}</p>
                                  <p className="text-sm text-slate-500">Qty {item.quantity} × Rp {item.harga.toLocaleString('id-ID')}</p>
                                </div>
                                <p className="text-sm font-black text-slate-900">Rp {(item.harga * item.quantity).toLocaleString('id-ID')}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-3xl bg-white p-4 border border-slate-200">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Metode Pembayaran</p>
                            <p className="mt-2 font-black text-slate-900 text-sm">{order.paymentMethodName}</p>
                          </div>
                          <div className="rounded-3xl bg-white p-4 border border-slate-200">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Total</p>
                            <p className="mt-2 font-black text-slate-900 text-sm">Rp {order.total.toLocaleString('id-ID')}</p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-3xl bg-white p-4 border border-slate-200">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Penerima</p>
                            <p className="mt-2 font-black text-slate-900 text-sm">{order.nama_pelanggan}</p>
                            <p className="text-sm text-slate-500 mt-1">{order.telepon}</p>
                          </div>
                          <div className="rounded-3xl bg-white p-4 border border-slate-200">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Alamat</p>
                            <p className="mt-2 text-sm text-slate-500 leading-snug">{order.alamat}</p>
                          </div>
                        </div>

                        <div className="mt-4 text-sm text-slate-600">
                          <p><span className="font-semibold text-slate-900">Jumlah item:</span> {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'help' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid gap-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Bantuan Pelanggan</p>
                <h3 className="mt-3 text-xl font-black text-slate-900">Ada kendala? Kami siap bantu.</h3>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">Silakan hubungi customer service melalui telepon, WhatsApp, atau email bila Anda butuh bantuan dengan pesanan catering.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Telepon</p>
                    <p className="mt-3 font-black text-slate-900">0812-3456-7890</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Email</p>
                    <p className="mt-3 font-black text-slate-900">support@embege.id</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </main>

      {!cartOpen && cart.length > 0 && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-white shadow-2xl shadow-primary/25 lg:hidden transition-all hover:bg-primary-hover"
        >
          <ShoppingCart className="w-4 h-4" />
          Buka Keranjang ({cart.length})
        </button>
      )}

      {/* Cart Drawer Overlay for Mobile */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-slate-900/30 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* RIGHT SIDEBAR (CART & CHECKOUT FORM) */}
      {cartOpen && (
        <aside className="fixed bottom-0 left-0 right-0 lg:static lg:w-[420px] bg-white border-t border-[#e2e8f0] lg:border-l flex flex-col shrink-0 z-50 max-h-[90vh] lg:h-auto shadow-xl lg:shadow-none cart-drawer lg:relative lg:max-h-full">
          
          {/* Header */}
          <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <ShoppingCart className="w-5.5 h-5.5 text-primary" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">Keranjang Katering</h2>
                <p className="text-[11px] text-muted-foreground font-medium">Ringkasan pesanan Anda</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              {cart.length > 0 && (
                <button 
                  onClick={() => setCart([])} 
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-all"
                >
                  Kosongkan
                </button>
              )}
            </div>
          </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cart Items List */}
          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 px-4">
                <p className="text-sm font-semibold text-slate-500">Keranjang masih kosong</p>
                <p className="text-[11px] text-muted-foreground mt-1">Tambahkan beberapa menu lezat untuk memulai pesanan catering Anda.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="w-14 h-14 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                    {item.foto1 ? (
                      <img src={item.foto1} alt={item.nama_paket} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">Food</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs truncate leading-tight">{item.nama_paket}</h4>
                      <p className="text-[10px] font-bold text-primary mt-1">Rp {item.harga.toLocaleString('id-ID')}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-1 py-0.5">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:text-slate-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center font-bold text-xs text-slate-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form Checkout */}
          {cart.length > 0 && (
            <form id="checkoutForm" onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">Informasi Pengiriman</h3>
              
              {/* Order Type Selector */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.25 rounded-xl border border-slate-100">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition-all ${
                    orderType === 'delivery'
                      ? 'bg-white shadow-sm text-primary border border-slate-100'
                      : 'text-muted-foreground hover:text-slate-850'
                  }`}
                >
                  <Truck className="w-4 h-4" /> Kirim ke Alamat
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition-all ${
                    orderType === 'takeaway'
                      ? 'bg-white shadow-sm text-primary border border-slate-100'
                      : 'text-muted-foreground hover:text-slate-850'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" /> Ambil Sendiri
                </button>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Nama Penerima</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      required
                      placeholder="Masukkan nama lengkap" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white rounded-xl text-xs font-semibold outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Nomor HP / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="tel" 
                      required
                      placeholder="Contoh: 08123456789" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white rounded-xl text-xs font-semibold outline-none transition-all"
                    />
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <div className="space-y-1 transition-all duration-350">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Alamat Lengkap</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                      <textarea 
                        required
                        placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan" 
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        rows={3}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white rounded-xl text-xs font-semibold outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Metode Pembayaran</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethodId('3')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      paymentMethodId === '3'
                        ? 'border-primary bg-primary-soft text-primary shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <QrCode className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-black uppercase">QRIS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethodId('2')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      paymentMethodId === '2'
                        ? 'border-primary bg-primary-soft text-primary shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Landmark className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-black uppercase">Transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethodId('1')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      paymentMethodId === '1'
                        ? 'border-primary bg-primary-soft text-primary shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Coins className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-black uppercase">Tunai</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Summary & Place Order (always visible; disabled when cart empty) */}
        <div className="p-6 bg-slate-50 border-t border-[#e2e8f0] space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>Pajak (Ppn 10%)</span>
              <span>Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-black text-slate-900">Total Pembayaran</span>
              <span className="text-xl font-black text-primary">Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkoutForm"
            disabled={isSubmitting || cart.length === 0}
            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-black text-sm py-4 rounded-2xl shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses Pesanan...
              </>
            ) : (
              <>
                <CreditCard className="w-4.5 h-4.5" />
                Buat Pesanan Sekarang
              </>
            )}
          </button>
        </div>
      </aside>
      )}

      {/* SUCCESS CONFIRMATION MODAL */}
      {showSuccessModal && lastInvoice && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative overflow-hidden border border-slate-100 animate-pop">
            {/* Top decorative gradient */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500" />
            
            {/* Close button */}
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mt-3 mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-primary mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Pesanan Berhasil Dibuat!</h3>
              <p className="text-xs text-muted-foreground mt-1">Struk katering Anda telah digenerate secara otomatis.</p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4 text-xs font-semibold">
              <div className="flex justify-between border-b border-dashed border-slate-200 pb-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">No. Invoice</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{lastInvoice.no_resi}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tanggal</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Customer summary */}
              <div className="space-y-1.5 text-slate-700">
                <p><span className="text-muted-foreground">Penerima:</span> {lastInvoice.nama_pelanggan} ({lastInvoice.telepon})</p>
                <p className="line-clamp-2"><span className="text-muted-foreground">Alamat:</span> {lastInvoice.alamat}</p>
                <p><span className="text-muted-foreground">Metode Bayar:</span> <span className="bg-blue-50 text-primary text-[10px] px-2 py-0.5 rounded font-black">{lastInvoice.paymentMethodName}</span></p>
              </div>

              {/* Items Table */}
              <div className="border-t border-dashed border-slate-200 pt-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Detail Menu</p>
                <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                  {lastInvoice.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-slate-800">
                      <span className="truncate max-w-[200px]">{item.nama_paket}</span>
                      <span>{item.quantity}x <span className="text-slate-400">@</span> Rp {item.harga.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Row */}
              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline font-black text-slate-900">
                <span className="text-sm">Total Dibayar</span>
                <span className="text-lg text-primary">Rp {lastInvoice.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-sm text-slate-700 transition-all"
              >
                Cetak Struk
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover font-black text-sm text-white transition-all shadow-md shadow-blue-500/10"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
