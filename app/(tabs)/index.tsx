import { ProjectCard } from "@/components/ui/ProjectCard";
import { Image, View } from "react-native";




export default function RecentProjectsScreen() {
  return (
    <>
      <View className="main">

        <ProjectCard
          projectId="AE-12234"
          piName="Brian McEligot"
          years="2026–2029"
          onEdit={() => console.log("edit pressed")}
        />
        <ProjectCard
          projectId="AE-27366 Corn Trials 2025"
          piName="Brian McEligot"
          years="2025"
          onEdit={() => console.log("edit pressed")}
        />

        <Image
          className="w-[175px] self-center mt-auto mb-16 opacity-50"
          resizeMode="contain"
          source={require("../../assets/images/caes-logo.png")}
        />


      </View>




    </>
  );
}

