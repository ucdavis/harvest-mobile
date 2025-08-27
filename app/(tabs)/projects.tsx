import { Alert, FlatList, StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Project } from "@/lib/project";
import { useProjects } from "@/services/queries/projects";

export default function AllProjectsScreen() {
  const projectQuery = useProjects();

  console.log(projectQuery.data, projectQuery.fetchStatus);

  const handleProjectPress = (project: Project) => {
    Alert.alert("Project Selected", `You tapped on ${project.name}`);
  };

  const renderProjectCard = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => handleProjectPress(item)}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.cardContent}>
        <ThemedText type="subtitle" style={styles.projectTitle}>
          {item.id}: {item.name}
        </ThemedText>
        <ThemedText style={styles.piText}>PI: {item.piName}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">All Projects</ThemedText>
      </ThemedView>

      {projectQuery.isLoading ? (
        <ThemedText>Loading projects...</ThemedText>
      ) : projectQuery.data && projectQuery.data.length > 0 ? (
        <FlatList
          data={projectQuery.data}
          renderItem={renderProjectCard}
          keyExtractor={(item) => item.id}
          style={styles.projectList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ThemedView style={styles.placeholderContainer}>
          <IconSymbol size={80} color="#808080" name="folder.badge.plus" />
          <ThemedText style={styles.placeholderText}>
            No projects yet
          </ThemedText>
          <ThemedText style={styles.placeholderSubtext}>
            Working on it!
          </ThemedText>
        </ThemedView>
      )}
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
  projectList: {
    flex: 1,
    marginTop: 16,
  },
  projectCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  projectTitle: {
    fontWeight: "600",
    marginBottom: 8,
  },
  piText: {
    opacity: 0.8,
    fontSize: 14,
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
