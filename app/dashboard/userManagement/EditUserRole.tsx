"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  ASSIGNABLE_ROLES,
  ROLE_LABELS,
  fullName,
  isDowngrade,
  type AssignableRole,
  type Member,
} from "./types";

/**
 * Change a member's role (UC-A2).
 *
 * The SRS says "only upgrades allowed", but that constrains what a member may
 * do to their own plan — an admin correcting a mis-set role or handling a
 * refund needs to move someone down. So a downgrade is permitted and confirmed
 * rather than blocked.
 */
export default function EditUserRole({
  member,
  submitting,
  serverError,
  onSubmit,
  onCancel,
}: {
  member: Member;
  submitting: boolean;
  serverError?: string | null;
  onSubmit: (role: AssignableRole) => void;
  onCancel: () => void;
}) {
  const currentIsAssignable = (ASSIGNABLE_ROLES as readonly string[]).includes(
    member.role
  );

  const [role, setRole] = useState<AssignableRole>(
    currentIsAssignable ? (member.role as AssignableRole) : "regular"
  );
  const [confirming, setConfirming] = useState(false);

  const unchanged = role === member.role;
  const downgrade = isDowngrade(member.role, role);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (unchanged) return;

    if (downgrade && !confirming) {
      setConfirming(true);
      return;
    }

    onSubmit(role);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-600">
        Changing the role for{" "}
        <span className="font-medium text-gray-900">{fullName(member)}</span> (
        {member.email}).
      </p>

      {!currentIsAssignable && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          This account is a{" "}
          <span className="font-medium">
            {ROLE_LABELS[member.role] ?? member.role}
          </span>
          . That role can&rsquo;t be set from here, so saving will move them onto
          the role you pick below.
        </p>
      )}

      <div>
        <label className="form-label" htmlFor="member-role">
          Role
        </label>
        <select
          id="member-role"
          className="form-input"
          value={role}
          onChange={(e) => {
            setRole(e.target.value as AssignableRole);
            // A fresh choice invalidates a pending confirmation, so the warning
            // can't be dismissed for one role and applied to another.
            setConfirming(false);
          }}
        >
          {ASSIGNABLE_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Super admin is assigned from the Admin Accounts page, not here.
        </p>
      </div>

      {downgrade && (
        <div
          className="flex gap-2.5 rounded-lg bg-amber-50 p-3 text-sm text-amber-900"
          role={confirming ? "alert" : undefined}
        >
          <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>
            This moves {fullName(member)} down from{" "}
            <span className="font-medium">{ROLE_LABELS[member.role]}</span> to{" "}
            <span className="font-medium">{ROLE_LABELS[role]}</span>, reducing
            what they can access.
            {confirming && " Press Save again to confirm."}
          </p>
        </div>
      )}

      {serverError && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {serverError}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting} disabled={unchanged}>
          {confirming ? "Confirm change" : "Save"}
        </Button>
      </div>
    </form>
  );
}
