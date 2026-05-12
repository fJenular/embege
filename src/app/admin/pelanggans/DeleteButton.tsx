"use client";
import { Trash2 } from "lucide-react";
import { deletePelanggan } from "./actions";

export default function DeletePelangganButton({ id }: { id: string }) {
  return (
    <button onClick={async () => { if (confirm("Yakin ingin menghapus pelanggan ini?")) await deletePelanggan(id); }}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
