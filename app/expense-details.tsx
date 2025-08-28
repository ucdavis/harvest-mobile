import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Rate, createExpenseWithUniqueId } from "@/lib/expense";

export default function ExpenseDetailsScreen() {
  const { rate: rateParam, projectId } = useLocalSearchParams<{
    rate: string;
    projectId: string;
  }>();

  // Parse the rate from URL params
  const rate: Rate = rateParam ? JSON.parse(rateParam) : null;

  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");

  const handleCancel = () => {
    router.back();
  };

  const handleConfirm = () => {
    const numericQuantity = parseFloat(quantity);

    if (!numericQuantity || numericQuantity <= 0) {
      Alert.alert(
        "Invalid Quantity",
        "Please enter a valid quantity greater than 0."
      );
      return;
    }

    if (!rate) {
      Alert.alert("Error", "Rate information is missing.");
      return;
    }

    // Create the new expense
    const newExpense = createExpenseWithUniqueId({
      type: rate.type,
      description: description || rate.description,
      price: rate.price,
      quantity: numericQuantity,
      projectId: projectId || "",
      rateId: rate.id,
      rate: rate,
    });

    // Navigate back to add-expense with the new expense data
    router.dismissAll();
    router.push({
      pathname: "/add-expense",
      params: {
        projectId,
        newExpense: JSON.stringify(newExpense),
      },
    });
  };

  const getTotalCost = () => {
    const numericQuantity = parseFloat(quantity) || 0;
    return (numericQuantity * (rate?.price || 0)).toFixed(2);
  };

  const getRateTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "labor":
        return "#3B82F6"; // Blue
      case "equipment":
        return "#F59E0B"; // Amber
      case "other":
        return "#10B981"; // Emerald
      default:
        return "#6B7280"; // Gray
    }
  };

  const getRateTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "labor":
        return "person.fill";
      case "equipment":
        return "wrench.and.screwdriver.fill";
      case "other":
        return "cube.box.fill";
      default:
        return "questionmark.circle.fill";
    }
  };

  if (!rate) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol size={48} color="#EF4444" name="exclamationmark.triangle" />
        <ThemedText style={styles.errorText}>
          Rate information is missing
        </ThemedText>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Expense Details</ThemedText>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <ThemedText style={styles.confirmButtonText}>Add</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Content */}
        <ThemedView style={styles.content}>
          {/* Selected Rate Info */}
          <ThemedView style={styles.rateInfoCard}>
            <ThemedView style={styles.rateHeader}>
              <ThemedView
                style={[
                  styles.typeIcon,
                  { backgroundColor: getRateTypeColor(rate.type) },
                ]}
              >
                <IconSymbol
                  size={20}
                  color="white"
                  name={getRateTypeIcon(rate.type)}
                />
              </ThemedView>
              <ThemedView style={styles.rateInfo}>
                <ThemedText style={styles.rateType}>{rate.type}</ThemedText>
                <ThemedText style={styles.rateDescription}>
                  {rate.description}
                </ThemedText>
                <ThemedText style={styles.ratePrice}>
                  ${rate.price} per {rate.unit}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          {/* Quantity Input */}
          <ThemedView style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>
              QUANTITY ({rate.unit})
            </ThemedText>
            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Enter quantity"
              placeholderTextColor="#999"
              keyboardType="numeric"
              selectTextOnFocus
            />
          </ThemedView>

          {/* Description Input */}
          <ThemedView style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>
              DESCRIPTION (OPTIONAL)
            </ThemedText>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder={`Enter custom description or leave blank to use "${rate.description}"`}
              placeholderTextColor="#999"
              multiline
            />
          </ThemedView>

          {/* Total Cost */}
          <ThemedView style={styles.totalSection}>
            <ThemedView style={styles.totalRow}>
              <ThemedText style={styles.totalLabel}>Total Cost</ThemedText>
              <ThemedText style={styles.totalAmount}>
                ${getTotalCost()}
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.totalBreakdown}>
              {quantity || "0"} {rate.unit} × ${rate.price} = ${getTotalCost()}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  backButton: {
    marginTop: 16,
    backgroundColor: "#5e8a5e",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  confirmButton: {
    paddingVertical: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#5e8a5e",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  rateInfoCard: {
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
  rateHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rateInfo: {
    flex: 1,
  },
  rateType: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  rateDescription: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  ratePrice: {
    fontSize: 14,
    color: "#666",
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  quantityInput: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    textAlign: "center",
  },
  descriptionInput: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minHeight: 80,
    textAlignVertical: "top",
  },
  totalSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: "auto",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#5e8a5e",
  },
  totalBreakdown: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
