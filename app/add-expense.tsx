import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Expense, createExpenseWithUniqueId } from "@/lib/expense";

export default function AddExpenseScreen() {
  const { projectId, projectName } = useLocalSearchParams<{
    projectId: string;
    projectName: string;
    piName: string;
  }>();

  const [description, setDescription] = useState("");
  const [expenses] = useState<Expense[]>([
    createExpenseWithUniqueId({
      // TODO: testing
      type: "labor",
      description: "RR Farm Labor",
      price: 100,
      quantity: 1,
      projectId: projectId,
      rateId: "rate_1",
      rate: {
        unit: "hours",
        description: "Tractor X",
        price: 100,
        type: "equipment",
        id: "rate_1",
      },
    }),
  ]);

  const handleAddExpenses = () => {
    // Navigate to rate selection modal
    router.push({
      pathname: "/rate-select",
      params: { projectId },
    });
  };

  const handleSubmit = () => {
    console.log("Submit expense", { description, expenses });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Project Info Header */}
        <ThemedView style={styles.projectInfoContainer}>
          <ThemedView style={styles.projectRow}>
            <ThemedText style={styles.projectLabel}>PROJECT</ThemedText>
            <IconSymbol size={16} color="#666" name="info.circle" />
          </ThemedView>
          <ThemedText style={styles.projectId}>
            {projectId}: {projectName}
          </ThemedText>
        </ThemedView>

        {/* Description Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText style={styles.sectionLabel}>DESCRIPTION</ThemedText>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Add activity description..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </ThemedView>

        {/* Expenses Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText style={styles.sectionLabel}>EXPENSES</ThemedText>

          {/* Existing expenses */}
          {expenses.map((item) => (
            <ThemedView key={item.uniqueId} style={styles.expenseRow}>
              <ThemedView style={styles.expenseInfo}>
                <ThemedText style={styles.expenseCategory}>
                  {item.type}
                </ThemedText>
                <ThemedText style={styles.expenseName}>
                  {item.description}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.expenseHours}>
                <ThemedText style={styles.hoursText}>
                  {item.quantity} {item.rate?.unit} @ ${item.price}
                </ThemedText>
                <TouchableOpacity>
                  <ThemedText style={styles.editText}>edit</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          ))}

          {/* Add Expenses Button */}
          <TouchableOpacity
            style={styles.addExpensesButton}
            onPress={handleAddExpenses}
          >
            <ThemedText style={styles.addExpensesText}>Add expense</ThemedText>
            <IconSymbol size={16} color="#666" name="chevron.right" />
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>

      {/* Submit Button */}
      <ThemedView style={styles.submitContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <ThemedText style={styles.submitButtonText}>Submit</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  projectInfoContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  projectLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    letterSpacing: 0.5,
  },
  projectId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  sectionContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 60,
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
  },
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  expenseInfo: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginBottom: 4,
  },
  expenseName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  expenseHours: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  hoursText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  editText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  addExpensesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  addExpensesText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  submitContainer: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  submitButton: {
    backgroundColor: "#5e8a5e",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
