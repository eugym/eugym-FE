const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

/**
 * Build a full backend URL from a path segment.
 * Strips trailing slash from the base and leading slash from the path,
 * so NEXT_PUBLIC_API_URL can be set with or without a trailing slash.
 *
 * apiUrl("user/all")   → "https://host/api/v1/user/all"
 * apiUrl("/user/all")  → "https://host/api/v1/user/all"
 */
export function apiUrl(path: string): string {
  return `${base}/${path.replace(/^\/+/, "")}`;
}
