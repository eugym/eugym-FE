"use client";

import { Bell, Menu, X } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import Profile from "@/components/Profile";
import TrainerImage from "@/public/images/trainer1.png";
import type { User } from "@/app/store/auth";

interface TopNavProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  user: User;
}

export default function TopNav({ isOpen, setIsOpen, user }: TopNavProps) {
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between shadow-md bg-white px-4 shrink-0">
      <button
        className="lg:hidden p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className="flex items-center gap-3 ml-auto">
        <button className="relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <Profile
          fullName={`${user.firstName} ${user.lastName}`}
          role={user.role}
          avatarUrl={TrainerImage}
          onLogout={() => logout.mutate()}
        />
      </div>
    </header>
  );
}
