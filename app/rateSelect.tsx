import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Heroicons
import {
  CubeIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from "react-native-heroicons/solid";

import { useAuth } from "@/components/context/AuthContext";
import { Rate } from "@/lib/expense";
import { useRates } from "@/services/queries/rates";

export default function RateSelectScreen() {
  const { authInfo } = useAuth();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { data: rates, isLoading, error, refetch } = useRates(authInfo);

  const handleRateSelect = (rate: Rate) => {
    router.push({
      pathname: "/expenseDetails",
      params: {
        rate: JSON.stringify(rate),
        projectId: projectId || "",
      },
    });
  };

  const handleCancel = () => router.back();

  // Pick Heroicon by type
  const getRateTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "labor":
        return UserIcon;
      case "equipment":
        return WrenchScrewdriverIcon;
      case "other":
        return CubeIcon;
      default:
        return QuestionMarkCircleIcon;
    }
  };

  const renderRateItem = ({ item }: { item: Rate }) => {
    const Icon = getRateTypeIcon(item.type);
    return (
      <TouchableOpacity
        onPress={() => handleRateSelect(item)}
        className="mb-3 rounded-xl border border-primary-border bg-white p-4"
      >
        <View className="relative flex-row items-center">
          <View
            className="mr-3 h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: getRateTypeColor(item.type) }}
          >
            <Icon size={16} color="white" />
          </View>

          <View className="flex-1">
            <Text className="text-sm font-medium uppercase tracking-tight text-primary-font/40">
              {item.type}
            </Text>
            <Text className="text-lg font-semibold text-primary-font">
              {item.description}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-lg font-bold text-primary-font">
              ${item.price}
            </Text>
            <Text className="text-sm text-primary-font/40">
              per {item.unit}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#5e8a5e" />
        <Text className="mt-4 text-base text-neutral-500 dark:text-neutral-400">
          Loading rates...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 p-8 dark:bg-neutral-900">
        <ExclamationTriangleIcon size={48} color="#EF4444" />
        <Text className="mt-4 text-center text-base text-neutral-500 dark:text-neutral-400">
          Failed to load rates
        </Text>
        <TouchableOpacity
          onPress={() => refetch?.()}
          className="mt-4 rounded-lg bg-[#5e8a5e] px-6 py-3"
        >
          <Text className="text-base font-semibold text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-secondary-bg">
      {/* Header */}
      <View className="modal-header">
        <TouchableOpacity onPress={handleCancel} className="py-2">
          <Text className="text-base text-white">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-white">Select Rate</Text>
        <View className="w-[60px]" />
      </View>

      {/* Rates List */}
      <FlatList
        data={rates}
        renderItem={renderRateItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const getRateTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "labor":
      return "#00524C";
    case "equipment":
      return "#8A532F";
    case "other":
      return "#003A5D";
    default:
      return "#d7d7d7";
  }
};
