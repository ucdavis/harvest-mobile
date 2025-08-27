import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import AsyncStorage from "expo-sqlite/kv-store";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 12 * 60 * 60 * 1000, // get new data after 12 hours
      gcTime: 24 * 60 * 60 * 1000, // garbage cleanup after a day
    },
  },
});

const reactQueryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
});

export function QueryContext({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: reactQueryPersister }}
      onSuccess={() =>
        queryClient
          .resumePausedMutations()
          .then(() => queryClient.invalidateQueries())
      }
    >
      {children}
    </PersistQueryClientProvider>
  );
}
