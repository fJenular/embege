"use client";

import { ReactNode } from "react";
import WelcomeOnboarding from "@/components/WelcomeOnboarding";

interface OwnerLayoutClientProps {
  children: ReactNode;
  userName?: string;
}

export default function OwnerLayoutClient({ children, userName }: OwnerLayoutClientProps) {
  return (
    <>
      <WelcomeOnboarding userName={userName} role="owner" />
      {children}
    </>
  );
}
