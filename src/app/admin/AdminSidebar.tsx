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
    <aside className="w-64 bg-white border-r border-zinc-200/80 flex flex-col h-full z-20">
      <div className="p-6">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2 mb-8 px-2 py-1">
          <div className="h-7 flex items-center">
            <img src="/logo.svg" alt="EMBEGE Logo" className="h-6 w-auto object-contain" />
          </div>
          <div className="h-3 border-l border-zinc-300 ml-2 pl-2 flex items-center">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Admin</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive 
                    ? "bg-zinc-950 text-white shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${isActive ? "text-[#1591dc]" : "text-zinc-400 group-hover:text-zinc-600"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer / Logout */}
      <div className="mt-auto p-6 border-t border-zinc-100">
        <form action={logout}>
          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 font-semibold text-xs transition-all duration-200 group cursor-pointer"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
