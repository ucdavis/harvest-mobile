import { useAuth } from "@/components/context/AuthContext";
import { queryClient } from "@/components/context/queryClient";
import {
  MUTATION_KEY_SYNC_EXPENSES,
  useSyncExpenseQueue,
} from "@/services/queries/expenseQueue";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

/**
 * AutoSyncManager - A component with no UI that automatically triggers
 * expense queue sync when the app comes to foreground or starts up.
 *
 * Placed in the root layout to ensure it's always active when the user is authenticated.
 */
export function AutoSyncManager() {
  const { isLoggedIn, isLoading } = useAuth();
  const appState = useRef(AppState.currentState);
  const syncExpenseQueueMutation = useSyncExpenseQueue();

  // Store the mutation in a ref to avoid dependency issues
  const syncMutationRef = useRef(syncExpenseQueueMutation);
  syncMutationRef.current = syncExpenseQueueMutation;

  useEffect(() => {
    if (!isLoggedIn) return;

    // Function to trigger sync if user is logged in and not already syncing
    const triggerSyncIfNeeded = () => {
      if (isLoggedIn && !isLoading) {
        // Check if we aren't already syncing
        const isSyncing =
          queryClient.isMutating({
            mutationKey: [MUTATION_KEY_SYNC_EXPENSES],
          }) > 0;

        if (!isSyncing) {
          syncMutationRef.current.mutate();
        }
      }
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Trigger sync when app becomes active from background
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        triggerSyncIfNeeded();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Trigger sync on initial mount if logged in (app startup)
    if (!isLoading) {
      triggerSyncIfNeeded();
    }

    return () => subscription?.remove();
  }, [isLoggedIn, isLoading]);

  // This component renders nothing
  return null;
}
