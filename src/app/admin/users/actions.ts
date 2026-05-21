"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { users_level } from "@/generated/prisma/enums";

export async function createUser(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const level = String(formData.get("level") ?? "") as users_level;

  await prisma.users.create({
    data: {
      name,
      email,
      password,
      level,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUser(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const level = String(formData.get("level") ?? "") as users_level;
  const password = String(formData.get("password") ?? "");

  const data: {
    name: string;
    email: string;
    level: users_level;
    updated_at: Date;
    password?: string;
  } = {
    name,
    email,
    level,
    updated_at: new Date(),
  };
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
