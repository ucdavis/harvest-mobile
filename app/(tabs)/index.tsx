import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function RecentProjectsScreen() {
  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Recent Projects</ThemedText>
      </ThemedView>
      <ThemedText>Your recently accessed projects will appear here</ThemedText>

      <ThemedView style={styles.placeholderContainer}>
        <IconSymbol size={80} color="#808080" name="clock.badge.checkmark" />
        <ThemedText style={styles.placeholderText}>
          No recent activity
        </ThemedText>
        <ThemedText style={styles.placeholderSubtext}>
          Start working on projects to see them here!
        </ThemedText>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
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
