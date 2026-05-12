"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPaket(formData: FormData) {
  const nama_paket = formData.get("nama_paket") as string;
  const jenis = formData.get("jenis") as any;
  const kategori = formData.get("kategori") as any;
  const jumlah_pax = parseInt(formData.get("jumlah_pax") as string) || 0;
  const harga_paket = parseInt(formData.get("harga_paket") as string) || 0;
  const deskripsi = formData.get("deskripsi") as string;
  const foto1 = (formData.get("foto1") as string) || null;

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
  const nama_paket = formData.get("nama_paket") as string;
  const jenis = formData.get("jenis") as any;
  const kategori = formData.get("kategori") as any;
  const jumlah_pax = parseInt(formData.get("jumlah_pax") as string) || 0;
  const harga_paket = parseInt(formData.get("harga_paket") as string) || 0;
  const deskripsi = formData.get("deskripsi") as string;
  const foto1 = (formData.get("foto1") as string) || null;

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
