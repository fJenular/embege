"use client";
import { updateStatusPengiriman } from "./actions";

const statusOptions = [
  { value: "Sedang_Dikirim", label: "Sedang Dikirim", color: "bg-blue-100 text-blue-700" },
  { value: "Tiba_Ditujuan", label: "Tiba di Tujuan", color: "bg-green-100 text-green-700" },
];

export default function PengirimStatusSelect({ id, current }: { id: string; current: string }) {
  const currentOption = statusOptions.find(s => s.value === current) || statusOptions[0];
  return (
    <select
      defaultValue={current}
      onChange={async (e) => { await updateStatusPengiriman(id, e.target.value); }}
      className={`px-3 py-1.5 rounded-full text-xs font-bold border-0 appearance-none cursor-pointer focus:outline-none ${currentOption.color}`}
    >
      {statusOptions.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
