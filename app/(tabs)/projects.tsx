import { View } from "react-native";

import { useAuth } from "@/components/context/AuthContext";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { useScannedProjectHandler } from "@/hooks/useScannedProjectHandler";
import { useProjects } from "@/services/queries/projects";

export default function AllProjectsScreen() {
  const { authInfo } = useAuth();
  const projectQuery = useProjects(authInfo);

  const { handleProjectPress } = useScannedProjectHandler({
    projects: projectQuery.data || [],
    isEnabled: true,
  });

  return (
    <View className="flex-1">
      <ProjectsList
        projects={projectQuery.data || []}
        queryKey={["projects", authInfo?.team]}
        onProjectPress={handleProjectPress}
        isLoading={projectQuery.isLoading}
      />
    </View>
  );
}
