"use client";

import { usePathname } from "next/navigation";
import { 
  Bell, 
  Search,
  Settings,
  CircleUserRound
} from "lucide-react";

export default function TopNav() {
  const pathname = usePathname();

  // Hide TopNav on login page
  if (pathname === "/login") return null;

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 z-10 sticky top-0">
      <div className="flex items-center gap-8 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <span className="font-black text-xl">S</span>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">Savoria</span>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-transparent border focus:bg-white focus:border-emerald-500/30 rounded-2xl text-sm font-medium transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all-custom relative group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform" />
        </button>
        
        <button className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all-custom">
          <Settings className="w-5 h-5" />
        </button>

        <div className="w-px h-8 bg-slate-200 mx-2" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-tight">Staff Member</p>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Now</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-400">
            <CircleUserRound className="w-7 h-7" />
          </div>
        </div>
      </div>
    </header>
  );
}
