import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ProjectCard } from "@/components/ui/ProjectCard";
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

  // 🔎 name is the Project ID users see; keep id as the key
  const filteredProjects = useMemo(() => {
    if (!projectQuery.data) return [];
    if (!searchTerm.trim()) return projectQuery.data;

    const q = searchTerm.toLowerCase();
    return projectQuery.data.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || // visible Project ID
        p.id.toLowerCase().includes(q) ||   // internal key (still searchable)
        p.piName.toLowerCase().includes(q)
    );
  }, [projectQuery.data, searchTerm]);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries({ queryKey: ["projects"] });
    setRefreshing(false);
  };

  const handleProjectPress = (project: Project) => {
    router.push({
      pathname: "/addExpenses",
      params: {
        projectId: project.name, // 👈 showable Project ID
        piName: project.piName,
      },
    });
  };

  const renderProjectCard = ({ item }: { item: Project }) => (
    <ProjectCard
      projectId={item.name}     // 👈 use "name" as Project ID
      piName={item.piName}
      // years={item.years}      // add when available
      onPress={() => handleProjectPress(item)}
      onEdit={() => handleProjectPress(item)}
    />
  );

  return (
    <>
      <View className="main">

        <ThemedView style={styles.searchContainer}>
          <IconSymbol size={20} color={iconColor} name="magnifyingglass" />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search project IDs or PIs…"
            placeholderTextColor={iconColor}
            value={searchTerm}
            onChangeText={setSearchTerm}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm("")} style={styles.clearButton}>
              <IconSymbol size={16} color={iconColor} name="xmark.circle.fill" />
            </TouchableOpacity>
          )}
        </ThemedView>

        {searchTerm.length > 0 && (
          <ThemedView style={styles.resultCounter}>
            <ThemedText style={styles.resultCounterText}>
              {filteredProjects.length} result{filteredProjects.length !== 1 ? "s" : ""} found
            </ThemedText>
          </ThemedView>
        )}

        {projectQuery.isLoading ? (
          <ThemedText>Loading projects...</ThemedText>
        ) : filteredProjects.length > 0 ? (
          <FlatList
            data={filteredProjects}
            renderItem={renderProjectCard}
            keyExtractor={(item) => item.id}   // keep internal key stable
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        ) : projectQuery.data && projectQuery.data.length > 0 ? (
          <ThemedView style={styles.placeholderContainer}>
            <IconSymbol size={80} color="#808080" name="magnifyingglass" />
            <ThemedText style={styles.placeholderText}>No projects found</ThemedText>
            <ThemedText style={styles.placeholderSubtext}>Try adjusting your search terms</ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.placeholderContainer}>
            <IconSymbol size={80} color="#808080" name="folder.badge.plus" />
            <ThemedText style={styles.placeholderText}>No projects yet</ThemedText>
            <ThemedText style={styles.placeholderSubtext}>Working on it!</ThemedText>
          </ThemedView>
        )}
      </View>

    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: { flexDirection: "row", gap: 8 },
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
  searchInput: { flex: 1, fontSize: 16, marginLeft: 8, marginRight: 8 },
  clearButton: { padding: 4 },
  resultCounter: { alignItems: "center", marginBottom: 8 },
  resultCounterText: { fontSize: 12, opacity: 0.7 },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  placeholderText: { fontSize: 18, fontWeight: "600", marginTop: 16, textAlign: "center" },
  placeholderSubtext: { fontSize: 14, marginTop: 8, textAlign: "center", opacity: 0.7 },
});
