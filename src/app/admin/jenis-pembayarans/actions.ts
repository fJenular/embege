"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJenisBayar(formData: FormData) {
  await prisma.jenis_pembayarans.create({
    data: {
      metode_pembayaran: formData.get("metode_pembayaran") as string,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  revalidatePath("/admin/jenis-pembayarans");
  redirect("/admin/jenis-pembayarans");
}

export async function updateJenisBayar(id: string, formData: FormData) {
  await prisma.jenis_pembayarans.update({
    where: { id: BigInt(id) },
    data: {
      metode_pembayaran: formData.get("metode_pembayaran") as string,
      updated_at: new Date(),
    },
  });
  revalidatePath("/admin/jenis-pembayarans");
  redirect("/admin/jenis-pembayarans");
}

export async function deleteJenisBayar(id: string) {
  await prisma.jenis_pembayarans.delete({ where: { id: BigInt(id) } });
  revalidatePath("/admin/jenis-pembayarans");
}
