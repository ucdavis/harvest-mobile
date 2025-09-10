import { focusManager, onlineManager } from "@tanstack/react-query";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import * as Network from "expo-network";
import { useEffect } from "react";
import { AppState } from "react-native";
import { DAY_IN_MS, queryClient, reactQueryPersister } from "./queryClient";

export function QueryContext({ children }: { children: React.ReactNode }) {
  // Let query know about app focus (since it can't use window)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) =>
      focusManager.setFocused(state === "active")
    );
    return () => sub.remove();
  }, []);

  // Let query know about offline status
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

  // refetch stuff on focus
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        // TODO: call ensureQueryData on things
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: reactQueryPersister,
        maxAge: 21 * DAY_IN_MS,
        buster: "rqprovider:harvest:prod:v1",
      }}
      onSuccess={() => queryClient.resumePausedMutations()}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
