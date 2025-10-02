import { useExpenses } from "@/components/context/ExpenseContext";
import { Project } from "@/lib/project";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Alert } from "react-native";

interface UseScannedProjectHandlerProps {
  projects: Project[];
  isEnabled?: boolean; // Allow disabling the handler for specific screens
}

/**
 * Custom hook to handle scanned project IDs.
 * Centralizes the logic for processing scanned QR codes and navigating to addExpenses.
 * This prevents duplicate handling when multiple screens need to support QR scanning.
 */
export function useScannedProjectHandler({
  projects,
  isEnabled = true,
}: UseScannedProjectHandlerProps) {
  const { scannedProjectId, setScannedProjectId } = useExpenses();
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
    if (!isEnabled || !scannedProjectId || projects.length === 0) {
      return;
    }

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
  }, [
    scannedProjectId,
    projects,
    handleProjectPress,
    setScannedProjectId,
    isEnabled,
  ]);

  return {
    handleProjectPress,
    scannedProjectId,
  };
}
