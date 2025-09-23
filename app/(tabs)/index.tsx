import { useAuth } from "@/components/context/AuthContext";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { Project } from "@/lib/project";
import { useRecentProjects } from "@/services/queries/projects";
import { useUserInfo } from "@/services/queries/users";
import { setUser } from "@sentry/react-native";
import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function RecentProjectsScreen() {
  const { authInfo } = useAuth();
  const { data: recentProjects, isLoading: isLoadingProjects } =
    useRecentProjects(authInfo);
  const userQuery = useUserInfo(authInfo);

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
        projects={recentProjects || []}
        queryKey={["projects", authInfo?.team, "recent"]}
        onProjectPress={handleProjectPress}
        isLoading={isLoadingProjects}
      />
    </View>
  );
}
