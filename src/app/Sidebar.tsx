"use client";

import { Menu, ShoppingCart, Home, Package, Users, LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "./login/actions";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide sidebar on login page
  if (pathname === "/login") return null;

  const isAdmin = pathname.startsWith("/admin");
  const isKurir = pathname.startsWith("/kurir");
  const isOwner = pathname.startsWith("/owner");

  const menuItems = isAdmin
    ? [
        { label: "Dashboard", href: "/admin", icon: Home },
        { label: "Paket Menu", href: "/admin/pakets", icon: Package },
        { label: "Pelanggan", href: "/admin/pelanggans", icon: Users },
        { label: "Pesanan", href: "/admin/pemesanans", icon: ShoppingCart },
      ]
    : isKurir
    ? [
        { label: "Pesanan", href: "/kurir/orders", icon: ShoppingCart },
      ]
    : isOwner
    ? [
        { label: "Dashboard", href: "/owner", icon: Home },
        { label: "Pesanan", href: "/owner/pesan", icon: ShoppingCart },
      ]
    : [];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 md:hidden z-50 bg-emerald-600 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 z-40 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg">
              <span className="font-black text-xl">E</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">EMBEGE</h1>
              <p className="text-xs text-slate-500">Good food. Good mood</p>
            </div>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200">
          <form action={logout} className="w-full">
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all">
              <LogOut className="w-5 h-5" />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
