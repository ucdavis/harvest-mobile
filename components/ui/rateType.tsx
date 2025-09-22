// /components/RateType.tsx
import React, { memo } from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import {
  CubeIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from "react-native-heroicons/solid";

type RateType = "labor" | "equipment" | "other";

type IconComp = React.ComponentType<{ size?: number; color?: string }>;

const ICONS: Record<RateType, IconComp> = {
  labor: UserIcon,
  equipment: WrenchScrewdriverIcon,
  other: CubeIcon,
};

const COLORS: Record<RateType, string> = {
  labor: "#00524C",
  equipment: "#8A532F",
  other: "#003A5D",
};

const DEFAULT_ICON = QuestionMarkCircleIcon;
const DEFAULT_COLOR = "#d7d7d7";

export function getRateTypeColor(type: string) {
  const key = (type ?? "").toLowerCase() as RateType;
  return COLORS[key] ?? DEFAULT_COLOR;
}

export function getRateTypeIcon(type: string): IconComp {
  const key = (type ?? "").toLowerCase() as RateType;
  return ICONS[key] ?? DEFAULT_ICON;
}

type RateTypeIconProps = {
  type: string;
  size?: number;
  colorOverride?: string; // optional manual tint
};

export const RateTypeIcon = memo(({ type, size = 20, colorOverride }: RateTypeIconProps) => {
  const Icon = getRateTypeIcon(type);
  const color = colorOverride ?? getRateTypeColor(type);
  return <Icon size={size} color={color} />;
});

type RateTypeBadgeProps = {
  type: string;
  label?: string;           // defaults to capitalized type
  size?: number;            // icon size
  style?: ViewStyle;
  labelStyle?: TextStyle;
};

export const RateTypeBadge = memo(
  ({ type, label, size = 18, style, labelStyle }: RateTypeBadgeProps) => {
    const color = getRateTypeColor(type);
    const Icon = getRateTypeIcon(type);
    const text = label ?? (type ? type[0].toUpperCase() + type.slice(1).toLowerCase() : "Unknown");

    return (
      <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
        <Icon size={size} color={color} />
        <Text style={[{ marginLeft: 6, color, fontWeight: "600" }, labelStyle]}>{text}</Text>
      </View>
    );
  }
);
