"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ListOrdered,
  LogOut,
  Package,
  ChevronLeft
} from "lucide-react";
import { logout } from "../login/actions";

const navItems = [
  { href: "/kurir", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kurir/orders", label: "Daftar Pesanan", icon: ListOrdered },
];

export default function KurirSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full premium-shadow z-20">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">Kurir</h2>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Delivery Partner</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/kurir" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all-custom group ${
                  isActive 
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                    : "text-slate-400 hover:text-amber-500 hover:bg-amber-50"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-amber-500"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-100 bg-slate-50/50">
        <button 
          onClick={() => logout()}
          className="w-full flex items-center justify-between gap-4 px-4 py-4 rounded-2xl text-sm font-black text-rose-500 bg-rose-50 hover:bg-rose-100 transition-all-custom group"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </div>
          <ChevronLeft className="w-4 h-4 opacity-50" />
        </button>
      </div>
    </aside>
  );
}
