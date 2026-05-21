"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { pakets_jenis, pakets_kategori } from "@/generated/prisma/enums";

export async function createPaket(formData: FormData) {
  const nama_paket = String(formData.get("nama_paket") ?? "");
  const jenis = String(formData.get("jenis") ?? "") as pakets_jenis;
  const kategori = String(formData.get("kategori") ?? "") as pakets_kategori;
  const jumlah_pax = parseInt(String(formData.get("jumlah_pax") ?? "0")) || 0;
  const harga_paket = parseInt(String(formData.get("harga_paket") ?? "0")) || 0;
  const deskripsi = String(formData.get("deskripsi") ?? "");
  const foto1 = String(formData.get("foto1") ?? "") || null;

  await prisma.pakets.create({
    data: {
      nama_paket,
      jenis,
      kategori,
      jumlah_pax,
      harga_paket,
      deskripsi,
      foto1,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  revalidatePath("/admin/pakets");
  redirect("/admin/pakets");
}

export async function updatePaket(id: string, formData: FormData) {
  const nama_paket = String(formData.get("nama_paket") ?? "");
  const jenis = String(formData.get("jenis") ?? "") as pakets_jenis;
  const kategori = String(formData.get("kategori") ?? "") as pakets_kategori;
  const jumlah_pax = parseInt(String(formData.get("jumlah_pax") ?? "0")) || 0;
  const harga_paket = parseInt(String(formData.get("harga_paket") ?? "0")) || 0;
  const deskripsi = String(formData.get("deskripsi") ?? "");
  const foto1 = String(formData.get("foto1") ?? "") || null;

  await prisma.pakets.update({
    where: { id: BigInt(id) },
    data: {
      nama_paket,
      jenis,
      kategori,
      jumlah_pax,
      harga_paket,
      deskripsi,
      foto1,
      updated_at: new Date(),
    },
  });

  revalidatePath("/admin/pakets");
  redirect("/admin/pakets");
}

export async function deletePaket(id: string) {
  await prisma.pakets.delete({
    where: { id: BigInt(id) },
  });
  revalidatePath("/admin/pakets");
}
