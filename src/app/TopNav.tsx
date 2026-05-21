"use client";

import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();

  // Hide TopNav - using Sidebar instead
  return null;
}
