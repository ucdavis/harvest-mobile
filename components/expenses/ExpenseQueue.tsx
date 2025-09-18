import { QueuedExpense } from "@/lib/expense";
import {
  useClearExpenseQueue,
  usePendingExpenses,
} from "@/services/queries/expenses";
import React from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ExpenseQueueProps {
  className?: string;
}

export default function ExpenseQueue({ className }: ExpenseQueueProps) {
  const { data: expenses = [], isRefetching, refetch } = usePendingExpenses();

  const clearExpenseQueueMutation = useClearExpenseQueue();

  const getStatusColor = (status: QueuedExpense["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "syncing":
        return "text-blue-600";
      case "synced":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleClearQueue = () => {
    if (expenses.length === 0) return;

    Alert.alert(
      "Clear Expense Queue",
      `Are you sure you want to clear all ${expenses.length} expenses from the queue? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            clearExpenseQueueMutation.mutate();
          },
        },
      ]
    );
  };

  return (
    <View
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className || ""}`}
    >
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-lg font-semibold text-gray-900">
            Expense Queue ({expenses.length})
          </Text>
          {expenses.length > 0 && (
            <TouchableOpacity
              onPress={handleClearQueue}
              className="bg-red-500 px-3 py-1 rounded-md"
              disabled={clearExpenseQueueMutation.isPending}
            >
              <Text className="text-white text-sm font-medium">
                {clearExpenseQueueMutation.isPending
                  ? "Clearing..."
                  : "Clear All"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text className="text-sm text-gray-600">
          Showing expense sync status
        </Text>
      </View>

      <ScrollView
        className="max-h-96"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
      >
        {expenses.length === 0 ? (
          <View className="p-4">
            <Text className="text-gray-500 text-center">
              No expenses in queue
            </Text>
          </View>
        ) : (
          expenses.map((expense) => (
            <View
              key={expense.id || expense.uniqueId}
              className="p-4 border-b border-gray-100 last:border-b-0"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="font-medium text-gray-900 flex-1">
                  {expense.description}
                </Text>
                <Text
                  className={`font-semibold ${getStatusColor(expense.status)}`}
                >
                  {expense.status.toUpperCase()}
                </Text>
              </View>

              <View className="space-y-1">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Type:</Text>
                  <Text className="text-sm text-gray-900">{expense.type}</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Price:</Text>
                  <Text className="text-sm text-gray-900">
                    {formatPrice(expense.price)}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Quantity:</Text>
                  <Text className="text-sm text-gray-900">
                    {expense.quantity}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Total:</Text>
                  <Text className="text-sm font-medium text-gray-900">
                    {formatPrice(expense.price * expense.quantity)}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Project ID:</Text>
                  <Text className="text-sm text-gray-900">
                    {expense.projectId}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Rate ID:</Text>
                  <Text className="text-sm text-gray-900">
                    {expense.rateId}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Created:</Text>
                  <Text className="text-sm text-gray-900">
                    {formatDate(expense.createdDate)}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">Sync Attempts:</Text>
                  <Text className="text-sm text-gray-900">
                    {expense.syncAttempts}
                  </Text>
                </View>

                {expense.lastSyncAttempt && (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">Last Sync:</Text>
                    <Text className="text-sm text-gray-900">
                      {formatDate(expense.lastSyncAttempt)}
                    </Text>
                  </View>
                )}

                {expense.errorMessage && (
                  <View className="mt-2">
                    <Text className="text-sm text-gray-600">Error:</Text>
                    <Text className="text-sm text-red-600 mt-1">
                      {expense.errorMessage}
                    </Text>
                  </View>
                )}

                <View className="mt-2 pt-2 border-t border-gray-100">
                  <Text className="text-xs text-gray-500">
                    ID: {expense.uniqueId}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
