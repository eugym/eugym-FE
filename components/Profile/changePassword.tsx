"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import InputField from "@/components/inputs/input";
import { useChangePassword } from "@/hooks/useChangePassword";

export default function ChangePassword() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const { mutateAsync, isPending } = useChangePassword();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // 🔒 hydration-safe boundary

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.currentPassword === form.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    try {
      await mutateAsync(form);
      toast.success("Password changed successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to change password");
    }
  };

  return (
    <section className="max-w-screen mt-10 bg-white rounded-xl border border-gray-200  shadow-200 p-6 space-y-5">
      <header>
        <h2 className="text-lg font-semibold text-primary-300">
          Change Password
        </h2>
        <p className="text-sm text-primary-200">Update your account password</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-10">
        <div className="grid sm:grid-cols-2 gap-5 space-x-4">
          <InputField
            label="Current Password"
            type="password"
            value={form.currentPassword}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                currentPassword: value,
              }))
            }
          />

          <InputField
            label="New Password"
            type="password"
            value={form.newPassword}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                newPassword: value,
              }))
            }
          />
        </div>

        <Button
          type="submit"
          loading={isPending}
          className="flex justify-self-center sm:w-auto w-full"
        >
          Change Password
        </Button>
      </form>
    </section>
  );
}
