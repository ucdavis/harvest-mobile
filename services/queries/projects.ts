import { HOUR_IN_MS } from "@/components/context/queryClient";
import { TeamAuthInfo } from "@/lib/auth";
import { Project } from "@/lib/project";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchFromApi } from "../api";

async function fetchProjectsFromApi(authInfo?: TeamAuthInfo) {
  return fetchFromApi<Project[]>("/api/mobile/projects", {}, authInfo);
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

// now for recent projects, we'll be more agressive in caching here since it's not at critical and more time sensitive
async function fetchRecentProjectsFromApi(authInfo?: TeamAuthInfo) {
  return fetchFromApi<Project[]>("/api/mobile/recentprojects", {}, authInfo);
}

export const recentProjectsApiQueryOptions = (authInfo?: TeamAuthInfo) =>
  queryOptions({
    queryKey: ["projects", authInfo?.team, "recent"] as const,
    queryFn: () => fetchRecentProjectsFromApi(authInfo),
    staleTime: 5 * HOUR_IN_MS,
    enabled: !!authInfo, // only run query if we have auth info
  });

export const useRecentProjects = (authInfo?: TeamAuthInfo) => {
  return useQuery(recentProjectsApiQueryOptions(authInfo));
};
