"use client";
import { updateStatusPemesanan } from "./actions";

const statusOptions = [
  { value: "Menunggu_Konfirmasi", label: "Menunggu Konfirmasi", color: "bg-amber-50 text-amber-600 border-amber-100/80" },
  { value: "Sedang_Diproses", label: "Sedang Diproses", color: "bg-blue-50 text-blue-600 border-blue-100/80" },
  { value: "Menunggu_Kurir", label: "Menunggu Kurir", color: "bg-emerald-50 text-emerald-600 border-emerald-100/80" },
];

export default function StatusSelect({ id, current }: { id: string; current: string }) {
  const currentOption = statusOptions.find(s => s.value === current) || statusOptions[0];
  return (
    <select
      defaultValue={current}
      onChange={async (e) => { await updateStatusPemesanan(id, e.target.value); }}
      className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-zinc-100 transition-all ${currentOption.color}`}
    >
      {statusOptions.map((s) => (
        <option key={s.value} value={s.value} className="bg-white text-zinc-800 text-xs font-semibold py-2 font-sans normal-case tracking-normal">{s.label}</option>
      ))}
    </select>
  );
}
