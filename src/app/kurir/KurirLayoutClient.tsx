"use client";

import { ReactNode } from "react";
import WelcomeOnboarding from "@/components/WelcomeOnboarding";

interface KurirLayoutClientProps {
  children: ReactNode;
  userName?: string;
}

export default function KurirLayoutClient({ children, userName }: KurirLayoutClientProps) {
  return (
    <>
      <WelcomeOnboarding userName={userName} role="kurir" />
      {children}
    </>
  );
}
