import { getCurrentTeamAuthInfo, TeamAuthInfo } from "@/lib/auth";

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
  authInfo?: TeamAuthInfo
): Promise<T> {
  const validAuthInfo = await ensureAuthInfo(authInfo);

  const res = await fetch(`${validAuthInfo.apiBaseUrl}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${validAuthInfo.token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`
    );
  }

  return (await res.json()) as T;
}
