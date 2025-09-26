import { HOUR_IN_MS } from "@/components/context/queryClient";
import { TeamAuthInfo } from "@/lib/auth";
import { Rate } from "@/lib/expense";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchFromApi } from "../api";
import { logger } from "@/lib/logger";


async function fetchRatesFromApi(authInfo?: TeamAuthInfo) {
  return fetchFromApi<Rate[]>("/api/mobile/activerates", {}, authInfo);
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

async function fetchRecentRatesFromApi(authInfo?: TeamAuthInfo) {
  return fetchFromApi<Rate[]>("/api/mobile/recentrates", {}, authInfo);
}

export const recentRatesApiQueryOptions = (authInfo?: TeamAuthInfo) =>
  queryOptions({
    queryKey: ["rates", authInfo?.team, "recent"] as const,
    queryFn: () => fetchRecentRatesFromApi(authInfo),
    staleTime: 5 * HOUR_IN_MS,
    enabled: !!authInfo, // only run query if we have auth info
  });

export const useRecentRates = (authInfo?: TeamAuthInfo) => {
  return useQuery(recentRatesApiQueryOptions(authInfo));
};