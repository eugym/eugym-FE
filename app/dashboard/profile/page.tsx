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

  // The API returns the user record directly; `data.data.profile` was a level
  // deeper than anything the endpoint has ever sent, so this was always
  // undefined and every field rendered blank.
  const profile = data;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-5 py-6 space-y-6">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-(--plate-iron)">Profile</h1>
          <p className="mt-1 text-sm text-(--plate-steel)">
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
