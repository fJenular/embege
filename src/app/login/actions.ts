"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Simple authentication logic
  const user = await prisma.users.findFirst({
    where: {
      email: email,
      password: password, // In a real app, use hashing!
    },
  });

  if (!user) {
    return { error: "Invalid email or password" };
  }

  // Store user info in cookies (simplified for this task)
  const cookieStore = await cookies();
  cookieStore.set("user_role", user.level || "kurir", { 
    path: "/", 
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: true 
  });
  cookieStore.set("user_name", user.name || "User", { path: "/" });

  // Redirect based on role
  if (user.level === "admin") {
    redirect("/admin");
  } else if (user.level === "owner") {
    redirect("/owner");
  } else {
    redirect("/kurir");
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("user_role");
  cookieStore.delete("user_name");
  redirect("/login");
}
