"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import { ROLE_LABELS, type AssignableRole } from "./types";

export interface CreateUserValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: AssignableRole;
}

/**
 * Creates an account on someone's behalf (UC-A8).
 *
 * There is no password field by design: the backend creates the account with
 * none and emails an activation link, so the admin never sees or chooses
 * anyone's credentials.
 */
export default function CreateUserForm({
  allowedRoles,
  submitting,
  serverError,
  onSubmit,
  onCancel,
}: {
  allowedRoles: readonly AssignableRole[];
  submitting: boolean;
  serverError?: string | null;
  onSubmit: (values: CreateUserValues) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<CreateUserValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: allowedRoles[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof CreateUserValues, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};

    // Mirrors the backend zod schema so a fixable slip shows inline instead of
    // returning as a 400 the admin has to interpret.
    if (values.firstName.trim().length < 2)
      next.firstName = "At least 2 characters.";
    if (values.lastName.trim().length < 2)
      next.lastName = "At least 2 characters.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email.trim()))
      next.email = "Enter a valid email address.";
    if (values.phone.trim().length < 10)
      next.phone = "Enter a valid phone number (at least 10 digits).";

    return next;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    onSubmit({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      role: values.role,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" id="first-name" error={errors.firstName}>
          <input
            id="first-name"
            className="form-input"
            value={values.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="Amaka"
          />
        </Field>

        <Field label="Last name" id="last-name" error={errors.lastName}>
          <input
            id="last-name"
            className="form-input"
            value={values.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="Obi"
          />
        </Field>
      </div>

      <Field label="Email" id="new-email" error={errors.email}>
        <input
          id="new-email"
          type="email"
          className="form-input"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="amaka@example.com"
        />
      </Field>

      <Field label="Phone" id="new-phone" error={errors.phone}>
        <input
          id="new-phone"
          className="form-input"
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+2348012345678"
        />
      </Field>

      <Field label="Role" id="new-role">
        <select
          id="new-role"
          className="form-input"
          value={values.role}
          onChange={(e) => set("role", e.target.value)}
        >
          {allowedRoles.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </Field>

      <p className="flex gap-2.5 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
        <Mail size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        They&rsquo;ll get an email with a link to choose their own password. The
        account can&rsquo;t be signed into until they do, and the link lasts 7
        days.
      </p>

      {serverError && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {serverError}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Create &amp; send invite
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
