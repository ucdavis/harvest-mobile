import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import AsyncStorage from "expo-sqlite/kv-store";

export const DAY_IN_MS = 24 * 60 * 60 * 1000;
export const HOUR_IN_MS = 60 * 60 * 1000;

// singletons so we don't recreate on re-render
export const queryClient =
  globalThis.__queryClient ??
  (globalThis.__queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 12 * HOUR_IN_MS, // refetch after 12 hours
        gcTime: 21 * DAY_IN_MS, // data will stick around for 21 days offline
        refetchOnWindowFocus: true, // only if stale
        refetchOnReconnect: true, // only if stale
        refetchOnMount: true, // also only if stale
      },
    },
  }));

export const reactQueryPersister =
  globalThis.__rqPersister ??
  (globalThis.__rqPersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    throttleTime: 3000,
    key: "rq:harvest:prod:v1",
  }));

declare global {
  // avoid TS complaints on global augmentation
  // (dev-only caching to survive Fast Refresh)

  var __queryClient: QueryClient | undefined;

  var __rqPersister: ReturnType<typeof createAsyncStoragePersister> | undefined;
}
