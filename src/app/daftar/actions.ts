"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const nama = formData.get("nama") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const telepon = formData.get("telepon") as string;
  const alamat = formData.get("alamat") as string;

  if (!nama || !email || !password) {
    return { error: "Nama, email, dan password wajib diisi." };
  }

  // Check if email already exists
  const existing = await prisma.pelanggans.findFirst({
    where: { email },
  });

  if (existing) {
    return { error: "Email sudah terdaftar. Silakan gunakan email lain." };
  }

  // Create the customer
  await prisma.pelanggans.create({
    data: {
      nama_pelanggan: nama,
      email: email,
      password: password, // In a real app, use hashing!
      telepon: telepon || null,
      alamat1: alamat || null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  redirect("/login?registered=true");
}
