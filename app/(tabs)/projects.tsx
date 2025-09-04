import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  FolderPlusIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "react-native-heroicons/outline";

import { ProjectCard } from "@/components/ui/ProjectCard";
import { TeamChooser } from "@/components/ui/TeamChooser";
import { Project } from "@/lib/project";
import { useProjects } from "@/services/queries/projects";

export default function AllProjectsScreen() {
  const projectQuery = useProjects();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔎 name is the Project code users see; id is the internal unique ID
  const filteredProjects = useMemo(() => {
    if (!projectQuery.data) return [];
    if (!searchTerm.trim()) return projectQuery.data;

    const q = searchTerm.toLowerCase();
    return projectQuery.data.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
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
        projectId: project.name, // 👈 showable Project code
        piName: project.piName,
      },
    });
  };

  const renderProjectCard = ({ item }: { item: Project }) => (
    <ProjectCard
      id={item.id}              // internal ID (shows in small text)
      projectId={item.name}     // visible code
      piName={item.piName}
      onPress={() => handleProjectPress(item)}
      onEdit={() => handleProjectPress(item)}
    />
  );

  return (
    <View className="flex-1">
      <TeamChooser onClose={() => console.log("Team chooser closed")} />
      <View className="flex-row items-center p-4 bg-white border-b border-primary-border">
        <MagnifyingGlassIcon size={20} color="#a0a0a0" />
        <TextInput
          className="flex-1 text-lg mx-2 text-primary-font"
          placeholder="Search project IDs or PIs…"
          placeholderTextColor="#a0a0a0"
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm("")} className="p-1">
            <XCircleIcon size={24} color="#a0a0a0" />
          </TouchableOpacity>
        )}
      </View>

      {/* Counter */}
      {searchTerm.length > 0 && (
        <View className="items-center mb-2">
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            {filteredProjects.length} result
            {filteredProjects.length !== 1 ? "s" : ""} found
          </Text>
        </View>
      )}

      {/* Lists / States */}
      {projectQuery.isLoading ? (
        <Text className="text-base text-neutral-700 dark:text-neutral-200">
          Loading projects...
        </Text>
      ) : filteredProjects.length > 0 ? (
        <View className="pb-4 px-4">
          <FlatList
            data={filteredProjects}
            renderItem={renderProjectCard}
            keyExtractor={(item) => item.id} // keep internal key stable
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>

      ) : projectQuery.data && projectQuery.data.length > 0 ? (
        <View className="items-center justify-center py-16 px-5">
          <MagnifyingGlassIcon size={80} color="#808080" />
          <Text className="text-lg font-semibold mt-4 text-center text-neutral-800 dark:text-neutral-200">
            No projects found
          </Text>
          <Text className="text-sm mt-2 text-center text-neutral-500 dark:text-neutral-400">
            Try adjusting your search terms
          </Text>
        </View>
      ) : (
        <View className="items-center justify-center py-16 px-5">
          <FolderPlusIcon size={80} color="#808080" />
          <Text className="text-lg font-semibold mt-4 text-center text-neutral-800 dark:text-neutral-200">
            No projects yet
          </Text>
          <Text className="text-sm mt-2 text-center text-neutral-500 dark:text-neutral-400">
            Working on it!
          </Text>
        </View>
      )}
    </View>
  );
}
