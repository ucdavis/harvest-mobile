import { Expense } from "@/lib/expense";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  removeExpense: (uniqueId: string) => void;
  clearExpenses: () => void;
  scannedRateId: string | null;
  setScannedRateId: (rateId: string | null) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [scannedRateId, setScannedRateId] = useState<string | null>(null);

  const addExpense = useCallback((expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
  }, []);

  const removeExpense = useCallback((uniqueId: string) => {
    setExpenses((prev) => prev.filter((e) => e.uniqueId !== uniqueId));
  }, []);

  const clearExpenses = useCallback(() => {
    setExpenses([]);
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        removeExpense,
        clearExpenses,
        scannedRateId,
        setScannedRateId,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
}
