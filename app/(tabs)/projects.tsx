import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function AllProjectsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="folder.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">All Projects</ThemedText>
      </ThemedView>
      <ThemedText>Your projects will appear here once we load them</ThemedText>

      <ThemedView style={styles.placeholderContainer}>
        <IconSymbol size={80} color="#808080" name="folder.badge.plus" />
        <ThemedText style={styles.placeholderText}>No projects yet</ThemedText>
        <ThemedText style={styles.placeholderSubtext}>
          Working on it!
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
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
