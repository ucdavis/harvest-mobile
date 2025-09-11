import { Text, TouchableOpacity, View } from "react-native";
import { ChevronUpDownIcon } from "react-native-heroicons/solid";
import { useAuth } from "../context/AuthContext";

type TeamChooserProps = {
  onClose?: () => void;
};

export function TeamChooser({ onClose }: TeamChooserProps) {
  const { authInfo } = useAuth();
  return (
    <View className="bg-white border-b border-primary-border px-6 py-2 flex flex-row items-center justify-between">
      <Text className="text-primary-font/80 uppercase text-base font-bold">
        Team: {authInfo?.team}
      </Text>
      {onClose && (
        <TouchableOpacity onPress={onClose} className="p-1">
          <ChevronUpDownIcon size={24} color="#a0a0a0" />
        </TouchableOpacity>
      )}
    </View>
  );
}
