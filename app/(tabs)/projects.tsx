import { useRouter } from "expo-router";
import { View } from "react-native";

import { useAuth } from "@/components/context/AuthContext";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { Project } from "@/lib/project";
import { useProjects } from "@/services/queries/projects";

export default function AllProjectsScreen() {
  const { authInfo } = useAuth();
  const projectQuery = useProjects(authInfo);
  const router = useRouter();

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
      {/* <TeamChooser /> */}
      <ProjectsList
        projects={projectQuery.data || []}
        queryKey={["projects", authInfo?.team]}
        onProjectPress={handleProjectPress}
        isLoading={projectQuery.isLoading}
      />
    </View>
  );
}
