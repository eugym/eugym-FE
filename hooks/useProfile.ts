"use client";

import { useBackendQuery, useBackendMutation } from "@/hooks/useBackend";

/**
 * The signed-in user's own record.
 *
 * These hooks previously called `GET /user/profile` and `PUT /profile`. Neither
 * route exists — the API exposes `GET /users/me` and `PATCH /users/me` — so the
 * Personal Info tab never loaded a value and never saved one. Routed through
 * the same /api/backend proxy every other dashboard page uses, so the token
 * stays server-side and the response envelope is unwrapped once.
 */

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string | null;
  isEmailVerified: boolean;
  is2FAEnabled: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Only these three are writable — see the zod schema on PATCH /users/me. */
export interface ProfileUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const PROFILE_PATH = "users/me";

export const useProfile = () => useBackendQuery<Profile>(PROFILE_PATH);

export const useUpdateProfile = () =>
  useBackendMutation<ProfileUpdate, Profile>(PROFILE_PATH, "PATCH", [
    PROFILE_PATH,
  ]);
