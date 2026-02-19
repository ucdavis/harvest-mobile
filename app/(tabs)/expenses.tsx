import { useAuth } from "@/components/context/AuthContext";
import { RecentExpense } from "@/lib/expense";
import { useRecentExpenses } from "@/services/queries/expenses";
import { useQueryClient } from "@tanstack/react-query";
import { FlatList, RefreshControl, Text, View } from "react-native";

export default function ExpensesScreen() {
  const { authInfo } = useAuth();
  const queryClient = useQueryClient();
  const recentExpensesQuery = useRecentExpenses(authInfo);
  const queryKey = ["expenses", authInfo?.team, "recent"] as const;

  const handleRefresh = async () => {
    await queryClient.refetchQueries({ queryKey });
  };

  if (recentExpensesQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-base text-gray-700">Loading recent expenses...</Text>
      </View>
    );
  }

  if (recentExpensesQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-base text-red-600">
          Couldn&apos;t load recent expenses.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={recentExpensesQuery.data || []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        alwaysBounceVertical
        renderItem={({ item }: { item: RecentExpense }) => (
          <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
            <Text className="text-base font-semibold text-gray-900">
              {item.projectName}
            </Text>
            <Text className="mt-1 text-sm text-gray-600">{item.rateName}</Text>
            <Text className="mt-1 text-sm text-gray-600">Type: {item.type}</Text>
            <Text className="mt-1 text-sm text-gray-700">
              Total: ${item.total.toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <Text className="text-base text-gray-700">No recent expenses yet.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={recentExpensesQuery.isRefetching}
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
  );
}
