import "server-only";
import { unstable_rethrow } from "next/navigation";

const API_URL = (process.env.API_URL ?? "http://localhost:4000").replace(/\/+$/, "");

export interface ApiErrorDetail {
  path: string;
  message: string;
}

/** An error response from the Ecom API, with a message that is safe to show customers. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details?: ApiErrorDetail[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
}

/** Calls the Ecom API from the server. Responses are never cached: stock and orders change. */
export async function apiFetch<T>(path: string, { method = "GET", body, token }: ApiOptions = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch (error) {
    // Let Next.js handle its own signals (e.g. "render this page per request").
    unstable_rethrow(error);
    throw new ApiError(503, "The store is not reachable right now. Please try again in a moment.");
  }

  if (response.status === 204) return undefined as T;

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = (data as { error?: { message?: string; details?: unknown } } | null)?.error;
    throw new ApiError(
      response.status,
      error?.message ?? "Something went wrong. Please try again.",
      Array.isArray(error?.details) ? (error.details as ApiErrorDetail[]) : undefined,
    );
  }
  return data as T;
}
