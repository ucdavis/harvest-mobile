import { HOUR_IN_MS } from "@/components/context/queryClient";
import { getCurrentTeamAuthInfo, TeamAuthInfo } from "@/lib/auth";
import { Project } from "@/lib/project";
import { queryOptions, useQuery } from "@tanstack/react-query";

async function fetchProjectsFromApi(authInfo?: TeamAuthInfo) {
  if (!authInfo) {
    // try to get auth info from local storage
    authInfo = (await getCurrentTeamAuthInfo()) || undefined;

    // still no, throw an error
    if (!authInfo) throw new Error("No auth info");
  }

  const res = await fetch(`${authInfo.apiBaseUrl}/api/mobile/projects`, {
    headers: {
      Authorization: `Bearer ${authInfo.token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch projects: ${res.status} ${res.statusText}`
    );
  }

  const projects = (await res.json()) as Project[];

  return projects;
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
