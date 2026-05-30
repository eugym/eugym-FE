"use client";

import { useState } from "react";
import Tabs from "../components/tabs";
import { useDashboardUser } from "../components/DashboardContext";
import ProfileCard from "@/components/Profile/ProfileCard";
import ProfileForm from "@/components/Profile/ProfileForm";
import ChangePassword from "@/components/Profile/changePassword";
import { useProfile } from "@/hooks/useProfile";

const TABS = [
  { id: "info",     label: "Personal Info" },
  { id: "security", label: "Security" },
];

export default function ProfilePage() {
  const user = useDashboardUser();
  const { data, isLoading } = useProfile();
  const [activeTab, setActiveTab] = useState("info");

  const profile = data?.data?.profile;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-5 py-6 space-y-6">

        {/* Page header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your account information and security settings
          </p>
        </div>

        {/* Layout: sidebar + main */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Left — identity card */}
          <div className="lg:col-span-1">
            <ProfileCard profile={profile} user={user} isLoading={isLoading} />
          </div>

          {/* Right — tabbed forms */}
          <div className="lg:col-span-2 space-y-5">
            <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

            {activeTab === "info" && (
              <ProfileForm profile={profile} isLoading={isLoading} />
            )}
            {activeTab === "security" && <ChangePassword />}
          </div>

        </div>
      </div>
    </div>
  );
}
