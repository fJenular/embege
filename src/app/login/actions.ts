"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signSession } from "@/lib/session";

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

  // Prevent admin from logging in via customer/staff login portal
  if (user.level === "admin") {
    return { error: "Akun Admin terdeteksi. Silakan login melalui halaman login khusus Admin." };
  }

  // Cryptographically sign the session
  const sessionToken = await signSession({
    id: user.id.toString(),
    email: user.email || "",
    role: user.level || "kurir"
  });

  // Store user info in cookies
  const cookieStore = await cookies();
  cookieStore.set("session_token", sessionToken, {
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
  cookieStore.set("user_role", user.level || "kurir", { 
    path: "/", 
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: true 
  });
  cookieStore.set("user_name", user.name || "User", { path: "/" });

  // Redirect based on role
  if (user.level === "owner") {
    redirect("/owner");
  } else {
    redirect("/kurir");
  }
}

export async function logout() {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;
  cookieStore.delete("session_token");
  cookieStore.delete("user_role");
  cookieStore.delete("user_name");
  
  if (role === "admin") {
    redirect("/admin/login");
  } else {
    redirect("/login");
  }
}
