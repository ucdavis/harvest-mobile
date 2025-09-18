import { Text, TouchableOpacity, View } from "react-native";
import { PencilSquareIcon } from "react-native-heroicons/outline";

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
      className="mb-4 rounded-md border border-primary-border bg-white overflow-hidden"
      {...(onPress ? { onPress, activeOpacity: 0.7 } : {})}
    >
      {/* Header row */}
      <View className="px-4 py-2 flex-row items-center justify-between border-l-harvest border-l-8">
        <View className="flex-1 pr-3">
          {/* Show ID here */}
          {id ? (
            <Text className="text-xs tracking-tight font-bold uppercase text-primary-font/40">
              {id}
            </Text>
          ) : null}

          {/* Show human-readable project code */}
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

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Edit project"
          onPress={onEdit}
          className="p-2 rounded-lg active:bg-harvest/15"
        >
          <PencilSquareIcon size={28} color="#266041" />
        </TouchableOpacity>
      </View>
    </CardWrapper>
  );
}
