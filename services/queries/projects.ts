import { queryClient } from "@/components/context/queryClient";
import { getDbOrThrow } from "@/lib/db/client";
import { Project } from "@/lib/project";
import { onlineManager, useQuery } from "@tanstack/react-query";

// we either get projects from the db (cache) or query from the API (and overwrite cache)
async function fetchProjectsFromDb() {
  const result = await getDbOrThrow().getAllAsync<Project>(
    "SELECT * FROM projects ORDER BY name ASC"
  );
  return result;
}

async function fetchProjectsFromApi() {
  // TODO: actually have an API and refactor
  const res = await fetch("http://harvest.caes.ucdavis.edu/api/projects");
  const projects = (await res.json()) as Project[];
  // update the local DB in a transaction
  await getDbOrThrow().withExclusiveTransactionAsync(async (tx) => {
    await tx.execAsync("DELETE FROM projects");
    for (const p of projects) {
      await tx.runAsync(
        "INSERT INTO projects (id, name, updatedAt) VALUES (?,?,?)",
        p.id,
        p.name,
        p.piName
      );
    }
  });
  return projects;
}

// now here's our actual hook to query projects
// react-query will take care of when to call our fn based on our caching rules
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      // if offline, return cached projects; if online, fetch from API
      const cached = await fetchProjectsFromDb();
      if (!onlineManager.isOnline()) {
        return cached;
      }
      const fresh = await fetchProjectsFromApi();
      return fresh;
    },
    initialData: () => queryClient.getQueryData(["projects"]) as Project[] | [],
    // we could overwrite cache/gc time here if we want to.  for now let's use the global settings
  });
}
