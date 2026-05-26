import prisma from "@/lib/prisma";
import Link from "next/link";
import { Package, Users, ShoppingCart, Truck, CreditCard, UserCheck, ArrowRight, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    paketsCount,
    pelanggansCount,
    pemesanansCount,
    pengirimansCount,
    usersCount,
    jenisBayarCount,
  ] = await Promise.all([
    prisma.pakets.count(),
    prisma.pelanggans.count(),
    prisma.pemesanans.count(),
    prisma.pengirimans.count(),
    prisma.users.count(),
    prisma.jenis_pembayarans.count(),
  ]);

  const stats = [
    { label: "Paket Menu", value: paketsCount, icon: Package, href: "/admin/pakets" },
    { label: "Pelanggan", value: pelanggansCount, icon: Users, href: "/admin/pelanggans" },
    { label: "Pemesanan", value: pemesanansCount, icon: ShoppingCart, href: "/admin/pemesanans" },
    { label: "Pengiriman", value: pengirimansCount, icon: Truck, href: "/admin/pengirimans" },
    { label: "Jenis Bayar", value: jenisBayarCount, icon: CreditCard, href: "/admin/jenis-pembayarans" },
    { label: "Total Users", value: usersCount, icon: UserCheck, href: "/admin/users" },
  ];

  const recentOrders = await prisma.pemesanans.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
    include: { pelanggans: true },
  });

  return (
    <div className="space-y-8 p-1">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1591dc] font-bold text-xs uppercase tracking-[0.15em] mb-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Overview Dashboard
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Main Statistics</h1>
          <p className="text-zinc-400 mt-1.5 text-sm font-medium">Monitoring your catering business performance in real-time.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-zinc-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-2.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-zinc-600">Live Status</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white p-6 rounded-2xl border border-zinc-200/60 flex flex-col justify-between h-40 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-zinc-300 transition-all duration-200 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-[#1591dc] group-hover:bg-[#1591dc]/5 group-hover:border-[#1591dc]/10 transition-colors duration-200">
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-200">
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-zinc-900 tracking-tight leading-none">{stat.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-zinc-200/60 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
          <div className="p-6 sm:p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/20">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Recent Orders</h2>
              <p className="text-zinc-400 text-xs font-medium mt-1">Latest transactions from your customers</p>
            </div>
            <Link 
              href="/admin/pemesanans" 
              className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/60 text-zinc-700 hover:text-zinc-950 rounded-xl text-xs font-semibold transition-all duration-200"
            >
              View Report
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-100">
                  <th className="px-8 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-8 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {recentOrders.map((order) => (
                  <tr key={order.id.toString()} className="hover:bg-zinc-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-semibold text-zinc-900">#{order.no_resi || order.id.toString().padStart(4, "0")}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center font-bold text-xs">
                          {(order.pelanggans?.nama_pelanggan?.charAt(0) || "C").toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 leading-tight">{order.pelanggans?.nama_pelanggan || "Guest"}</p>
                          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">{order.pelanggans?.telepon || "No Phone"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-semibold text-zinc-900">
                      Rp {order.total_bayar?.toLocaleString("id-ID") || "0"}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          order.status_pesan === "Menunggu_Konfirmasi"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : order.status_pesan === "Sedang_Diproses"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}>
                          {order.status_pesan?.replace(/_/g, " ") || "-"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-16 text-center text-zinc-300 font-semibold uppercase tracking-wider text-xs">
                      No Recent Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grow Your Business Action Card */}
        <div className="bg-zinc-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/10">
              <TrendingUp className="w-5.5 h-5.5 text-[#1591dc]" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight leading-tight mb-3">Grow Your Business</h3>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
              Analyze your menu performance and customer feedback to optimize your catering services.
            </p>
          </div>
          
          <button className="relative z-10 w-full mt-8 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer shadow-sm">
            View Analytics
          </button>

          {/* Abstract subtle decor */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#1591dc]/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
        </div>
        
      </div>
    </div>
  );
}
