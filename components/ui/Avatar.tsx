"use client";

/**
 * Initials avatar.
 *
 * Replaces the photographic avatars, which were never real: the dashboard
 * header rendered a bundled stock photo of a trainer for *every* signed-in
 * user, and the dropdown's fallback pointed at
 * `/images/avatar-placeholder.png`, a file that does not exist in `public/`.
 * Initials are always correct, need no request, and cannot 404.
 *
 * Deliberately one neutral colour rather than a per-user hue: DESIGN.md
 * reserves colour for tier identity (Regular/Standard/Premium), and a random
 * avatar colour would compete with a system where colour means something.
 */

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-24 w-24 text-2xl",
} as const;

export function initialsFrom(firstName?: string, lastName?: string): string {
  const a = firstName?.trim()?.[0] ?? "";
  const b = lastName?.trim()?.[0] ?? "";
  return (a + b).toUpperCase() || "U";
}

/** Split a display name into initials — for call sites that only hold one string. */
export function initialsFromName(fullName?: string): string {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  return initialsFrom(parts[0], parts[parts.length - 1]);
}

interface AvatarProps {
  initials: string;
  size?: keyof typeof SIZES;
  className?: string;
}

export default function Avatar({
  initials,
  size = "md",
  className = "",
}: AvatarProps) {
  return (
    <span
      // aria-hidden: the user's name is always rendered next to this, so
      // announcing the initials too would just repeat it.
      aria-hidden="true"
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full bg-(--plate-iron) font-semibold tracking-tight text-white ${SIZES[size]} ${className}`}
    >
      {initials}
    </span>
  );
}
