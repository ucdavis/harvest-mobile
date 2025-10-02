import { useAuth } from "@/components/context/AuthContext";
import { useExpenses } from "@/components/context/ExpenseContext";
import { Project } from "@/lib/project";
import { useProjects } from "@/services/queries/projects";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { Alert } from "react-native";

interface UseScannedProjectHandlerProps {
  isEnabled?: boolean; // Allow disabling the handler for specific screens
}

/**
 * Custom hook to handle scanned project IDs.
 * Centralizes the logic for processing scanned QR codes and navigating to addExpenses.
 * This prevents duplicate handling when multiple screens need to support QR scanning.
 *
 * Always fetches all projects dynamically to find the scanned project.
 */
export function useScannedProjectHandler({
  isEnabled = true,
}: UseScannedProjectHandlerProps) {
  const { scannedProjectId, setScannedProjectId } = useExpenses();
  const { authInfo } = useAuth();
  const router = useRouter();
  const isFocused = useIsFocused();

  // Fetch all projects to search through
  const projectsQuery = useProjects(authInfo);
  const projects = useMemo(
    () => projectsQuery.data || [],
    [projectsQuery.data]
  );

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

  // Handle scanned project ID - only process if this screen is focused
  useEffect(() => {
    if (!isEnabled || !isFocused || !scannedProjectId) {
      return;
    }

    // If projects are still loading, wait
    if (projectsQuery.isLoading) {
      return;
    }

    // If we still don't have any projects to search, show an error
    if (projects.length === 0) {
      Alert.alert(
        "Unable to Load Projects",
        "Could not load projects to verify the scanned QR code. Please try again.",
        [
          {
            text: "OK",
            onPress: () => setScannedProjectId(null),
          },
        ]
      );
      setScannedProjectId(null);
      return;
    }

    const scannedProject = projects.find(
      (project: Project) => project.id.toString() === scannedProjectId
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
  }, [
    scannedProjectId,
    projects,
    projectsQuery.isLoading,
    handleProjectPress,
    setScannedProjectId,
    isEnabled,
    isFocused,
  ]);

  return {
    handleProjectPress,
    scannedProjectId,
  };
}
