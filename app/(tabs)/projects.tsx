import { useRouter } from "expo-router";
import { Alert, View } from "react-native";

import { useAuth } from "@/components/context/AuthContext";
import { useExpenses } from "@/components/context/ExpenseContext";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { Project } from "@/lib/project";
import { useProjects } from "@/services/queries/projects";
import { useCallback, useEffect } from "react";

export default function AllProjectsScreen() {
  const { authInfo } = useAuth();
  const { scannedProjectId, setScannedProjectId } = useExpenses();
  const projectQuery = useProjects(authInfo);
  const router = useRouter();

  const handleProjectPress = useCallback(
    (project: Project) => {
      router.push({
        pathname: "/addExpenses",
        params: {
          projectId: project.id,
          projectName: project.name,
          piName: project.piName,
        },
      });
    },
    [router]
  );

  // Handle scanned project ID
  useEffect(() => {
    const projects = projectQuery.data || [];
    if (scannedProjectId && projects.length > 0) {
      const scannedProject = projects.find(
        (project) => project.id.toString() === scannedProjectId
      );
      if (scannedProject) {
        // Clear the scanned project ID to prevent re-triggering
        setScannedProjectId(null);
        handleProjectPress(scannedProject);
      } else {
        Alert.alert(
          "Project Not Found",
          `The scanned project (ID: ${scannedProjectId}) is not valid. Please scan a valid project QR code or select a project from the list.`,
          [
            {
              text: "OK",
              onPress: () => setScannedProjectId(null),
            },
          ]
        );
        // Clear the invalid scanned project ID
        setScannedProjectId(null);
      }
    }
  }, [
    scannedProjectId,
    projectQuery.data,
    handleProjectPress,
    setScannedProjectId,
  ]);

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
