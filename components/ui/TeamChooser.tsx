import { Colors } from "@/constants/Colors";
import { tx } from "@/lib/i18n";
import { Text, TouchableOpacity, View } from "react-native";
import { ChevronUpDownIcon } from "react-native-heroicons/solid";
import { useAuth } from "../context/AuthContext";

type TeamChooserProps = {
  onClose?: () => void;
};

export function TeamChooser({ onClose }: TeamChooserProps) {
  const { authInfo } = useAuth();
  return (
    <View className="bg-white border-b border-primaryborder px-6 py-2 flex flex-row items-center justify-between">
      <Text className="text-primaryfont/80 uppercase text-base font-bold">
        {tx("components.ui.teamLabel", { team: authInfo?.team ?? "" })}
      </Text>
      {onClose && (
        <TouchableOpacity onPress={onClose} className="p-1">
          <ChevronUpDownIcon size={24} color={Colors.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
}
