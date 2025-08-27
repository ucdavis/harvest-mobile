import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function AddExpenseScreen() {
  const { projectId, projectName, piName } = useLocalSearchParams<{
    projectId: string;
    projectName: string;
    piName: string;
  }>();

  return (
    <ThemedView style={styles.container}>
      {/* Project Info Header */}
      <ThemedView style={styles.projectInfoContainer}>
        <ThemedText type="subtitle" style={styles.projectId}>
          Project: {projectId}
        </ThemedText>
        <ThemedText style={styles.piText}>PI: {piName}</ThemedText>
      </ThemedView>

      {/* Main Content Placeholder */}
      <ThemedView style={styles.contentContainer}>
        <ThemedView style={styles.placeholderContainer}>
          <IconSymbol size={80} color="#808080" name="plus.circle.fill" />
          <ThemedText style={styles.placeholderText}>
            Add Expense Form
          </ThemedText>
          <ThemedText style={styles.placeholderSubtext}>
            Placeholder for adding expenses to {projectName}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  projectInfoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  projectId: {
    fontWeight: "600",
    marginBottom: 8,
  },
  piText: {
    opacity: 0.8,
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 20,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  placeholderSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    opacity: 0.7,
  },
});
