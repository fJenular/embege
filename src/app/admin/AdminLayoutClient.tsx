"use client";

import { ReactNode } from "react";
import WelcomeOnboarding from "@/components/WelcomeOnboarding";

interface AdminLayoutClientProps {
  children: ReactNode;
  userName?: string;
}

export default function AdminLayoutClient({ children, userName }: AdminLayoutClientProps) {
  return (
    <>
      <WelcomeOnboarding userName={userName} role="admin" />
      {children}
    </>
  );
}
