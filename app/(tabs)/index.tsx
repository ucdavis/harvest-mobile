import { useAuth } from "@/components/context/AuthContext";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { TeamChooser } from "@/components/ui/TeamChooser";
import { useRecentProjects } from "@/services/queries/projects";
import { ScrollView, View } from "react-native";

export default function RecentProjectsScreen() {
  const { authInfo } = useAuth();
  const { data: recentProjects } = useRecentProjects(authInfo);
  return (
    <ScrollView stickyHeaderIndices={[0]} className="flex-1 flex-col">
      {/* Sticky header */}
      <TeamChooser onClose={() => console.log("Team chooser closed")} />

      {/* Scrollable content */}
      <View className="p-4">
        {recentProjects?.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            projectId={project.id}
            piName={project.piName}
            onEdit={() => console.log("edit pressed")}
          />
        ))}
      </View>
    </ScrollView>
  );
}
