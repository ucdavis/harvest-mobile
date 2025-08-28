import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Project } from "@/lib/project";
import { useProjects } from "@/services/queries/projects";

export default function AllProjectsScreen() {
  const projectQuery = useProjects();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  const filteredProjects = useMemo(() => {
    if (!projectQuery.data) return [];
    if (!searchTerm.trim()) return projectQuery.data;

    return projectQuery.data.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.piName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projectQuery.data, searchTerm]);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries({ queryKey: ["projects"] });
    setRefreshing(false);
  };

  console.log(projectQuery.data, projectQuery.fetchStatus);

  const handleProjectPress = (project: Project) => {
    router.push({
      pathname: "/addExpenses",
      params: {
        projectId: project.id,
        projectName: project.name,
        piName: project.piName,
      },
    });
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

      <ThemedView style={styles.searchContainer}>
        <IconSymbol size={20} color={iconColor} name="magnifyingglass" />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search projects, IDs, or PIs..."
          placeholderTextColor={iconColor}
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchTerm("")}
            style={styles.clearButton}
          >
            <IconSymbol size={16} color={iconColor} name="xmark.circle.fill" />
          </TouchableOpacity>
        )}
      </ThemedView>

      {searchTerm.length > 0 && (
        <ThemedView style={styles.resultCounter}>
          <ThemedText style={styles.resultCounterText}>
            {filteredProjects.length} result
            {filteredProjects.length !== 1 ? "s" : ""} found
          </ThemedText>
        </ThemedView>
      )}

      {projectQuery.isLoading ? (
        <ThemedText>Loading projects...</ThemedText>
      ) : filteredProjects.length > 0 ? (
        <FlatList
          data={filteredProjects}
          renderItem={renderProjectCard}
          keyExtractor={(item) => item.id}
          style={styles.projectList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : projectQuery.data && projectQuery.data.length > 0 ? (
        <ThemedView style={styles.placeholderContainer}>
          <IconSymbol size={80} color="#808080" name="magnifyingglass" />
          <ThemedText style={styles.placeholderText}>
            No projects found
          </ThemedText>
          <ThemedText style={styles.placeholderSubtext}>
            Try adjusting your search terms
          </ThemedText>
        </ThemedView>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  clearButton: {
    padding: 4,
  },
  resultCounter: {
    alignItems: "center",
    marginBottom: 8,
  },
  resultCounterText: {
    fontSize: 12,
    opacity: 0.7,
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
