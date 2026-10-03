"use server";

import { redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import { safeRedirectPath } from "@/lib/paths";
import { clearSession, saveSession } from "@/lib/session";
import { fieldErrors, loginSchema, registerSchema } from "@/lib/validation";

export interface AuthFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: { name?: string; email?: string };
}

function apiErrorState(error: unknown, values: AuthFormState["values"]): AuthFormState {
  if (!(error instanceof ApiError)) throw error;
  return {
    error: error.message,
    fieldErrors: error.details && Object.fromEntries(error.details.map((d) => [d.path, d.message])),
    values,
  };
}

export async function signIn(_previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const input = { email: String(formData.get("email") ?? ""), password: String(formData.get("password") ?? "") };
  const values = { email: input.email };

  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error), values };

  let token: string;
  try {
    ({ token } = await apiFetch<{ token: string }>("/api/auth/login", { method: "POST", body: parsed.data }));
  } catch (error) {
    return apiErrorState(error, values);
  }

  await saveSession(token);
  redirect(safeRedirectPath(formData.get("next")));
}

export async function signUp(_previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const input = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const values = { name: input.name, email: input.email };

  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error), values };

  let token: string;
  try {
    ({ token } = await apiFetch<{ token: string }>("/api/auth/register", { method: "POST", body: parsed.data }));
  } catch (error) {
    return apiErrorState(error, values);
  }

  await saveSession(token);
  redirect(safeRedirectPath(formData.get("next")));
}

export async function signOut(): Promise<void> {
  await clearSession();
  redirect("/");
}
