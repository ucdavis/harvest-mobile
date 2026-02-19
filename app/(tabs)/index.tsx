import { useAuth } from "@/components/context/AuthContext";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { useScannedProjectHandler } from "@/hooks/useScannedProjectHandler";
import { useProjects, useRecentProjects } from "@/services/queries/projects";
import { useUserInfo } from "@/services/queries/users";
import { setUser } from "@sentry/react-native";
import { useEffect } from "react";
import { View } from "react-native";

export default function RecentProjectsScreen() {
  const { authInfo } = useAuth();
  const recentProjectsQuery = useRecentProjects(authInfo);
  const projectsQuery = useProjects(authInfo);
  const userQuery = useUserInfo(authInfo);

  const { handleProjectPress } = useScannedProjectHandler({
    isEnabled: true,
  });

  useEffect(() => {
    // whenever the user info changes, update sentry
    if (userQuery?.data?.user) {
      setUser({
        id: userQuery.data.user.id,
        email: userQuery.data.user.email,
        team: userQuery.data.teamSlug,
      });
    }
  }, [userQuery.data]);

  return (
    <View className="flex-1">
      {/* <TeamChooser /> */}

      <ProjectsList
        projects={projectsQuery.data || []}
        recentProjects={recentProjectsQuery.data || []}
        queryKey={["projects", authInfo?.team]}
        refreshQueryKeys={[
          ["projects", authInfo?.team, "all"],
          ["projects", authInfo?.team, "recent"],
        ]}
        onProjectPress={handleProjectPress}
        isLoading={recentProjectsQuery.isLoading || projectsQuery.isLoading}
      />
    </View>
  );
}
