import { focusManager, onlineManager } from "@tanstack/react-query";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import * as Network from "expo-network";
import { useEffect } from "react";
import { AppState } from "react-native";
import { queryClient, reactQueryPersister } from "./queryClient";

export function QueryContext({ children }: { children: React.ReactNode }) {
  // Let query know about app focus (since it can't use window)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      focusManager.setFocused(state === "active");
    });
    return () => sub.remove();
  }, []);

  // Online/Offline wiring
  useEffect(() => {
    Network.getNetworkStateAsync().then((s) => {
      onlineManager.setOnline(!!(s.isConnected && s.isInternetReachable));
    });
    const sub = Network.addNetworkStateListener(
      ({ isConnected, isInternetReachable }) => {
        onlineManager.setOnline(!!(isConnected && isInternetReachable));
      }
    );
    return () => sub.remove();
  }, []);

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
