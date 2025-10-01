import { Text, View } from "react-native";

type ProjectCardProps = {
  id: number; // internal ID, just a number
  projectName: string;
  piName?: string; // PI name

};

export function ProjectInfo({
  id,
  projectName,
  piName,

}: ProjectCardProps) {


  return (
    <View
      className="mb-4 rounded-md border border-primaryborder bg-white overflow-hidden"

    >

      <View className="px-4 py-2 flex-row items-center justify-between border-l-harvest border-l-8">
        <View className="flex-1 pr-3">

          {id ? (
            <Text className="text-xs tracking-tight font-bold uppercase text-primaryfont/40">
              {id}
            </Text>
          ) : null}


          <Text
            className="text-xl tracking-tight font-semibold text-harvest max-w-[80%]"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {projectName}
          </Text>

          {piName ? (
            <Text
              className="text-base font-medium"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              PI: {piName}
            </Text>
          ) : null}
        </View>


      </View>
    </View>
  );
}
