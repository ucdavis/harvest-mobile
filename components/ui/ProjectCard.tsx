// components/ProjectCard.tsx
import { Text, TouchableOpacity, View } from "react-native";
import { PencilSquareIcon } from "react-native-heroicons/outline";

type ProjectCardProps = {
  projectId: string;     // e.g. "AE-12234"
  piName?: string;       // e.g. "Brian McEligot"
  years?: string;        // e.g. "2026–2029"
  onEdit?: () => void;
  onPress?: () => void;
};

export function ProjectCard({
  projectId,
  piName,
  years,
  onEdit,
  onPress,
}: ProjectCardProps) {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      className="mb-4 rounded-md border border-primary-border bg-white overflow-hidden shadow-sm android:elevation-2"
      {...(onPress ? { onPress, activeOpacity: 0.7 } : {})}
    >
      <View className="p-3 pb-2 flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-[10px] tracking-tight font-semibold uppercase text-primary-font/40">
            Project ID
          </Text>

          <Text
            className="text-2xl tracking-tight font-medium text-harvest mt-1 max-w-[80%]"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {projectId}
          </Text>
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

      {(piName || years) ? (
        <View className="bg-harvest/10 px-3 py-2 flex-row items-center border-t border-primary-border justify-between">
          <Text className="text-sm font-semibold" numberOfLines={1} ellipsizeMode="tail">
            {piName ? `PI: ${piName}` : ""}
          </Text>
          {years ? (
            <Text className="text-sm font-semibold" numberOfLines={1} ellipsizeMode="tail">
              {years}
            </Text>
          ) : <View className="w-2" />}
        </View>
      ) : null}
    </CardWrapper>
  );
}
