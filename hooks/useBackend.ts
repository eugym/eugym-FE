"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { parseAuthError } from "@/app/api/lib/authError";

/**
 * Data access for dashboard pages, over the /api/backend/* proxy.
 *
 * Every backend response is wrapped as { success, data, message }, and some
 * endpoints nest a second time ({ data: { data: [...] } }) for paginated lists.
 * `unwrap` handles both so pages work with plain arrays and objects instead of
 * re-deriving the envelope shape — the guesswork that produced the
 * `data?.data?.allUser?.users ?? data?.data?.users ?? data?.users ?? data?.data`
 * chain in User Management.
 */

function unwrap<T>(body: unknown): T {
  if (!body || typeof body !== "object") return body as T;

  const outer = (body as Record<string, unknown>).data;
  if (outer === undefined) return body as T;

  // Paginated: { data: { data: [...], total, page } }
  if (outer && typeof outer === "object" && !Array.isArray(outer)) {
    const inner = (outer as Record<string, unknown>).data;
    if (Array.isArray(inner)) return inner as T;
  }

  return outer as T;
}

async function call(path: string, init?: RequestInit) {
  const res = await fetch(`/api/backend/${path.replace(/^\/+/, "")}`, {
    cache: "no-store",
    ...init,
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) throw body ?? { message: `Request failed (${res.status})` };
  return body;
}

/** GET a backend path. `path` doubles as the cache key, so it must be stable. */
export function useBackendQuery<T = unknown>(
  path: string,
  options?: Omit<UseQueryOptions<T, unknown, T, string[]>, "queryKey" | "queryFn">
) {
  return useQuery<T, unknown, T, string[]>({
    queryKey: ["backend", path],
    queryFn: async () => unwrap<T>(await call(path)),
    retry: 1,
    ...options,
  });
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * GET a paginated backend path, keeping the envelope.
 *
 * `unwrap` deliberately reduces { data: { data: [...], total } } to the array,
 * which is what most pages want — but it also discards `total`, leaving a page
 * unable to tell how many records exist beyond the one it was handed. A list
 * that paginates client-side over a single server page looks correct until the
 * data outgrows the first page, then silently hides the rest.
 */
export function useBackendPagedQuery<T = unknown>(
  path: string,
  options?: Omit<
    UseQueryOptions<PagedResult<T>, unknown, PagedResult<T>, string[]>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<PagedResult<T>, unknown, PagedResult<T>, string[]>({
    queryKey: ["backend", path],
    queryFn: async () => {
      const body = await call(path);
      const envelope = (body?.data ?? {}) as Record<string, unknown>;
      const items = Array.isArray(envelope.data)
        ? (envelope.data as T[])
        : Array.isArray(body?.data)
          ? (body.data as T[])
          : [];

      return {
        items,
        // Fall back to the row count so a non-paginated endpoint still yields a
        // coherent single page rather than reporting zero records.
        total: Number(envelope.total ?? items.length),
        page: Number(envelope.page ?? 1),
        limit: Number(envelope.limit ?? items.length),
        totalPages: Number(envelope.totalPages ?? 1),
      };
    },
    retry: 1,
    ...options,
  });
}

/**
 * Write to a backend path. Invalidates `invalidate` paths on success so lists
 * refresh without the page hand-rolling refetch calls.
 */
export function useBackendMutation<TBody = unknown, TResult = unknown>(
  path: string | ((body: TBody) => string),
  method: "POST" | "PATCH" | "PUT" | "DELETE" = "POST",
  invalidate: string[] = []
) {
  const queryClient = useQueryClient();

  return useMutation<TResult, unknown, TBody>({
    mutationFn: async (body: TBody) => {
      const target = typeof path === "function" ? path(body) : path;
      const result = await call(target, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "DELETE" ? undefined : JSON.stringify(body),
      });
      return unwrap<TResult>(result);
    },
    onSuccess: () => {
      invalidate.forEach((p) =>
        queryClient.invalidateQueries({ queryKey: ["backend", p] })
      );
    },
  });
}

/** Turn any thrown value into a message safe to render. */
export function errorMessage(err: unknown): string {
  return parseAuthError(err).message;
}
