import { useAuth } from "@/components/context/AuthContext";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { TeamChooser } from "@/components/ui/TeamChooser";
import { Project } from "@/lib/project";
import { useRecentProjects } from "@/services/queries/projects";
import { router } from "expo-router";
import { ScrollView } from "react-native";

export default function RecentProjectsScreen() {
  const { authInfo } = useAuth();
  const { data: recentProjects } = useRecentProjects(authInfo);

  const handleProjectPress = (project: Project) => {
    router.push({
      pathname: "/addExpenses",
      params: {
        projectId: project.name,
        piName: project.piName,
      },
    });
  };

  return (
    <ScrollView stickyHeaderIndices={[0]} className="flex-1 flex-col">
      {/* Sticky header */}
      <TeamChooser onClose={() => console.log("Team chooser closed")} />

      <ProjectsList
        projects={recentProjects || []}
        queryKey={["projects", authInfo?.team, "recent"]}
        onProjectPress={handleProjectPress}
      />
    </ScrollView>
  );
}
