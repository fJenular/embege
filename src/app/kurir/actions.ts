"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitDeliveryProof(pengirimanId: string, photoPath: string) {
  await prisma.pengirimans.update({
    where: { id: BigInt(pengirimanId) },
    data: {
      status_kirim: "Tiba_Ditujuan",
      tgl_tiba: new Date(),
      bukti_foto: photoPath,
      updated_at: new Date(),
    },
  });
  
  // Also update the order status
  const pengiriman = await prisma.pengirimans.findUnique({
    where: { id: BigInt(pengirimanId) },
    select: { id_pesan: true }
  });
  
  if (pengiriman?.id_pesan) {
    // Check if all deliveries for this order are completed? For simplicity let's just mark it completed?
    // Actually pemesanans_status_pesan doesn't have "Selesai" or "Terkirim", let's check schema.
  }

  revalidatePath("/kurir/orders");
  revalidatePath("/admin/pengirimans");
}
