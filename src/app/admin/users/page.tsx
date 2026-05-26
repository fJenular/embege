import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, UserCheck, Shield, Truck, Crown, ArrowUpRight, type LucideIcon } from "lucide-react";
import DeleteUserButton from "./DeleteButton";

export const dynamic = "force-dynamic";

const levelIcons: Record<string, { icon: LucideIcon; color: string; bg: string; border: string }> = {
  admin: { icon: Shield, color: "text-rose-600", bg: "bg-rose-50/50", border: "border-rose-100/80" },
  owner: { icon: Crown, color: "text-amber-600", bg: "bg-amber-50/50", border: "border-amber-100/80" },
  kurir: { icon: Truck, color: "text-[#1591dc]", bg: "bg-sky-50/50", border: "border-sky-100/80" },
};

export default async function UsersPage() {
  const users = await prisma.users.findMany({ orderBy: { created_at: "desc" } });

  return (
    <div className="space-y-6 p-1">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1591dc] font-bold text-xs uppercase tracking-[0.15em] mb-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            Staff Control
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Daftar Users</h1>
          <p className="text-zinc-400 mt-1.5 text-sm font-medium">Manage app access credentials for admins, owners, and couriers.</p>
        </div>
        
        <Link 
          href="/admin/users/create" 
          className="flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-[0_2px_8px_rgba(24,24,27,0.05)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah User
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] border border-zinc-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-100">
                <th className="px-8 py-4">Nama</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Dibuat</th>
                <th className="px-8 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {users.map((user) => {
                const levelInfo = levelIcons[user.level || "admin"] || levelIcons.admin;
                const LevelIcon = levelInfo.icon;
                return (
                  <tr key={user.id.toString()} className="hover:bg-zinc-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center font-bold text-xs">
                          {(user.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-zinc-900 group-hover:text-[#1591dc] transition-colors">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-zinc-500">{user.email || "-"}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${levelInfo.bg} ${levelInfo.color} ${levelInfo.border}`}>
                        <LevelIcon className="w-3.5 h-3.5" />
                        {(user.level || "")}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-zinc-500">{user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID") : "-"}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link 
                          href={`/admin/users/${user.id}/edit`} 
                          className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteUserButton id={user.id.toString()} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserCheck className="w-8 h-8 text-zinc-300" />
                      </div>
                      <p className="font-semibold text-zinc-900 text-lg tracking-tight">No Staff Members</p>
                      <p className="text-zinc-400 text-xs mt-1.5 font-medium leading-relaxed">Create staff accounts to delegate admin, owner, or courier operations.</p>
                      <Link 
                        href="/admin/users/create" 
                        className="inline-flex items-center gap-1 text-[#1591dc] hover:text-blue-700 font-bold text-xs mt-4 group"
                      >
                        Add Staff <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
