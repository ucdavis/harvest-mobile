import { HOUR_IN_MS } from "@/components/context/queryClient";
import { TeamAuthInfo } from "@/lib/auth";
import { UserInfo } from "@/lib/users";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchFromApi } from "../api";

async function fetchUserInfoFromApi(authInfo?: TeamAuthInfo) {
  return fetchFromApi<UserInfo>("/api/mobile/userinfo", {}, authInfo);
}

// uses api data and caches it
export const userInfoApiQueryOptions = (authInfo?: TeamAuthInfo) =>
  queryOptions({
    queryKey: ["userinfo", authInfo?.team] as const,
    queryFn: () => fetchUserInfoFromApi(authInfo),
    staleTime: 12 * HOUR_IN_MS,
    enabled: !!authInfo, // only run query if we have auth info
  });

export const useUserInfo = (authInfo?: TeamAuthInfo) => {
  return useQuery(userInfoApiQueryOptions(authInfo));
};
