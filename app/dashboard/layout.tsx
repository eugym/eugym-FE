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
  const role = (useAuthStore((s) => s.user?.role) ?? "visitor") as Role;

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full">
        <SideNav isOpen={isOpen} setIsOpen={setIsOpen} role={role} />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <TopNav isOpen={isOpen} setIsOpen={setIsOpen} />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
