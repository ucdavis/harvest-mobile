import { getCurrentTeamAuthInfo, TeamAuthInfo } from "@/lib/auth";
import { logger } from "@/lib/logger";

let onUnauthorized: (() => void | Promise<void>) | null = null;
export function registerOnUnauthorized(handler: () => void | Promise<void>) {
  onUnauthorized = handler;
}

/**
 * Ensures we have valid auth info, either from the provided parameter or local storage
 */
async function ensureAuthInfo(authInfo?: TeamAuthInfo): Promise<TeamAuthInfo> {
  if (!authInfo) {
    // try to get auth info from local storage
    authInfo = (await getCurrentTeamAuthInfo()) || undefined;

    // still no, throw an error
    if (!authInfo) throw new Error("No auth info");
  }

  return authInfo;
}

/**
 * Generic API fetch function that handles auth and common error handling
 */
export async function fetchFromApi<T>(
  endpoint: string,
  init: RequestInit = {},
  authInfo?: TeamAuthInfo
): Promise<T> {
  const validAuthInfo = await ensureAuthInfo(authInfo);

  const url = new URL(endpoint, validAuthInfo.apiBaseUrl);

  const { headers: initHeaders, ...restInit } = init; // peel off headers if any
  const headers = new Headers(initHeaders);

  // Only set JSON content type if caller didn't specify one (e.g., multipart/form-data).  default to JSON.
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // always set auth header
  headers.set("Authorization", `Bearer ${validAuthInfo.token}`);

  const res = await fetch(url, {
    ...restInit, // everything except headers
    headers,
  });

    if (!res.ok) {
    if (res.status === 401) {
      await onUnauthorized?.()
      alert("Session expired. Please log in again.");
    }
    const body = await res.text().catch(() => ""); // try to get body text, ignore errors

    const err = new Error(
      `Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`
    );

    logger.error("API fetch error", err, {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      body,
    });

    throw err;
  }

  return (await res.json()) as T;
}
