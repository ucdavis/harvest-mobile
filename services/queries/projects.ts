import { HOUR_IN_MS } from "@/components/context/queryClient";
import { TeamAuthInfo } from "@/lib/auth";
import { Project } from "@/lib/project";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchFromApi } from "../api";

async function fetchProjectsFromApi(authInfo?: TeamAuthInfo) {
  return fetchFromApi<Project[]>("/api/mobile/projects", authInfo);
}

// uses api data and caches it
export const projectsApiQueryOptions = (authInfo?: TeamAuthInfo) =>
  queryOptions({
    queryKey: ["projects", authInfo?.team] as const,
    queryFn: () => fetchProjectsFromApi(authInfo),
    staleTime: 12 * HOUR_IN_MS,
    enabled: !!authInfo, // only run query if we have auth info
  });

export const useProjects = (authInfo?: TeamAuthInfo) => {
  return useQuery(projectsApiQueryOptions(authInfo));
};
