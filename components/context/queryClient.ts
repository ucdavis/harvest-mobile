import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import AsyncStorage from "expo-sqlite/kv-store";

// singletons so we don't recreate on re-render
export const queryClient =
  globalThis.__queryClient ??
  (globalThis.__queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 12 * 60 * 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
      },
    },
  }));

export const reactQueryPersister =
  globalThis.__rqPersister ??
  (globalThis.__rqPersister = createAsyncStoragePersister({
    storage: AsyncStorage,
    throttleTime: 3000,
  }));

declare global {
  // avoid TS complaints on global augmentation
  // (dev-only caching to survive Fast Refresh)

  var __queryClient: QueryClient | undefined;

  var __rqPersister: ReturnType<typeof createAsyncStoragePersister> | undefined;
}
