"use client";
import ChangePassword from "@/components/Profile/changePassword";
import ProfileCard from "@/components/Profile/ProfileCard";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-7">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-xl font-semibold text-gray-900">
          Profile Settings
        </h1>

        <ProfileCard />
        <ChangePassword />
      </div>
    </main>
  );
}
