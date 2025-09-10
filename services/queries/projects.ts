import { HOUR_IN_MS } from "@/components/context/queryClient";
import { fakeProjects, Project } from "@/lib/project";
import { queryOptions, useQuery } from "@tanstack/react-query";

async function fetchFakeProjectsFromApi() {
  // we'll just fake a few for now
  // TODO: remove this!
  const projects = [...fakeProjects];

  return projects;
}

async function fetchProjectsFromApi() {
  // TODO: actually have an API and refactor
  const res = await fetch("http://harvest.caes.ucdavis.edu/api/projects");
  const projects = (await res.json()) as Project[];

  return projects;
}

// uses api data and caches it
export const projectsApiQueryOptions = () =>
  queryOptions({
    queryKey: ["projects"] as const,
    queryFn: fetchFakeProjectsFromApi,
    staleTime: 12 * HOUR_IN_MS,
  });

export const useProjects = () => {
  return useQuery(projectsApiQueryOptions());
};
