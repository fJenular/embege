import { ReactNode } from "react";
import { cookies } from "next/headers";
import KurirSidebar from "./KurirSidebar";
import KurirLayoutClient from "./KurirLayoutClient";

export default async function KurirLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const userName = cookieStore.get("user_name")?.value || "Kurir";

  return (
    <div className="flex flex-1 h-[calc(100vh-5rem)] overflow-auto">
      <KurirSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f4f8fc]">
        <div className="max-w-7xl mx-auto w-full">
          <KurirLayoutClient userName={userName}>
            {children}
          </KurirLayoutClient>
        </div>
      </main>
    </div>
  );
}
