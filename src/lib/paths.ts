/** Returns `value` only if it is a path on this site, so redirects can never leave the store. */
export function safeRedirectPath(value: unknown, fallback = "/"): string {
  if (typeof value !== "string") return fallback;
  const isLocalPath = value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\");
  return isLocalPath ? value : fallback;
}
