"use client";

import { ReactNode } from "react";
import {
  ROLE_LABELS,
  formatDate,
  fullName,
  type Member,
} from "./types";

/**
 * Read-only view of one member (UC-A1).
 *
 * The subscription block comes free with GET /admin/members — the endpoint
 * LATERAL-joins the member's active subscription and the page used to throw it
 * away, sending an admin to a second screen to answer "are they paid up?".
 */
export default function UserDetails({ member }: { member: Member }) {
  return (
    <div className="space-y-6">
      <section>
        <SectionTitle>Personal</SectionTitle>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <Field label="Full name">{fullName(member)}</Field>
          <Field label="Email">
            <span className="break-all">{member.email}</span>
          </Field>
          <Field label="Phone">{member.phone || "—"}</Field>
          <Field label="Joined">{formatDate(member.createdAt)}</Field>
        </dl>
      </section>

      <section>
        <SectionTitle>Account</SectionTitle>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <Field label="Role">
            {ROLE_LABELS[member.role] ?? member.role}
          </Field>
          <Field label="Status">
            <Pill tone={member.isActive ? "green" : "red"}>
              {member.isActive ? "Active" : "Inactive"}
            </Pill>
          </Field>
          <Field label="Email verified">
            <Pill tone={member.isEmailVerified ? "green" : "amber"}>
              {member.isEmailVerified ? "Verified" : "Unverified"}
            </Pill>
          </Field>
          <Field label="Two-factor">
            {member.is2FAEnabled ? "Enabled" : "Not enabled"}
          </Field>
          <Field label="Last sign-in">{formatDate(member.lastLoginAt)}</Field>
          <Field label="Assigned trainer">
            {member.trainerId ? "Assigned" : "None"}
          </Field>
        </dl>
      </section>

      <section>
        <SectionTitle>Subscription</SectionTitle>
        {member.subscription ? (
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            <Field label="Plan">
              <span className="capitalize">{member.subscription.tier}</span>
            </Field>
            <Field label="Status">
              <span className="capitalize">{member.subscription.status}</span>
            </Field>
            <Field label="Renews / expires">
              {formatDate(member.subscription.endDate)}
            </Field>
          </dl>
        ) : (
          <p className="text-sm text-gray-500">
            No active subscription — this member is on the free tier.
          </p>
        )}
      </section>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </h3>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-900">{children}</dd>
    </div>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: "green" | "red" | "amber";
  children: ReactNode;
}) {
  const tones = {
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
