"use client";

import SideNav from "./components/sideNav";
import { useState } from "react";
import TopNav from "./components/topNav";
import ProtectedRoute from "../auth/ProtectedRoute";
import { useAuthStore } from "@/app/store/auth";
import type { Role } from "@/app/store/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const role = useAuthStore((s) => s.user?.role) ?? "visitor";

  return (
    <div className="flex h-screen w-full">
      <SideNav isOpen={isOpen} setIsOpen={setIsOpen} role={role as Role} />
      <div className="flex flex-col flex-1 h-full">
        <TopNav isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <ProtectedRoute>{children}</ProtectedRoute>
        </main>
      </div>
    </div>
  );
}
