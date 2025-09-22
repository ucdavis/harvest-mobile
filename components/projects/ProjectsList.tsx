import { useQueryClient } from "@tanstack/react-query";
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
import { Project } from "@/lib/project";
import { XMarkIcon } from "react-native-heroicons/solid";

type ProjectsListProps = {
  projects: Project[];
  queryKey: (string | undefined)[];
  onProjectPress: (project: Project) => void;
  isLoading?: boolean;
};

export function ProjectsList({
  projects,
  queryKey,
  onProjectPress,
  isLoading = false,
}: ProjectsListProps) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!searchTerm.trim()) return projects;

    const q = searchTerm.toLowerCase();

    return projects.filter(
      (p) =>
        String(p.name).toLowerCase().includes(q) ||
        String(p.id).toLowerCase().includes(q) ||
        String(p.piName).toLowerCase().includes(q)
    );
  }, [projects, searchTerm]);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries({
      queryKey,
    });
    setRefreshing(false);
  };

  const handleProjectPress = (project: Project) => {
    onProjectPress(project);
  };

  const renderProjectCard = ({ item }: { item: Project }) => (
    <ProjectCard
      id={Number(item.id)}
      projectName={item.name}
      piName={item.piName}
      onPress={() => handleProjectPress(item)}
      onEdit={() => handleProjectPress(item)}
    />
  );

  // Show loading state
  if (isLoading) {
    return (
      <View className="flex-1">
        {/* Search Bar */}
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

        <Text className="text-base text-neutral-700 dark:text-neutral-200 p-4">
          Loading projects...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Search Bar */}
      <View className="flex-row items-center leading-6 p-4 bg-white border-b border-primary-border">
        <MagnifyingGlassIcon size={20} color="#a0a0a0" />
        <TextInput
          className="flex-1 leading-6 text-lg mx-2 text-primary-font"
          placeholder="Search project IDs or PIs…"
          placeholderTextColor="#a0a0a0"
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm("")} className="p-1">
            <XMarkIcon className="m-0 p-0" size={16} color="#a0a0a0" />
          </TouchableOpacity>
        )}
      </View>

      {/* Counter */}
      {searchTerm.length > 0 && (
        <View className="items-center mt-2">
          <Text className="text-sm text-primary-font/80">
            {filteredProjects.length} result
            {filteredProjects.length !== 1 ? "s" : ""} found
          </Text>
        </View>
      )}

      {/* Projects List Content */}
      {filteredProjects.length > 0 ? (
        <View className="px-4 flex-1">
          <FlatList
            data={filteredProjects}
            renderItem={renderProjectCard}
            keyExtractor={(item) => item.id} // keep internal key stable
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 88 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      ) : searchTerm.length > 0 ? (
        <View className="items-center justify-center py-16 px-5">
          <MagnifyingGlassIcon size={80} color="#808080" />
          <Text className="text-lg font-semibold mt-4 text-center text-harvest">
            No projects found
          </Text>
          <Text className="mt-2 text-center text-primary-font/80">
            Try adjusting your search terms
          </Text>
        </View>
      ) : (
        <View className="items-center justify-center py-16 px-5">
          <FolderPlusIcon size={80} color="#808080" />
          <Text className="text-lg font-semibold mt-4 text-center text-primary-font">
            No projects yet
          </Text>
          <Text className="mt-2 text-center text-primary-font/80">
            You can add recent projects by submitting an expense
          </Text>
        </View>
      )}
    </View>
  );
}
