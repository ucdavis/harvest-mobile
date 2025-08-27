import { StyleSheet, TouchableOpacity } from "react-native";

import { useAuth } from "@/components/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function HistoryScreen() {
  const { logout } = useAuth();

  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">History</ThemedText>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <IconSymbol
            size={24}
            color="#FF4444"
            name="rectangle.portrait.and.arrow.right"
          />
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedText>
        Your project history and time tracking logs will appear here
      </ThemedText>

      <ThemedView style={styles.placeholderContainer}>
        <IconSymbol size={80} color="#808080" name="clock.arrow.2.circlepath" />
        <ThemedText style={styles.placeholderText}>No history yet</ThemedText>
        <ThemedText style={styles.placeholderSubtext}>
          Start tracking time on projects to see your activity history here.
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255, 68, 68, 0.1)",
  },
  logoutText: {
    fontSize: 14,
    color: "#FF4444",
    fontWeight: "600",
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
