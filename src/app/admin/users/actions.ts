"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createUser(formData: FormData) {
  await prisma.users.create({
    data: {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      level: formData.get("level") as any,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUser(id: string, formData: FormData) {
  const data: any = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    level: formData.get("level") as any,
    updated_at: new Date(),
  };
  // Only update password if provided
  const password = formData.get("password") as string;
  if (password) data.password = password;

  await prisma.users.update({
    where: { id: BigInt(id) },
    data,
  });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(id: string) {
  await prisma.users.delete({ where: { id: BigInt(id) } });
  revalidatePath("/admin/users");
}
