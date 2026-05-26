"use client";
import { updateStatusPengiriman } from "./actions";

const statusOptions = [
  { value: "Sedang_Dikirim", label: "Sedang Dikirim", color: "bg-blue-50 text-blue-600 border-blue-100/80" },
  { value: "Tiba_Ditujuan", label: "Tiba di Tujuan", color: "bg-emerald-50 text-emerald-600 border-emerald-100/80" },
];

export default function PengirimStatusSelect({ id, current }: { id: string; current: string }) {
  const currentOption = statusOptions.find(s => s.value === current) || statusOptions[0];
  return (
    <select
      defaultValue={current}
      onChange={async (e) => { await updateStatusPengiriman(id, e.target.value); }}
      className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-zinc-100 transition-all ${currentOption.color}`}
    >
      {statusOptions.map((s) => (
        <option key={s.value} value={s.value} className="bg-white text-zinc-800 text-xs font-semibold py-2 font-sans normal-case tracking-normal">{s.label}</option>
      ))}
    </select>
  );
}
