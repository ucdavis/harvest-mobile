import * as Crypto from "expo-crypto";

export type Rate = {
  id: string;
  type: string; // labor, equipment, or other
  description: string; // what the rate is for, like "Tractor X"
  unit: string; // e.g. hours, days
  price: number;
};

export type Expense = {
  type: string;
  description: string; // for other
  price: number; // rate amount, immutable
  quantity: number;
  projectId: string;
  rateId: string; // ties to specific rates
  rate?: Rate; // optional reference to the rate details
  uniqueId: string; // for tracking and sync
};

export function getExpenseUniqueId(): string {
  // Generate a UUID v4 using expo-crypto
  return Crypto.randomUUID();
}

export function createExpenseWithUniqueId(
  expense: Omit<Expense, "uniqueId">
): Expense {
  return {
    ...expense,
    uniqueId: getExpenseUniqueId(),
  };
}

// Fake rates for testing/demonstration
export const fakeRates: Rate[] = [
  {
    id: "rate-001",
    type: "labor",
    description: "Senior Laborer",
    unit: "hours",
    price: 125.0,
  },
  {
    id: "rate-002",
    type: "equipment",
    description: "John Deere 6120M Tractor",
    unit: "hours",
    price: 85.5,
  },
  {
    id: "rate-003",
    type: "labor",
    description: "Field Technician",
    unit: "hours",
    price: 45.0,
  },
  {
    id: "rate-004",
    type: "equipment",
    description: "Kubota Excavator U35-4",
    unit: "days",
    price: 350.0,
  },
  {
    id: "rate-005",
    type: "other",
    description: "Materials and Supplies",
    unit: "per item",
    price: 25.75,
  },
];
