import { ProjectCard } from "@/components/ui/ProjectCard";
import { TeamChooser } from "@/components/ui/TeamChooser";
import { ScrollView, View } from "react-native";

export default function RecentProjectsScreen() {
  return (
    <ScrollView stickyHeaderIndices={[0]} className="flex-1 flex-col">

      <TeamChooser onClose={() => console.log("Team chooser closed")} />


      <View className="p-4">
        <ProjectCard
          id="proj-001"
          projectId="AE-12234"
          piName="Brian McEligot"
          onEdit={() => console.log("edit pressed")}
        />
        <ProjectCard
          id="proj-002"
          projectId="AE-27366 Corn Trials 2025"
          piName="Brian McEligot"
          onEdit={() => console.log("edit pressed")}
        />
      </View>
    </ScrollView>
  );
}
