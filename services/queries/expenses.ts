import { getDbOrThrow } from "@/lib/db/client";
import { Expense, QueuedExpense } from "@/lib/expense";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Insert expenses into the local database queue
async function insertExpensesToDb(
  expenses: Expense[]
): Promise<QueuedExpense[]> {
  const db = getDbOrThrow();
  const results: QueuedExpense[] = [];

  await db.withExclusiveTransactionAsync(async (tx) => {
    for (const expense of expenses) {
      const createdDate = new Date().toISOString();

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
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(uniqueId) DO NOTHING;`, // ignore if duplicate
        [
          expense.projectId,
          expense.rateId,
          expense.type,
          expense.description,
          expense.quantity,
          expense.price,
          expense.uniqueId,
          "pending",
          createdDate,
          0,
        ]
      );

      // Create the queued expense object with the generated ID
      const queuedExpense: QueuedExpense = {
        ...expense,
        id: result.lastInsertRowId,
        status: "pending" as const,
        createdDate,
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

  const result = await db.getAllAsync<QueuedExpense>(
    `SELECT * FROM expenses_queue WHERE status = 'pending' ORDER BY createdDate DESC`
  );

  return result;
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
