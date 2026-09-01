/**
 * One place that turns anything thrown by an auth request into something the UI
 * can render.
 *
 * Auth calls in this app fail in four different shapes, and every call site used
 * to guess at one of them:
 *
 *   1. The backend envelope — { success, message, code, errors? }, thrown as a
 *      plain object by the `throw data` in hooks/useAuth.ts and hooks/useLogin.tsx.
 *   2. An Axios error — the real payload buried at err.response.data.
 *   3. A thrown Error — bugs, JSON parse failures.
 *   4. A rejected fetch — the API is unreachable, and there is no payload at all.
 *
 * Guessing wrong is what made registration fail silently: the page guarded on
 * `axios.isAxiosError(err)`, the hook threw shape 1, and so no branch ran and no
 * message was ever shown. Route every catch through this function instead.
 */

export interface AuthError {
  /** Headline, safe to show verbatim. Never empty. */
  message: string;
  /** Field name → first message for that field. Empty when not a validation error. */
  fieldErrors: Record<string, string>;
  /** Backend code (BAD_REQUEST, CONFLICT, UNAUTHORIZED…) when one was supplied. */
  code?: string;
}

const FALLBACK = "Something went wrong. Please try again.";
const OFFLINE = "Can't reach the server. Check your connection and try again.";

/** Backend sends { errors: { email: ["..."], password: ["...", "..."] } }. */
function toFieldErrors(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};

  const out: Record<string, string> = {};
  for (const [field, messages] of Object.entries(raw as Record<string, unknown>)) {
    const first = Array.isArray(messages) ? messages[0] : messages;
    if (typeof first === "string" && first.trim()) out[field] = first;
  }
  return out;
}

/** Unwrap whichever layer actually holds the backend envelope. */
function unwrap(err: unknown): Record<string, unknown> | null {
  if (!err || typeof err !== "object") return null;

  const e = err as Record<string, unknown>;

  // Axios: the server's body lives at err.response.data
  const response = e.response as Record<string, unknown> | undefined;
  if (response && typeof response === "object" && response.data) {
    return response.data as Record<string, unknown>;
  }

  return e;
}

export function parseAuthError(err: unknown): AuthError {
  // A rejected fetch means the request never reached the server — a generic
  // "something went wrong" would send the user hunting for a typo that isn't there.
  if (err instanceof TypeError) {
    return { message: OFFLINE, fieldErrors: {} };
  }

  const body = unwrap(err);
  if (!body) {
    return {
      message: typeof err === "string" && err.trim() ? err : FALLBACK,
      fieldErrors: {},
    };
  }

  const fieldErrors = toFieldErrors(body.errors);

  // Prefer the backend's own message; it is written for users.
  let message =
    (typeof body.message === "string" && body.message.trim() && body.message) ||
    // Some older routes nest it as { error: { message } }
    (typeof (body.error as Record<string, unknown>)?.message === "string" &&
      ((body.error as Record<string, unknown>).message as string)) ||
    "";

  // "Validation failed" is true but useless on its own. When we know which fields
  // failed, name them — the inline messages carry the detail.
  if ((!message || message === "Validation failed") && Object.keys(fieldErrors).length) {
    const fields = Object.keys(fieldErrors).map(humanise);
    message =
      fields.length === 1
        ? `Check the ${fields[0]} field`
        : `Check these fields: ${fields.join(", ")}`;
  }

  if (!message && err instanceof Error && err.message.trim()) message = err.message;

  return {
    message: message || FALLBACK,
    fieldErrors,
    code: typeof body.code === "string" ? body.code : undefined,
  };
}

/** firstName → "first name", so generated copy reads like prose. */
function humanise(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
}
