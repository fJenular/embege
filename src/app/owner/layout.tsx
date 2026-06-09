import { ReactNode } from "react";
import { cookies } from "next/headers";
import OwnerSidebar from "./OwnerSidebar";
import OwnerLayoutClient from "./OwnerLayoutClient";

export default async function OwnerLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const userName = cookieStore.get("user_name")?.value || "Owner";

  return (
    <div className="flex flex-1 h-[calc(100vh-5rem)] overflow-auto">
      <OwnerSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f4f8fc]">
        <div className="max-w-7xl mx-auto w-full">
          <OwnerLayoutClient userName={userName}>
            {children}
          </OwnerLayoutClient>
        </div>
      </main>
    </div>
  );
}
