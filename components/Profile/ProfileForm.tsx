"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useUpdateProfile } from "@/hooks/useProfile";
import InputField from "../inputs/input";
import Button from "../ui/Button";
import SectionLoader from "../Loaders/sectionLoader";

interface ProfileFormProps {
  profile: any;
  isLoading: boolean;
}

export default function ProfileForm({ profile, isLoading }: ProfileFormProps) {
  const [form, setForm] = useState({
    firstName:   "",
    lastName:    "",
    email:       "",
    phoneNumber: "",
    bio:         "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        firstName:   profile.firstName   ?? "",
        lastName:    profile.lastName    ?? "",
        email:       profile.email       ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        bio:         profile.bio         ?? "",
      });
    }
  }, [profile]);

  const { mutateAsync, isPending } = useUpdateProfile();

  const set = (key: string) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync(form);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <SectionLoader height="260px" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-800">Personal Information</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Update your name, contact details, and bio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="First Name"
            type="text"
            value={form.firstName}
            onChange={set("firstName")}
          />
          <InputField
            label="Last Name"
            type="text"
            value={form.lastName}
            onChange={set("lastName")}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Email Address"
            type="email"
            value={form.email}
            onChange={set("email")}
          />
          <InputField
            label="Phone Number"
            type="text"
            value={form.phoneNumber}
            onChange={set("phoneNumber")}
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 uppercase tracking-wide">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => set("bio")(e.target.value)}
            rows={4}
            placeholder="Tell us a little about yourself…"
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" loading={isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
