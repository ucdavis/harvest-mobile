import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ChevronRightIcon,
  InformationCircleIcon,
  TrashIcon,
} from "react-native-heroicons/solid";

import { useExpenses } from "@/components/context/ExpenseContext";
import { queryClient } from "@/components/context/queryClient";
import {
  MUTATION_KEY_SYNC_EXPENSES,
  useSyncExpenseQueue,
} from "@/services/queries/expenseQueue";
import { useInsertExpenses } from "@/services/queries/expenses";

export default function AddExpenseScreen() {
  const { projectId, projectName } = useLocalSearchParams<{
    projectId: string;
    projectName: string;
    piName: string; // TODO: use piName?
  }>();

  const [description, setDescription] = useState("");

  const { expenses, removeExpense, clearExpenses } = useExpenses();
  const insertExpensesMutation = useInsertExpenses();
  const syncExpenseQueueMutation = useSyncExpenseQueue();

  // Clear expenses on mount (when navigating to a new project)
  useEffect(() => {
    clearExpenses();
  }, [clearExpenses]); // Include clearExpenses in dependencies

  const handleAddExpenses = () => {
    router.push({ pathname: "/rateSelect", params: { projectId } });
  };

  const handleDeleteExpense = (uniqueId: string) => {
    removeExpense(uniqueId);
  };

  const handleSubmit = () => {
    console.log("Submit expense", { description, expenses });
    insertExpensesMutation.mutate(expenses, {
      onSuccess: () => {
        // TODO: some kind of success message
        clearExpenses(); // clear local expenses

        // if we aren't already syncing, trigger a sync
        queryClient.isMutating({
          mutationKey: [MUTATION_KEY_SYNC_EXPENSES],
        }) === 0 && syncExpenseQueueMutation.mutate(); // trigger sync of expense queue
        router.back();
      },
      onError: (error) => {
        console.error("Failed to submit expenses:", error);
      },
    });
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="card">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-md uppercase font-bold text-harvest tracking-tight mb-1">
                Project
              </Text>
              <Text className="text-lg font-semibold text-primary-font">
                {projectId}: {projectName}
              </Text>
            </View>
            <InformationCircleIcon size={24} color="#a0a0a0" />
          </View>
        </View>

        <View className="card">
          <Text className="text-md uppercase font-bold text-harvest tracking-tight">
            Description
          </Text>
          <TextInput
            className="border mt-5 border-primary-border rounded-md p-3 text-base min-h-[60px] bg-gray-50"
            placeholder="Add expense description..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View className="card">
          <Text className="text-md uppercase font-bold text-harvest tracking-tight">
            Expenses
          </Text>
          <Text className="text-sm text-primary-font/80 mt-4">
            no current expenses, add them using the button below
          </Text>

          {expenses.map((item) => (
            <View
              key={item.uniqueId}
              className="flex-row items-end justify-between py-3 border-b border-primary-border"
            >
              <View className="flex-1">
                <Text className="tertiary-label uppercase">
                  {item.type}
                </Text>
                <Text className="text-lg text-primary-font font-medium">
                  {item.rate?.description}
                </Text>
              </View>

              <View className="flex-row items-center space-x-3">
                <Text className="text-base text-primary-font/80 font-semibold">
                  {item.quantity} {item.rate?.unit} @ ${item.price}
                </Text>

                <TouchableOpacity
                  className="ml-3"
                  onPress={() => handleDeleteExpense(item.uniqueId)}
                >
                  <TrashIcon size={16} color="#79242F" />
                </TouchableOpacity>
              </View>
            </View>
          ))}


          <TouchableOpacity
            className="flex-row bg-harvest rounded-md mt-5 justify-between py-2 px-4"
            onPress={handleAddExpenses}
          >
            <Text className="text-base text-white font-bold">Add expense</Text>
            <ChevronRightIcon size={24} color="white" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Submit Button */}
      <View className="p-4 mb-4 bg-white border-t border-primary-border">
        <TouchableOpacity className="harvest-button" onPress={handleSubmit}>
          <Text className="harvest-button-text">Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
