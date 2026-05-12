import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { updateUser } from "../../actions";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.users.findUnique({ where: { id: BigInt(id) } });
  if (!user) return notFound();
  const updateWithId = updateUser.bind(null, id);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="p-2 bg-white text-slate-500 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm border border-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">Edit User</h1>
          <p className="text-slate-500 mt-1">Ubah data user</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form action={updateWithId} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nama</label>
              <input name="name" type="text" required defaultValue={user.name || ""} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email</label>
              <input name="email" type="email" required defaultValue={user.email || ""} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password <span className="text-slate-400 font-normal">(kosongkan jika tidak diubah)</span></label>
              <input name="password" type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Password baru" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Level</label>
              <select name="level" required defaultValue={user.level || "admin"} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none">
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
                <option value="kurir">Kurir</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
              <Save className="w-5 h-5" /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
