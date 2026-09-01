"use client";

import { useBackendMutation } from "@/hooks/useBackend";

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/**
 * Change the signed-in user's password.
 *
 * Previously posted to `/auth/change-password`, which does not exist — the API
 * exposes `POST /users/me/password` — so the Security tab could never have
 * worked. Routed through the /api/backend proxy like every other dashboard
 * call, so the token stays server-side.
 *
 * Note the server revokes outstanding refresh tokens on success. The current
 * access token stays valid until it expires, so the user is not kicked out
 * mid-session, but other devices lose their ability to refresh.
 */
export function useChangePassword() {
  return useBackendMutation<ChangePasswordPayload, null>(
    "users/me/password",
    "POST"
  );
}
