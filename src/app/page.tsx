import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("user_role")?.value;

  if (!userRole) {
    redirect("/login");
  }

  // Redirect to their respective dashboard if already logged in
  if (userRole === "admin") {
    redirect("/admin");
  } else if (userRole === "owner") {
    redirect("/owner");
  } else {
    redirect("/kurir");
  }
}
