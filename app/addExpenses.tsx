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
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-md uppercase font-bold text-harvest tracking-tight">
              Project
            </Text>
            <InformationCircleIcon size={16} color="#666666" />
          </View>
          <Text className="text-base font-semibold text-gray-800">
            {projectId} {projectName}
          </Text>
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
                <Text className="text-xs text-primary-font/40 uppercase font-medium">
                  {item.type}
                </Text>
                <Text className="text-base text-primary-font font-medium">
                  {item.rate?.description}
                </Text>
              </View>

              <View className="flex-row items-center space-x-3">
                <Text className="text-base text-primary-font/80 font-semibold">
                  {item.quantity} {item.rate?.unit} @ ${item.price}
                </Text>
                <TouchableOpacity className="ms-3" onPress={() => handleDeleteExpense(item.uniqueId)}>
                  <TrashIcon size={16} color="#79242F" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Add Expenses Button */}
          <TouchableOpacity
            className="flex-row justify-between py-4 px-1"
            onPress={handleAddExpenses}
          >
            <Text className="text-base text-gray-800 font-medium">
              Add expense
            </Text>
            <ChevronRightIcon size={16} color="#666666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="p-4 mb-4 bg-white border-t border-primary-border">
        <TouchableOpacity
          className="bg-harvest py-4 rounded-xl items-center"
          onPress={handleSubmit}
        >
          <Text className="text-white text-lg font-semibold">Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
