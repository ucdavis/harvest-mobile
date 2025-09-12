import { getDbOrThrow } from "@/lib/db/client";
import { Expense, QueuedExpense } from "@/lib/expense";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Insert expenses into the local database queue
async function insertExpensesToDb(
  expenses: Expense[]
): Promise<QueuedExpense[]> {
  const db = getDbOrThrow();
  const results: QueuedExpense[] = [];

  await db.withExclusiveTransactionAsync(async (tx) => {
    for (const expense of expenses) {
      console.log("Inserting expense into DB:", expense);
      // Insert the expense into the queue
      const result = await tx.runAsync(
        `INSERT INTO expenses_queue (
          projectId, 
          rateId,
          type, 
          description, 
          quantity, 
          price, 
          uniqueId,
          status,
          createdDate,
          syncAttempts
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          expense.projectId,
          expense.rateId,
          expense.type,
          expense.description,
          expense.quantity,
          expense.price,
          expense.uniqueId,
          "pending",
          new Date().toISOString(),
          0,
        ]
      );

      console.log("Inserted expense with ID:", result);

      // Create the queued expense object with the generated ID
      const queuedExpense: QueuedExpense = {
        ...expense,
        id: result.lastInsertRowId,
        status: "pending" as const,
        createdDate: new Date().toISOString(),
        syncAttempts: 0,
      };

      results.push(queuedExpense);
    }
  });

  return results;
}

// React Query mutation hook for inserting expenses
export function useInsertExpenses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: insertExpensesToDb,
    onSuccess: (data) => {
      // Invalidate and refetch any expense-related queries
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error) => {
      console.error("Failed to insert expenses:", error);
    },
  });
}

// Query function to get pending expenses from the queue
async function getPendingExpensesFromDb(): Promise<QueuedExpense[]> {
  const db = getDbOrThrow();

  const result = await db.getAllAsync(
    `SELECT * FROM expenses_queue WHERE status = 'pending' ORDER BY createdDate DESC`
  );

  console.log("Fetched pending expenses from DB:", result);

  return result.map((row: any) => ({
    id: row.id,
    projectId: row.projectId ? row.projectId.toString() : null, // Safely convert to string if not null
    rateId: row.rateId,
    type: row.type,
    description: row.description,
    quantity: row.quantity,
    price: row.price,
    uniqueId: row.uniqueId,
    status: row.status as QueuedExpense["status"],
    createdDate: row.createdDate,
    syncAttempts: row.syncAttempts,
    lastSyncAttempt: row.lastSyncAttempt,
    errorMessage: row.errorMessage,
  }));
}

// Hook to get pending expenses with auto-sync functionality
export function usePendingExpenses() {
  return useQuery({
    queryKey: ["expenses", "pending"],
    queryFn: getPendingExpensesFromDb,
    staleTime: 30 * 1000, // 30 seconds - shorter stale time for more responsive sync
    refetchOnWindowFocus: true, // Trigger sync when app becomes active
    refetchOnReconnect: true, // Trigger sync when network returns
    refetchOnMount: true, // Trigger sync on component mount
  });
}

// Hook that combines pending expenses query with auto-sync functionality
export function usePendingExpensesWithAutoSync() {
  const pendingExpensesQuery = usePendingExpenses();
  // const syncMutation = useSyncExpenseQueue(); // TODO: Uncomment when expenseQueue.ts is imported

  // Auto-sync effect
  useEffect(() => {
    const data = pendingExpensesQuery.data;
    if (data && data.length > 0) {
      const pendingCount = data.filter((e) => e.status === "pending").length;

      if (pendingCount > 0) {
        console.log(
          `Found ${pendingCount} pending expenses - sync would be triggered here`
        );

        // TODO: Uncomment when sync mutation is available:
        // if (!syncMutation.isPending) {
        //   console.log(`Triggering auto-sync for ${pendingCount} pending expenses`);
        //   syncMutation.mutate();
        // }
      }
    }
  }, [pendingExpensesQuery.data]); // Re-run when data changes

  return pendingExpensesQuery;
}

// Clear all expenses from the queue
async function clearExpenseQueue(): Promise<void> {
  const db = getDbOrThrow();

  await db.withExclusiveTransactionAsync(async (tx) => {
    console.log("Clearing all expenses from queue");
    await tx.runAsync(`DELETE FROM expenses_queue`);
    console.log("Expense queue cleared successfully");
  });
}

// Only for development/testing purposes
export function useClearExpenseQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearExpenseQueue,
    onSuccess: () => {
      // Invalidate and refetch expense-related queries
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error) => {
      console.error("Failed to clear expense queue:", error);
    },
  });
}
