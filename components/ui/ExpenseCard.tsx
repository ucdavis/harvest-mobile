import { Colors } from "@/constants/Colors";
import { Text, TouchableOpacity, View } from "react-native";
import { PlusCircleIcon, UserIcon } from "react-native-heroicons/solid";

type ExpenseCardProps = {
  uniqueId: string;
  rateName: string; 
  type: string; 
  projectName: string;
  onPress?: () => void;
};

export function ExpenseCard({
  uniqueId,
  rateName, 
  type,
  projectName,
  onPress,
}: ExpenseCardProps) {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      className="mb-4 rounded-md border border-primaryborder bg-white overflow-hidden"
      {...(onPress ? { onPress, activeOpacity: 0.7 } : {})}
    >

      <View className="px-4 py-2 flex-row items-center justify-between border-l-harvest border-l-8">
        <View className="flex-1 pr-3">

          {type ? (
            <Text className="text-xs tracking-tight font-bold uppercase text-primaryfont/40">
               {type}
            </Text>
          ) : null}


          <Text
            className="text-xl tracking-tight font-semibold text-harvest max-w-[80%]"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {rateName}
          </Text>

          {projectName ? (
            <Text
              className="text-base font-medium"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              <UserIcon size={12} color={Colors.primaryfont} /> {projectName}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Edit project"
          onPress={onPress} // add the route here maybe 
          className="p-2 rounded-lg active:bg-harvest/15"
        >
        </TouchableOpacity>
      </View>
    </CardWrapper>
  );
}
