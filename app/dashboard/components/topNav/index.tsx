"use client";

import { Bell, Menu, X } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import Profile from "@/components/Profile";
// import { getUserRole } from "@/app/api/lib/role";
// import { useAuth } from "@/hooks/useAuth";
import { getStoredUser } from "@/app/store/auth";
import TrainerImage from "@/public/images/trainer1.png";

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}
export default function TopBar({ isOpen, setIsOpen }: IProps) {
  const user = getStoredUser();
  const logout = useLogout();
  function handleLogout() {
    logout.mutate();
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between shadow-md bg-white px-2">
      <div>
        <button
          className="lg:hidden p-2 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-1 mr-2">
          <Profile
            fullName={user?.fullName}
            role={user?.role as string}
            avatarUrl={TrainerImage}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}
