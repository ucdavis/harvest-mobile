import { HOUR_IN_MS } from "@/components/context/queryClient";
import { getCurrentTeamAuthInfo, TeamAuthInfo } from "@/lib/auth";
import { Rate } from "@/lib/expense";
import { queryOptions, useQuery } from "@tanstack/react-query";

async function fetchRatesFromApi(authInfo?: TeamAuthInfo) {
  if (!authInfo) {
    // try to get auth info from local storage
    authInfo = (await getCurrentTeamAuthInfo()) || undefined;

    // still no, throw an error
    if (!authInfo) throw new Error("No auth info");
  }

  const res = await fetch(`${authInfo.apiBaseUrl}/api/mobile/activerates`, {
    headers: {
      Authorization: `Bearer ${authInfo.token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch rates: ${res.status} ${res.statusText}`);
  }

  const rates = (await res.json()) as Rate[];

  return rates;
}

// uses api data and caches it
export const ratesApiQueryOptions = (authInfo?: TeamAuthInfo) =>
  queryOptions({
    queryKey: ["rates", authInfo?.team] as const,
    queryFn: () => fetchRatesFromApi(authInfo),
    staleTime: 12 * HOUR_IN_MS,
    enabled: !!authInfo, // only run query if we have auth info
  });

export const useRates = (authInfo?: TeamAuthInfo) => {
  return useQuery(ratesApiQueryOptions(authInfo));
};
