import "server-only";
import { cookies } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { cache } from "react";
import { ApiError, apiFetch } from "./api";
import type { User } from "./types";

const SESSION_COOKIE = "session";
const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export interface Session {
  user: User;
  token: string;
}

/** Stores the API token in an httpOnly cookie, out of reach of client-side scripts. */
export async function saveSession(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_WEEK_IN_SECONDS,
  });
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/** The signed-in customer for this request, or null. Cached so every component shares one lookup. */
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { user } = await apiFetch<{ user: User }>("/api/auth/me", { token });
    return { user, token };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 404)) return null;
    throw error;
  }
});

/** Like getSession, but treats an unreachable API as "signed out" instead of failing the page. */
export async function getOptionalSession(): Promise<Session | null> {
  try {
    return await getSession();
  } catch (error) {
    unstable_rethrow(error);
    return null;
  }
}
