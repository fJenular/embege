import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 h-[calc(100vh-5rem)] overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f4f8fc]">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
