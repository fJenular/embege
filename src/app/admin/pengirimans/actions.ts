"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPengiriman(formData: FormData) {
  await prisma.pengirimans.create({
    data: {
      id_pesan: BigInt(formData.get("id_pesan") as string),
      id_user: formData.get("id_user") ? BigInt(formData.get("id_user") as string) : null,
      tgl_kirim: formData.get("tgl_kirim") ? new Date(formData.get("tgl_kirim") as string) : null,
      status_kirim: "Sedang_Dikirim",
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  revalidatePath("/admin/pengirimans");
  redirect("/admin/pengirimans");
}

export async function updateStatusPengiriman(id: string, status: string) {
  await prisma.pengirimans.update({
    where: { id: BigInt(id) },
    data: {
      status_kirim: status as any,
      ...(status === "Tiba_Ditujuan" ? { tgl_tiba: new Date() } : {}),
      updated_at: new Date(),
    },
  });
  revalidatePath("/admin/pengirimans");
}

export async function updatePengiriman(id: string, formData: FormData) {
  await prisma.pengirimans.update({
    where: { id: BigInt(id) },
    data: {
      id_pesan: BigInt(formData.get("id_pesan") as string),
      id_user: formData.get("id_user") ? BigInt(formData.get("id_user") as string) : null,
      tgl_kirim: formData.get("tgl_kirim") ? new Date(formData.get("tgl_kirim") as string) : null,
      status_kirim: (formData.get("status_kirim") as any) || "Sedang_Dikirim",
      updated_at: new Date(),
    },
  });
  revalidatePath("/admin/pengirimans");
  redirect("/admin/pengirimans");
}

export async function deletePengiriman(id: string) {
  await prisma.pengirimans.delete({ where: { id: BigInt(id) } });
  revalidatePath("/admin/pengirimans");
}
