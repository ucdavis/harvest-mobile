import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
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
import { Colors } from "@/constants/Colors";
import { tx } from "@/lib/i18n";
import { Project } from "@/lib/project";
import { XMarkIcon } from "react-native-heroicons/solid";

type ProjectsListProps = {
  projects: Project[];
  queryKey: (string | undefined)[];
  onProjectPress: (project: Project) => void;
  isLoading?: boolean;
  recentProjects?: Project[];
  refreshQueryKeys?: (string | undefined)[][];
};

type ProjectListItem =
  | {
      type: "header";
      header: string;
      key: string;
    }
  | {
      type: "project";
      section: "recent" | "all";
      project: Project;
    };

export function ProjectsList({
  projects,
  queryKey,
  onProjectPress,
  isLoading = false,
  recentProjects,
  refreshQueryKeys,
}: ProjectsListProps) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const sectionedMode = typeof recentProjects !== "undefined";

  const filterProjects = useCallback(
    (items: Project[] = []) => {
      if (!searchTerm.trim()) return items;
      const q = searchTerm.toLowerCase();
      return items.filter(
        (p) =>
          String(p.name).toLowerCase().includes(q) ||
          String(p.id).toLowerCase().includes(q) ||
          String(p.piName).toLowerCase().includes(q),
      );
    },
    [searchTerm],
  );

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    return filterProjects(projects);
  }, [projects, filterProjects]);

  const filteredRecentProjects = useMemo(() => {
    return filterProjects(recentProjects ?? []);
  }, [recentProjects, filterProjects]);

  const listData = useMemo<ProjectListItem[]>(() => {
    if (!sectionedMode) {
      return filteredProjects.map((project) => ({
        type: "project",
        section: "all",
        project,
      }));
    }

    return [
      ...(filteredRecentProjects.length > 0
        ? [
            {
              type: "header" as const,
              header: tx("components.projectsList.recentsHeader"),
              key: "header-recent-projects",
            },
            ...filteredRecentProjects.map((project) => ({
              type: "project" as const,
              section: "recent" as const,
              project,
            })),
          ]
        : []),
      ...(filteredProjects.length > 0
        ? [
            {
              type: "header" as const,
              header: tx("components.projectsList.allHeader"),
              key: "header-all-projects",
            },
            ...filteredProjects.map((project) => ({
              type: "project" as const,
              section: "all" as const,
              project,
            })),
          ]
        : []),
    ];
  }, [sectionedMode, filteredProjects, filteredRecentProjects]);

  const visibleProjectCount = sectionedMode
    ? filteredRecentProjects.length + filteredProjects.length
    : filteredProjects.length;

  const onRefresh = async () => {
    setRefreshing(true);
    const queryKeysToRefresh =
      refreshQueryKeys && refreshQueryKeys.length > 0
        ? refreshQueryKeys
        : [queryKey];
    await Promise.all(
      queryKeysToRefresh.map((key) =>
        queryClient.refetchQueries({
          queryKey: key,
        }),
      ),
    );
    setRefreshing(false);
  };

  const handleProjectPress = (project: Project) => {
    onProjectPress(project);
  };

  const renderProjectCard = (project: Project) => (
    <ProjectCard
      id={project.id}
      projectName={project.name}
      piName={project.piName}
      onPress={() => handleProjectPress(project)}
      onEdit={() => handleProjectPress(project)}
    />
  );

  const renderItem = ({ item }: { item: ProjectListItem }) => {
    if (item.type === "header") {
      return (
        <Text className="px-4 pt-4 pb-2 text-base font-semibold text-primaryfont">
          {item.header}
        </Text>
      );
    }

    return renderProjectCard(item.project);
  };

  // Show loading state
  if (isLoading) {
    return (
      <View className="flex-1">
        {/* Search Bar */}
        <View className="flex-row items-center p-4 bg-white border-b border-primaryborder">
          <MagnifyingGlassIcon size={20} color={Colors.icon} />
          <TextInput
            className="flex-1 text-lg mx-2 text-primaryfont"
            placeholder={tx("components.projectsList.searchPlaceholder")}
            placeholderTextColor={Colors.icon}
            value={searchTerm}
            onChangeText={setSearchTerm}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm("")} className="p-1">
              <XCircleIcon size={24} color={Colors.icon} />
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-base text-primaryfont/70 p-4">
          {tx("components.projectsList.loadingProjects")}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="flex-row items-center p-4 bg-white border-b border-primaryborder h-14">
        <MagnifyingGlassIcon size={20} color={Colors.icon} />
        <TextInput
          className="flex-1 mx-2 text-primaryfont text-lg leading-6"
          placeholder={tx("components.projectsList.searchPlaceholder")}
          placeholderTextColor={Colors.icon}
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
          multiline={false}
          numberOfLines={1}
          style={{
            lineHeight: 20,
            height: 24,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            className="p-1 mr-1"
            accessibilityRole="button"
            accessibilityLabel={tx(
              "components.projectsList.clearSearchAccessibilityLabel",
            )}
            onPress={() => setSearchTerm("")}
          >
            <XMarkIcon size={20} color={Colors.icon} />
          </TouchableOpacity>
        )}
      </View>

      {/* Counter */}
      {searchTerm.length > 0 && (
        <View className="items-center mt-2">
          <Text className="text-sm text-primaryfont/80">
            {visibleProjectCount === 1
              ? tx("components.projectsList.resultsFoundSingular", {
                  count: visibleProjectCount,
                })
              : tx("components.projectsList.resultsFoundPlural", {
                  count: visibleProjectCount,
                })}
          </Text>
        </View>
      )}

      {/* Projects List Content */}
      {listData.length > 0 ? (
        <View className="px-4 flex-1">
          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={(item, idx) => {
              if (item.type === "header") return item.key;
              return `${item.section}-${item.project.id}-${idx}`;
            }}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 88 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      ) : searchTerm.length > 0 ? (
        <View className="items-center justify-center py-16 px-5">
          <MagnifyingGlassIcon size={80} color={Colors.icon} />
          <Text className="text-lg font-semibold mt-4 text-center text-harvest">
            {tx("components.projectsList.noProjectsFound")}
          </Text>
          <Text className="mt-2 text-center text-primaryfont/80">
            {tx("components.projectsList.adjustSearchTerms")}
          </Text>
        </View>
      ) : (
        <View className="items-center justify-center py-16 px-5">
          <FolderPlusIcon size={80} color={Colors.icon} />
          <Text className="text-lg font-semibold mt-4 text-center text-primaryfont">
            {tx("components.projectsList.noProjectsYet")}
          </Text>
          <Text className="mt-2 text-center text-primaryfont/80">
            {tx("components.projectsList.addRecentProjectsHint")}
          </Text>
        </View>
      )}
    </View>
  );
}
