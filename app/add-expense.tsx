import { useLocalSearchParams } from "expo-router";
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

interface WorkItem {
  id: string;
  name: string;
  category: string;
  hours: number;
}

export default function AddExpenseScreen() {
  const { projectId, projectName } = useLocalSearchParams<{
    projectId: string;
    projectName: string;
    piName: string;
  }>();

  const [description, setDescription] = useState("");
  const [workItems] = useState<WorkItem[]>([
    {
      // TODO: testing
      id: "1",
      name: "RR Farm Labor",
      category: "LABOR",
      hours: 32,
    },
  ]);

  const handleAddWorkItems = () => {
    // Navigate to work items selection screen
    console.log("Navigate to work items selection");
  };

  const handleSubmit = () => {
    console.log("Submit expense", { description, workItems });
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

        {/* Work Items Section */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText style={styles.sectionLabel}>WORK ITEMS</ThemedText>

          {/* Existing Work Items */}
          {workItems.map((item) => (
            <ThemedView key={item.id} style={styles.workItemRow}>
              <ThemedView style={styles.workItemInfo}>
                <ThemedText style={styles.workItemCategory}>
                  {item.category}
                </ThemedText>
                <ThemedText style={styles.workItemName}>{item.name}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.workItemHours}>
                <ThemedText style={styles.hoursText}>{item.hours}hr</ThemedText>
                <TouchableOpacity>
                  <ThemedText style={styles.editText}>edit</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          ))}

          {/* Add Work Items Button */}
          <TouchableOpacity
            style={styles.addWorkItemsButton}
            onPress={handleAddWorkItems}
          >
            <ThemedText style={styles.addWorkItemsText}>
              Add work items
            </ThemedText>
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
  workItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  workItemInfo: {
    flex: 1,
  },
  workItemCategory: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginBottom: 4,
  },
  workItemName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  workItemHours: {
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
  addWorkItemsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  addWorkItemsText: {
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
