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
    { label: "Paket Menu", value: paketsCount, icon: Package, color: "text-emerald-600", bg: "bg-emerald-50", href: "/admin/pakets" },
    { label: "Pelanggan", value: pelanggansCount, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", href: "/admin/pelanggans" },
    { label: "Pemesanan", value: pemesanansCount, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50", href: "/admin/pemesanans" },
    { label: "Pengiriman", value: pengirimansCount, icon: Truck, color: "text-purple-600", bg: "bg-purple-50", href: "/admin/pengirimans" },
    { label: "Jenis Bayar", value: jenisBayarCount, icon: CreditCard, color: "text-cyan-600", bg: "bg-cyan-50", href: "/admin/jenis-pembayarans" },
    { label: "Total Users", value: usersCount, icon: UserCheck, color: "text-rose-600", bg: "bg-rose-50", href: "/admin/users" },
  ];

  const recentOrders = await prisma.pemesanans.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
    include: { pelanggans: true },
  });

  return (
    <div className="flex-1 overflow-y-auto">
    <div className="space-y-10 p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <TrendingUp className="w-4 h-4" />
            Overview Dashboard
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Main Statistics</h1>
          <p className="text-slate-400 mt-2 font-medium">Monitoring your catering business performance in real-time.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-slate-600">Live Status</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-between h-48 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all-custom group relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} group-hover:scale-110 transition-transform relative z-10`}>
                <Icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900 leading-none">{stat.value}</p>
              </div>
              
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all">
                <Icon className={`w-32 h-32 ${stat.color}`} />
              </div>

              <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden premium-shadow">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/30">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Orders</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Latest transactions from your customers</p>
            </div>
            <Link href="/admin/pemesanans" className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-black hover:bg-emerald-600 hover:text-white transition-all-custom">
              View Report
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-10 py-5">Order ID</th>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5 text-right">Amount</th>
                  <th className="px-10 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order) => (
                  <tr key={order.id.toString()} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <span className="font-black text-slate-900">#{order.no_resi || order.id.toString().padStart(4, "0")}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                          {order.pelanggans?.nama_pelanggan?.charAt(0) || "C"}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-tight">{order.pelanggans?.nama_pelanggan || "Guest"}</p>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{order.pelanggans?.telepon || "No Phone"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <span className="text-sm font-black text-emerald-600">Rp {order.total_bayar?.toLocaleString("id-ID") || "0"}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          order.status_pesan === "Menunggu_Konfirmasi"
                            ? "bg-amber-100 text-amber-600"
                            : order.status_pesan === "Sedang_Diproses"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}>
                          {order.status_pesan?.replace(/_/g, " ") || "-"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest">No Recent Data Found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center mb-8">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-black tracking-tight leading-tight mb-4">Grow Your<br />Business</h3>
            <p className="text-emerald-100/70 font-medium leading-relaxed">
              Analyze your menu performance and customer feedback to optimize your catering services.
            </p>
          </div>
          
          <button className="relative z-10 w-full py-4 bg-white text-emerald-600 rounded-2xl font-black shadow-lg hover:bg-emerald-50 transition-all active:scale-95">
            View Analytics
          </button>

          {/* Abstract decor */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
    </div>
  );
}
