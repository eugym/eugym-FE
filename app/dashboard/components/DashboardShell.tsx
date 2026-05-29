"use client";

import { useState, useEffect } from "react";
import { setSessionToken } from "@/app/api/lib/session";
import { useAuthStore } from "@/app/store/auth";
import { DashboardProvider } from "./DashboardContext";
import SideNav from "./sideNav";
import TopNav from "./topNav";
import type { User } from "@/app/store/auth";

interface DashboardShellProps {
  user: User;
  token: string;
  children: React.ReactNode;
}

export default function DashboardShell({
  user,
  token,
  children,
}: DashboardShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  // Sync server-provided user + token to client-side stores once on mount.
  // This makes Zustand and the Axios session token correct for all subsequent
  // client-side API calls without any additional network request.
  useEffect(() => {
    setUser(user);
    setSessionToken(token);
  }, [user.id, token, setUser]);

  return (
    <DashboardProvider value={user}>
      <div className="flex h-screen w-full overflow-hidden">
        <SideNav isOpen={isOpen} setIsOpen={setIsOpen} role={user.role} />
        <div className="flex flex-col flex-1 min-w-0 h-full">
          <TopNav isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
