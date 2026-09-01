"use client";

import { ReactNode } from "react";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";

/**
 * The frame every data-backed dashboard page sits in.
 *
 * Loading, failure, and empty are the three states a page spends most of its
 * real life in, and they are the three most often skipped. Putting them here
 * means a new page gets all three by construction instead of rendering a blank
 * screen while it waits and a blank screen when it fails.
 */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <span className="sr-only">{label}</span>
      {/* Skeleton rows rather than a spinner: the page keeps its shape, so
          content arriving doesn't shift everything the user was looking at. */}
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-100" />
            <div className="h-3 flex-1 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-20 shrink-0 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
    >
      <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-600" aria-hidden="true" />
      <p className="text-sm font-medium text-red-900">Couldn&rsquo;t load this page</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-red-800 wrap-break-word">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-50"
        >
          <RefreshCw size={15} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
        {icon ?? <Inbox size={26} aria-hidden="true" />}
      </div>
      <p className="text-sm font-medium text-gray-900">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/**
 * Renders the right state for a query. Keeps pages free of the
 * `if (isLoading) … if (error) … if (!data.length) …` ladder.
 */
export function DataState<T>({
  isLoading,
  error,
  data,
  onRetry,
  empty,
  children,
}: {
  isLoading: boolean;
  error?: unknown;
  data: T[] | undefined;
  onRetry?: () => void;
  empty: ReactNode;
  children: (rows: T[]) => ReactNode;
}) {
  if (isLoading) return <LoadingState />;

  if (error) {
    const message =
      (error as { message?: string })?.message ??
      "Something went wrong. Please try again.";
    return <ErrorState message={message} onRetry={onRetry} />;
  }

  if (!data || data.length === 0) return <>{empty}</>;

  return <>{children(data)}</>;
}
