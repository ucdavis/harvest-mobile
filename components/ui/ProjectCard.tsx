import { Colors } from "@/constants/Colors";
import { Text, TouchableOpacity, View } from "react-native";
import { PlusCircleIcon } from "react-native-heroicons/outline";
import { UserIcon } from "react-native-heroicons/solid";

type ProjectCardProps = {
  id: number; // internal ID, just a number
  projectName: string;
  piName?: string; // PI name
  onEdit?: () => void;
  onPress?: () => void;
};

export function ProjectCard({
  id,
  projectName,
  piName,
  onEdit,
  onPress,
}: ProjectCardProps) {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      className="mb-4 rounded-md border border-primaryborder bg-white overflow-hidden"
      {...(onPress ? { onPress, activeOpacity: 0.7 } : {})}
    >

      <View className="px-4 py-2 flex-row items-center justify-between">
        <View className="flex-1 pr-3">

          {id ? (
            <Text className="text-xs tracking-tight font-bold uppercase text-primaryfont/70">
              # {id}
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
              <UserIcon size={12} color={Colors.primaryfont} /> {piName}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Edit project"
          onPress={onEdit}
          className="p-2 rounded-lg active:bg-harvest/15"
        >
          <PlusCircleIcon size={28} color={Colors.harvest} />
        </TouchableOpacity>
      </View>
    </CardWrapper>
  );
}
