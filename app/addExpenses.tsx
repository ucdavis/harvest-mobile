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

import { Expense, createExpenseWithUniqueId } from "@/lib/expense";

export default function AddExpenseScreen() {
  const { projectId, projectName, newExpense } = useLocalSearchParams<{
    projectId: string;
    projectName: string;
    piName: string;
    newExpense?: string;
  }>();

  const [description, setDescription] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([
    createExpenseWithUniqueId({
      // TODO: testing
      type: "labor",
      description: "",
      price: 100,
      quantity: 1,
      projectId: projectId,
      rateId: "rate_1",
      rate: {
        unit: "hours",
        description: "RR Farm Labor",
        price: 100,
        type: "equipment",
        id: "rate_1",
        isPassthrough: false,
      },
    }),
  ]);

  useEffect(() => {
    if (newExpense) {
      try {
        const parsedExpense: Expense = JSON.parse(newExpense);
        setExpenses((prev) => [...prev, parsedExpense]);
        router.setParams({ newExpense: undefined });
      } catch (error) {
        console.error("Failed to parse new expense:", error);
      }
    }
  }, [newExpense]);

  const handleAddExpenses = () => {
    router.push({ pathname: "/rateSelect", params: { projectId } });
  };

  const handleDeleteExpense = (uniqueId: string) => {
    setExpenses((prev) => prev.filter((e) => e.uniqueId !== uniqueId));
  };

  const handleSubmit = () => {
    console.log("Submit expense", { description, expenses });
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

          {expenses.map((item) => (
            <View
              key={item.uniqueId}
              className="flex-row items-end justify-between py-3 border-b border-primary-border"
            >
              <View className="flex-1">
                <Text className="text-sm text-primary-font/40 uppercase font-bold">
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

          {/* Add Expenses Button */}
        </View>
        <TouchableOpacity
          className="flex-row bg-harvest rounded-md justify-between py-4 px-4"
          onPress={handleAddExpenses}
        >
          <Text className="text-base text-white font-bold">Add expense</Text>
          <ChevronRightIcon size={24} color="white" />
        </TouchableOpacity>
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
