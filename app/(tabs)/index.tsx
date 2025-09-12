import { useAuth } from "@/components/context/AuthContext";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { TeamChooser } from "@/components/ui/TeamChooser";
import { Project } from "@/lib/project";
import { useRecentProjects } from "@/services/queries/projects";
import { router } from "expo-router";
import { View } from "react-native";

export default function RecentProjectsScreen() {
  const { authInfo } = useAuth();
  const { data: recentProjects } = useRecentProjects(authInfo);

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

  return (
    <View className="flex-1">
      <TeamChooser />

      <ProjectsList
        projects={recentProjects || []}
        queryKey={["projects", authInfo?.team, "recent"]}
        onProjectPress={handleProjectPress}
      />
    </View>
  );
}
