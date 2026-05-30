"use client";

import { createContext, useContext } from "react";
import type { User } from "@/app/store/auth";

const DashboardContext = createContext<User | null>(null);

export function useDashboardUser(): User {
  const user = useContext(DashboardContext);
  if (!user) {
    throw new Error("useDashboardUser must be used inside the dashboard layout");
  }
  return user;
}

export const DashboardProvider = DashboardContext.Provider;
