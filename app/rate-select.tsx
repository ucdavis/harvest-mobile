import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Rate } from "@/lib/expense";
import { useRates } from "@/services/queries/rates";

export default function RateSelectScreen() {
  const { projectId } = useLocalSearchParams<{
    projectId: string;
  }>();

  const { data: rates, isLoading, error } = useRates();

  const handleRateSelect = (rate: Rate) => {
    // Navigate directly to expense details with the selected rate
    router.push({
      pathname: "/expense-details",
      params: {
        rate: JSON.stringify(rate),
        projectId: projectId || "",
      },
    });
  };

  const handleCancel = () => {
    router.back();
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

  const renderRateItem = ({ item }: { item: Rate }) => (
    <TouchableOpacity
      style={styles.rateItem}
      onPress={() => handleRateSelect(item)}
    >
      <View style={styles.rateContent}>
        <View style={styles.rateHeader}>
          <View
            style={[
              styles.typeIcon,
              { backgroundColor: getRateTypeColor(item.type) },
            ]}
          >
            <IconSymbol
              size={16}
              color="white"
              name={getRateTypeIcon(item.type)}
            />
          </View>
          <View style={styles.rateInfo}>
            <ThemedText style={styles.rateType}>{item.type}</ThemedText>
            <ThemedText style={styles.rateDescription}>
              {item.description}
            </ThemedText>
          </View>
          <View style={styles.ratePricing}>
            <ThemedText style={styles.ratePrice}>${item.price}</ThemedText>
            <ThemedText style={styles.rateUnit}>per {item.unit}</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5e8a5e" />
        <ThemedText style={styles.loadingText}>Loading rates...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol size={48} color="#EF4444" name="exclamationmark.triangle" />
        <ThemedText style={styles.errorText}>Failed to load rates</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={() => {}}>
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Select Rate</ThemedText>
        <View style={{ width: 60 }} />
      </ThemedView>

      {/* Rates List */}
      <FlatList
        data={rates}
        renderItem={renderRateItem}
        keyExtractor={(item) => item.id}
        style={styles.ratesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ratesListContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
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
  retryButton: {
    marginTop: 16,
    backgroundColor: "#5e8a5e",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
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
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#5e8a5e",
    fontWeight: "600",
  },
  confirmButtonTextDisabled: {
    color: "#999",
  },
  ratesList: {
    flex: 1,
  },
  ratesListContent: {
    padding: 16,
  },
  rateItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedRateItem: {
    borderColor: "#5e8a5e",
    backgroundColor: "#f8fff8",
  },
  rateContent: {
    position: "relative",
  },
  rateHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  ratePricing: {
    alignItems: "flex-end",
  },
  ratePrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  rateUnit: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  checkmark: {
    position: "absolute",
    top: -4,
    right: -4,
  },
});
