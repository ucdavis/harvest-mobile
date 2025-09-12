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
          parseInt(expense.projectId), // Convert string to integer for projectId
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

  return result.map((row: any) => ({
    id: row.id,
    projectId: row.projectId.toString(), // Convert back to string for consistency
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

// Hook to get pending expenses
export function usePendingExpenses() {
  return useQuery({
    queryKey: ["expenses", "pending"],
    queryFn: getPendingExpensesFromDb,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
