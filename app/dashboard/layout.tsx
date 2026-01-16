"use client";

import SideNav from "./components/sideNav";
import { useState } from "react";
import TopNav from "./components/topNav";
import ProtectedRoute from "../auth/ProtectedRoute";
// import { useAuthStore } from "@/app/store/auth";
import { getUserRole } from "../api/lib/role";
// import { UserRole } from "@/types/user";
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  // console.log("role", role);
  const userRole = getUserRole();

  return (
    <div className="flex h-screen w-full">
      <SideNav isOpen={isOpen} setIsOpen={setIsOpen} role={userRole as any} />
      <div className="flex flex-col flex-1 h-full">
        <TopNav isOpen={isOpen} setIsOpen={setIsOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {/* {children} */}
          <ProtectedRoute>{children}</ProtectedRoute>
        </main>
      </div>
    </div>
  );
}
