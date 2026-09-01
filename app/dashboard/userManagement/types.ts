/**
 * Shapes for User Management (§3.6, UC-A1 "Manage User Accounts",
 * UC-A2 "Assign/Change User Roles").
 *
 * GET /admin/members runs rows through mapUser, so these are camelCase —
 * unlike /admin/merchandise, which returns raw snake_case.
 */

/** Every role a row can display. */
export const ALL_ROLES = [
  "visitor",
  "regular",
  "standard",
  "premium",
  "trainer",
  "corporate_admin",
  "affiliate_partner",
  "admin",
  "super_admin",
] as const;

export type MemberRole = (typeof ALL_ROLES)[number];

/**
 * Roles PATCH /admin/members/:id will accept.
 *
 * Deliberately narrower than ALL_ROLES: the endpoint's zod enum rejects
 * `super_admin` and `visitor`. Promotion to super admin goes through
 * POST /admin/super/admins, which lives on the Admin Accounts page.
 */
export const ASSIGNABLE_ROLES = [
  "regular",
  "standard",
  "premium",
  "trainer",
  "corporate_admin",
  "affiliate_partner",
  "admin",
] as const;

export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export const ROLE_LABELS: Record<MemberRole, string> = {
  visitor: "Visitor",
  regular: "Regular",
  standard: "Standard",
  premium: "Premium",
  trainer: "Trainer",
  corporate_admin: "Corporate admin",
  affiliate_partner: "Affiliate partner",
  admin: "Admin",
  super_admin: "Super admin",
};

/**
 * The membership ladder, for spotting a downgrade.
 *
 * Staff roles aren't on it — moving someone from trainer to admin is a
 * reassignment, not a demotion, so it shouldn't trigger a confirmation.
 */
const TIER_RANK: Partial<Record<MemberRole, number>> = {
  visitor: 0,
  regular: 1,
  standard: 2,
  premium: 3,
};

export function isDowngrade(from: MemberRole, to: MemberRole): boolean {
  const a = TIER_RANK[from];
  const b = TIER_RANK[to];
  return a !== undefined && b !== undefined && b < a;
}

export interface MemberSubscription {
  tier: string;
  status: string;
  endDate: string | null;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: MemberRole;
  avatar: string | null;
  centreId: string | null;
  trainerId: string | null;
  corporateId: string | null;
  isEmailVerified: boolean;
  is2FAEnabled: boolean;
  isActive: boolean;
  /** Created by an admin and not yet activated — exists with no password set. */
  isPending: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  subscription: MemberSubscription | null;
}

export const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "All", value: "all" },
] as const;

export function fullName(m: Member): string {
  return `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || "—";
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}
