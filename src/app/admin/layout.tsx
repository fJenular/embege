import { ReactNode } from "react";
import { cookies } from "next/headers";
import AdminSidebar from "./AdminSidebar";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const userName = cookieStore.get("user_name")?.value || "Admin";

  return (
    <div className="flex flex-1 h-[calc(100vh-5rem)] overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f4f4f5]">
        <div className="max-w-7xl mx-auto w-full">
          <AdminLayoutClient userName={userName}>
            {children}
          </AdminLayoutClient>
        </div>
      </main>
    </div>
  );
}
