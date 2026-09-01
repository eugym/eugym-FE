"use client";

import Link from "next/link";
import { Construction, Compass } from "lucide-react";

type Status = "coming-soon" | "in-progress" | "not-found";

interface FeatureUnavailableProps {
  title?: string;
  description?: string;
  status?: Status;
  showBackButton?: boolean;
  /** Where "back" goes. Defaults into the dashboard, not the marketing site. */
  backHref?: string;
  backLabel?: string;
}

const BADGE: Record<Status, { label: string; className: string } | null> = {
  "coming-soon": {
    label: "Coming Soon",
    className: "bg-blue-100 text-blue-800",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-amber-100 text-amber-900",
  },
  // A missing page isn't a roadmap item — labelling it "In Progress" would
  // promise work that isn't planned.
  "not-found": null,
};

export default function FeatureUnavailable({
  title = "Feature not available yet",
  description = "We're actively working on this feature. Please check back soon.",
  status = "in-progress",
  showBackButton = true,
  backHref = "/dashboard/stats",
  backLabel = "Back to dashboard",
}: FeatureUnavailableProps) {
  const badge = BADGE[status];
  const isMissing = status === "not-found";
  const Icon = isMissing ? Compass : Construction;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Icon className="h-8 w-8 text-gray-600" aria-hidden="true" />
        </div>

        <h1 className="mb-2 text-xl font-semibold text-gray-900">{title}</h1>

        {/* break-words so a long unmatched URL can't push the card sideways */}
        <p className="mb-6 text-sm text-gray-600 wrap-break-word">{description}</p>

        {badge && (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
        )}

        {showBackButton && (
          <div className={badge ? "mt-6" : "mt-2"}>
            <Link
              href={backHref}
              className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              {backLabel}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
