"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import InputField from "@/components/inputs/input";
import { useChangePassword } from "@/hooks/useChangePassword";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

export default function ChangePassword() {
  const [form, setForm] = useState(EMPTY);
  const { mutateAsync, isPending } = useChangePassword();

  const set = (key: keyof typeof EMPTY) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (form.currentPassword === form.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    try {
      await mutateAsync({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password changed successfully");
      setForm(EMPTY);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to change password");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-800">Change Password</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Choose a strong password you don't use on other accounts.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="Current Password"
          type="password"
          value={form.currentPassword}
          onChange={set("currentPassword")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="New Password"
            type="password"
            value={form.newPassword}
            onChange={set("newPassword")}
          />
          <InputField
            label="Confirm New Password"
            type="password"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
          />
        </div>

        <ul className="text-xs text-gray-400 list-disc pl-4 space-y-1">
          <li>At least 8 characters long</li>
          <li>Must be different from your current password</li>
        </ul>

        <div className="flex justify-end pt-1">
          <Button type="submit" loading={isPending}>
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
