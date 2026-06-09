"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signSession } from "@/lib/session";

export async function adminLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.users.findFirst({
    where: {
      email: email,
      password: password,
    },
  });

  if (!user) {
    return { error: "Email atau password salah." };
  }

  // Only allow admin users to log in here
  if (user.level !== "admin") {
    return { error: "Akses ditolak. Halaman ini hanya untuk Admin. Silakan login melalui halaman login biasa." };
  }

  // Cryptographically sign the session
  const sessionToken = await signSession({
    id: user.id.toString(),
    email: user.email || "",
    role: "admin",
  });

  const cookieStore = await cookies();
  cookieStore.set("session_token", sessionToken, {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  cookieStore.set("user_role", "admin", {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: true,
  });
  cookieStore.set("user_name", user.name || "Admin", { path: "/" });

  redirect("/admin");
}
