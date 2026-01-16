"use client";

import Link from "next/link";
import { Construction } from "lucide-react";

interface FeatureUnavailableProps {
  title?: string;
  description?: string;
  status?: "coming-soon" | "in-progress";
  showBackButton?: boolean;
}

export default function FeatureUnavailable({
  title = "Feature not available yet",
  description = "We’re actively working on this feature. Please check back soon.",
  status = "in-progress",
  showBackButton = true,
}: FeatureUnavailableProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Construction className="h-8 w-8 text-gray-600" />
        </div>

        <h1 className="mb-2 text-xl font-semibold text-gray-900">{title}</h1>

        <p className="mb-6 text-sm text-gray-600">{description}</p>

        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
            ${
              status === "coming-soon"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
            }
          `}
        >
          {status === "coming-soon" ? "Coming Soon" : "In Progress"}
        </span>

        {showBackButton && (
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-accent px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Go back home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
