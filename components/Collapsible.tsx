import { Colors } from "@/constants/Colors";
import { tx } from "@/lib/i18n";
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
        accessibilityLabel={`${title} ${
          isOpen
            ? tx("components.ui.collapsibleCollapse")
            : tx("components.ui.collapsibleExpand")
        }`}
      >
        <View
          className="mr-1"
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        >
          <ChevronRightIcon size={18} color={Colors.icon} />
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
