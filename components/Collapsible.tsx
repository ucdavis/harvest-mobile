import { PropsWithChildren, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";

type CollapsibleProps = PropsWithChildren & { title: string };

export function Collapsible({ children, title }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        className="flex-row items-center gap-1.5"
        onPress={() => setIsOpen((v) => !v)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`${title} ${isOpen ? "collapse" : "expand"}`}
      >
        <View
          className="mr-1"
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        >
          <ChevronRightIcon size={18} color="#9BA1A6" />
        </View>
        <Text className="text-base font-semibold text-primaryfont">
          {title}
        </Text>
      </TouchableOpacity>

      {isOpen ? (
        <View className="mt-1.5 ml-6">
          {children}
        </View>
      ) : null}
    </View>
  );
}
