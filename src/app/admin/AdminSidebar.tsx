"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  LayoutDashboard, 
  UserCheck,
  LogOut
} from "lucide-react";
import { logout } from "../login/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pakets", label: "Paket Menu", icon: Package },
  { href: "/admin/pelanggans", label: "Pelanggan", icon: Users },
  { href: "/admin/pemesanans", label: "Pemesanan", icon: ShoppingCart },
  { href: "/admin/pengirimans", label: "Pengiriman", icon: Truck },
  { href: "/admin/jenis-pembayarans", label: "Jenis Bayar", icon: CreditCard },
  { href: "/admin/users", label: "Users", icon: UserCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full premium-shadow z-20">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">EMBEGE</h2>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all-custom group ${
                  isActive 
                    ? "sidebar-item-active" 
                    : "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-500"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 bg-white">
        <form action={logout}>
          <button 
            type="submit"
            className="flex items-center gap-3 text-slate-400 hover:text-rose-500 font-bold text-sm transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
