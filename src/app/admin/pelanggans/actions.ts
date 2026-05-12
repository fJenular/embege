"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPelanggan(formData: FormData) {
  await prisma.pelanggans.create({
    data: {
      nama_pelanggan: formData.get("nama_pelanggan") as string,
      email: (formData.get("email") as string) || null,
      telepon: (formData.get("telepon") as string) || null,
      alamat1: (formData.get("alamat1") as string) || null,
      tgl_lahir: formData.get("tgl_lahir") ? new Date(formData.get("tgl_lahir") as string) : null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  revalidatePath("/admin/pelanggans");
  redirect("/admin/pelanggans");
}

export async function updatePelanggan(id: string, formData: FormData) {
  await prisma.pelanggans.update({
    where: { id: BigInt(id) },
    data: {
      nama_pelanggan: formData.get("nama_pelanggan") as string,
      email: (formData.get("email") as string) || null,
      telepon: (formData.get("telepon") as string) || null,
      alamat1: (formData.get("alamat1") as string) || null,
      tgl_lahir: formData.get("tgl_lahir") ? new Date(formData.get("tgl_lahir") as string) : null,
      updated_at: new Date(),
    },
  });
  revalidatePath("/admin/pelanggans");
  redirect("/admin/pelanggans");
}

export async function deletePelanggan(id: string) {
  await prisma.pelanggans.delete({ where: { id: BigInt(id) } });
  revalidatePath("/admin/pelanggans");
}
