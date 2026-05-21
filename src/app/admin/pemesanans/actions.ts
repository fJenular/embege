"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { pemesanans_status_pesan } from "@/generated/prisma/enums";

export async function updateStatusPemesanan(id: string, status: string) {
  await prisma.pemesanans.update({
    where: { id: BigInt(id) },
    data: {
      status_pesan: status as pemesanans_status_pesan,
      updated_at: new Date(),
    },
  });
  revalidatePath("/admin/pemesanans");
}

export async function deletePemesanan(id: string) {
  // Delete related detail_pemesanans first
  await prisma.detail_pemesanans.deleteMany({ where: { id_pemesanan: BigInt(id) } });
  await prisma.pemesanans.delete({ where: { id: BigInt(id) } });
  revalidatePath("/admin/pemesanans");
}
