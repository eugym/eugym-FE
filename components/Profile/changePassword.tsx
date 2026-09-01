"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";
import Button from "@/components/ui/Button";
import InputField from "@/components/inputs/input";
import { useChangePassword } from "@/hooks/useChangePassword";
import { errorMessage } from "@/hooks/useBackend";
import { parseAuthError } from "@/app/api/lib/authError";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

/**
 * Every rule the server enforces, checked live.
 *
 * The old copy listed only "at least 8 characters" and "different from your
 * current password" — but `POST /users/me/password` also requires a capital and
 * a digit. A visitor following the stated rules would be rejected for a reason
 * the page never mentioned.
 */
const RULES: { id: string; label: string; test: (pw: string) => boolean }[] = [
  { id: "len", label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { id: "upper", label: "One capital letter", test: (pw) => /[A-Z]/.test(pw) },
  { id: "digit", label: "One number", test: (pw) => /[0-9]/.test(pw) },
];

export default function ChangePassword() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutateAsync, isPending } = useChangePassword();

  const set = (key: keyof typeof EMPTY) => (val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const unmet = RULES.filter((r) => !r.test(form.newPassword));
  const touched = form.newPassword.length > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const found: Record<string, string> = {};
    if (!form.currentPassword) found.currentPassword = "Enter your current password";
    if (unmet.length) found.newPassword = unmet[0].label;
    if (form.currentPassword && form.currentPassword === form.newPassword)
      found.newPassword = "New password must be different from your current one";
    if (form.confirmPassword !== form.newPassword)
      found.confirmPassword = "Passwords don't match";

    if (Object.keys(found).length) {
      setErrors(found);
      toast.error("Fix the highlighted fields to continue");
      return;
    }
    setErrors({});

    try {
      await mutateAsync({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password updated");
      setForm(EMPTY);
    } catch (err) {
      // The server returns a per-field map for validation failures and a plain
      // message for a wrong current password; surface whichever it sent rather
      // than collapsing both into one generic string.
      const { fieldErrors, code } = parseAuthError(err);
      const message = errorMessage(err);

      if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
      else if (code === "UNAUTHORIZED") setErrors({ currentPassword: message });

      toast.error(message);
    }
  };

  return (
    <div className="rounded-(--plate-radius) border border-(--plate-rule) bg-(--plate-surface) p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-(--plate-iron)">
          Change Password
        </h2>
        <p className="mt-0.5 text-sm text-(--plate-steel)">
          Choose a strong password you don&rsquo;t use on other accounts.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="Current Password"
          type="password"
          autoComplete="current-password"
          value={form.currentPassword}
          error={errors.currentPassword}
          onChange={set("currentPassword")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="New Password"
            type="password"
            autoComplete="new-password"
            value={form.newPassword}
            error={errors.newPassword}
            onChange={set("newPassword")}
          />
          <InputField
            label="Confirm New Password"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            error={errors.confirmPassword}
            onChange={set("confirmPassword")}
          />
        </div>

        {/* Requirements tick off as they're met, so the rules are feedback
            rather than a list you re-read after each rejection. */}
        <ul className="space-y-1.5" aria-live="polite">
          {RULES.map((rule) => {
            const met = rule.test(form.newPassword);
            return (
              <li
                key={rule.id}
                className={`flex items-center gap-2 text-xs ${
                  !touched
                    ? "text-(--plate-steel)"
                    : met
                      ? "text-(--plate-green-deep)"
                      : "text-(--plate-steel)"
                }`}
              >
                {touched && met ? (
                  <Check size={13} className="shrink-0" aria-hidden="true" />
                ) : (
                  <X
                    size={13}
                    className={`shrink-0 ${touched ? "text-red-600" : "opacity-40"}`}
                    aria-hidden="true"
                  />
                )}
                <span>{rule.label}</span>
                <span className="sr-only">{touched && met ? "met" : "not met"}</span>
              </li>
            );
          })}
        </ul>

        <p className="text-xs text-(--plate-steel)">
          Signing in again will be required on your other devices.
        </p>

        <div className="flex justify-end pt-1">
          <Button type="submit" loading={isPending} className="min-w-[11rem]">
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
