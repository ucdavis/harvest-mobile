import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  FolderPlusIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "react-native-heroicons/outline";

import { ExpenseCard } from "@/components/ui/ExpenseCard";
import { Expense, ExpenseCardInfo } from "@/lib/expense";
import { XMarkIcon } from "react-native-heroicons/solid";


type ExpensesListProps = {
  expenses: ExpenseCardInfo[];
  queryKey: (string | undefined)[];
  onExpensePress: (expense: ExpenseCardInfo) => void;
  isLoading?: boolean;
  scrollEnabled?: boolean;
};

export function ExpensesList({
  expenses,
  queryKey,
  onExpensePress,
  isLoading = false,
}: ExpensesListProps) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries({
      queryKey,
    });
    setRefreshing(false);
  };

  const handleExpensePress = (expense: ExpenseCardInfo) => {
    onExpensePress(expense);
  };

  const renderExpenseCard = ({ item }: { item: ExpenseCardInfo }) => (
  <ExpenseCard
    projectName={item.projectName}
    rateName={item.rateName}
    type={item.type}
    uniqueId={item.uniqueId}
    onPress={() => handleExpensePress(item)}
  />
);


  return (
    <View className="flex-1">
      {/* Projects List Content */}
        <View className="px-4 flex-1">
          <FlatList
            data={expenses}
            renderItem={renderExpenseCard}
            keyExtractor={(item) => item.uniqueId} // keep internal key stable
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 88 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
    </View>
  );
}