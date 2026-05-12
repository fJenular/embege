"use client";
import { Trash2 } from "lucide-react";
import { deletePemesanan } from "./actions";

export default function DeletePemesananButton({ id }: { id: string }) {
  return (
    <button onClick={async () => { if (confirm("Yakin ingin menghapus pemesanan ini?")) await deletePemesanan(id); }}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
