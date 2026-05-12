"use client";
import { Trash2 } from "lucide-react";
import { deleteJenisBayar } from "./actions";

export default function DeleteJenisBayarButton({ id }: { id: string }) {
  return (
    <button onClick={async () => { if (confirm("Yakin ingin menghapus?")) await deleteJenisBayar(id); }}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
