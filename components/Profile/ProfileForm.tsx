"use client";

import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Lock, ShieldCheck, ShieldAlert } from "lucide-react";
import { useUpdateProfile, type Profile } from "@/hooks/useProfile";
import { errorMessage } from "@/hooks/useBackend";
import InputField from "../inputs/input";
import Button from "../ui/Button";
import SectionLoader from "../Loaders/sectionLoader";

interface ProfileFormProps {
  profile?: Profile;
  isLoading: boolean;
}

const BLANK = { firstName: "", lastName: "", phone: "" };

/**
 * Personal Information.
 *
 * Only the three fields `PATCH /users/me` actually accepts are editable. The
 * form previously also offered `email` and `bio`: the API ignores email, and
 * there is no bio column on `users` at all, so both silently discarded whatever
 * was typed and still reported "Profile updated successfully".
 */
export default function ProfileForm({ profile, isLoading }: ProfileFormProps) {
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Server values are the baseline. Kept separately from `form` so the Save
  // button can tell "edited" from "loaded".
  const saved = useMemo(
    () => ({
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      phone: profile?.phone ?? "",
    }),
    [profile]
  );

  useEffect(() => setForm(saved), [saved]);

  const { mutateAsync, isPending } = useUpdateProfile();

  const dirty =
    form.firstName !== saved.firstName ||
    form.lastName !== saved.lastName ||
    form.phone !== saved.phone;

  const set = (key: keyof typeof BLANK) => (val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const found: Record<string, string> = {};
    if (form.firstName.trim().length < 2)
      found.firstName = "First name needs at least 2 characters";
    if (form.lastName.trim().length < 2)
      found.lastName = "Last name needs at least 2 characters";
    if (form.phone.replace(/\D/g, "").length < 10)
      found.phone = "Enter a valid phone number";
    return found;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const found = validate();
    if (Object.keys(found).length) {
      setErrors(found);
      toast.error("Fix the highlighted fields to continue");
      return;
    }
    setErrors({});

    // Send only what changed. A PATCH that restates unchanged values is a
    // pointless write and makes `updatedAt` lie about when anything happened.
    const changed: Record<string, string> = {};
    if (form.firstName !== saved.firstName)
      changed.firstName = form.firstName.trim();
    if (form.lastName !== saved.lastName) changed.lastName = form.lastName.trim();
    if (form.phone !== saved.phone) changed.phone = form.phone.trim();

    try {
      await mutateAsync(changed);
      toast.success("Profile updated");
    } catch (err) {
      const message = errorMessage(err);
      setErrors({ ...(err as { fieldErrors?: Record<string, string> })?.fieldErrors });
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-(--plate-radius) border border-(--plate-rule) bg-(--plate-surface) p-6">
        <SectionLoader height="260px" />
      </div>
    );
  }

  return (
    <div className="rounded-(--plate-radius) border border-(--plate-rule) bg-(--plate-surface) p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-(--plate-iron)">
          Personal Information
        </h2>
        <p className="mt-0.5 text-sm text-(--plate-steel)">
          Update your name and contact number.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="First Name"
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            error={errors.firstName}
            onChange={set("firstName")}
          />
          <InputField
            label="Last Name"
            type="text"
            autoComplete="family-name"
            value={form.lastName}
            error={errors.lastName}
            onChange={set("lastName")}
          />
        </div>

        <InputField
          label="Phone Number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={form.phone}
          error={errors.phone}
          onChange={set("phone")}
        />

        {/* Email is shown, never edited. Changing a sign-in address has to go
            through a verification round-trip that does not exist yet, so an
            editable box here would only look like it worked. */}
        <div className="flex flex-col space-y-1">
          <span className="text-xs uppercase tracking-wide text-(--plate-steel)">
            Email Address
          </span>
          <div className="flex items-center gap-2 rounded-(--plate-radius) border border-(--plate-rule) bg-(--plate-ground) px-3 py-2">
            <Lock size={15} className="shrink-0 text-(--plate-steel)" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-sm text-(--plate-iron)">
              {profile?.email ?? "—"}
            </span>
            {profile?.isEmailVerified ? (
              <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-(--plate-green-deep)">
                <ShieldCheck size={13} aria-hidden="true" />
                Verified
              </span>
            ) : (
              <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-amber-700">
                <ShieldAlert size={13} aria-hidden="true" />
                Unverified
              </span>
            )}
          </div>
          <p className="text-xs text-(--plate-steel)">
            Contact support to change the email address on your account.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          {dirty && (
            <span className="text-xs text-(--plate-steel)">Unsaved changes</span>
          )}
          <Button
            type="submit"
            loading={isPending}
            disabled={!dirty}
            className="min-w-[10rem]"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
