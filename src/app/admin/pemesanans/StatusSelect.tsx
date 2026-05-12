"use client";
import { updateStatusPemesanan } from "./actions";

const statusOptions = [
  { value: "Menunggu_Konfirmasi", label: "Menunggu Konfirmasi", color: "bg-amber-100 text-amber-700" },
  { value: "Sedang_Diproses", label: "Sedang Diproses", color: "bg-blue-100 text-blue-700" },
  { value: "Menunggu_Kurir", label: "Menunggu Kurir", color: "bg-green-100 text-green-700" },
];

export default function StatusSelect({ id, current }: { id: string; current: string }) {
  const currentOption = statusOptions.find(s => s.value === current) || statusOptions[0];
  return (
    <select
      defaultValue={current}
      onChange={async (e) => { await updateStatusPemesanan(id, e.target.value); }}
      className={`px-3 py-1.5 rounded-full text-xs font-bold border-0 appearance-none cursor-pointer focus:outline-none ${currentOption.color}`}
    >
      {statusOptions.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
