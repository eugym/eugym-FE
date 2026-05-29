"use client";

import { ReactNode } from "react";
// import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";
import { Lock } from "lucide-react";
import { useAuthStore } from "@/app/store/auth";

export type MyUserRole = "REGULAR" | "STANDARD" | "PREMIUM";

interface DisabledRoleGateProps {
  allow: MyUserRole[];
  message?: string;
  label?: string;
  children: ReactNode;
}

export default function DisabledRoleGate({
  allow,
  message = "This feature is not available for your role",
  label = "Premium package",
  children,
}: DisabledRoleGateProps) {
  //   const { user } = useAuth();
  const role = useAuthStore((s) => s.user?.role);
  // const isAllowed = user && allow.includes(role);

  const isAllowed = allow.includes("PREMIUM");
  // const isAllowed = "";
  return (
    <div className="relative">
      {/* Content */}
      <div className={clsx(!isAllowed && "pointer-events-none opacity-60")}>
        {children}
      </div>

      {/* Overlay */}
      {!isAllowed && (
        <>
          <div className="absolute inset-0 z-10 rounded-xl bg-white/10 backdrop-blur-[1px]">
            <div className="absolute right-2 top-2 flex p-3 items-center justify-center gap-2 rounded-full bg-white shadow">
              {/* <div className="flex flex-row"> */}
              <span className="text-sm text-red-500"> {label}</span>
              <Lock size={16} className=" text-red-500" />
              {/* </div> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
