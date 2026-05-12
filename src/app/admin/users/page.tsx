import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, UserCheck, Shield, Truck, Crown } from "lucide-react";
import DeleteUserButton from "./DeleteButton";

export const dynamic = "force-dynamic";

const levelIcons: Record<string, { icon: any; color: string; bg: string }> = {
  admin: { icon: Shield, color: "text-red-600", bg: "bg-red-50" },
  owner: { icon: Crown, color: "text-amber-600", bg: "bg-amber-50" },
  kurir: { icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
};

export default async function UsersPage() {
  const users = await prisma.users.findMany({ orderBy: { created_at: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">Daftar Users</h1>
          <p className="text-slate-500 mt-1">Kelola user Admin, Owner, dan Kurir</p>
        </div>
        <Link href="/admin/users/create" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-5 h-5" /> Tambah User
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase tracking-wider">
                <th className="p-4 font-semibold">Nama</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Level</th>
                <th className="p-4 font-semibold">Dibuat</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {users.map((user) => {
                const levelInfo = levelIcons[user.level || "admin"] || levelIcons.admin;
                const LevelIcon = levelInfo.icon;
                return (
                  <tr key={user.id.toString()} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 font-bold text-sm">
                          {(user.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-blue-950">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">{user.email || "-"}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${levelInfo.bg} ${levelInfo.color}`}>
                        <LevelIcon className="w-3.5 h-3.5" />
                        {(user.level || "").charAt(0).toUpperCase() + (user.level || "").slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID") : "-"}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/users/${user.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    <UserCheck className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                    <p className="font-semibold text-slate-500">Belum ada user</p>
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
