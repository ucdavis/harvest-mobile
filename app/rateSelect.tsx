import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/components/context/AuthContext";
import { RatesList } from "@/components/rates/RatesList";
import { Rate } from "@/lib/expense";
import { useRates } from "@/services/queries/rates";

export default function RateSelectScreen() {
  const { authInfo } = useAuth();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { data: rates, isLoading, error } = useRates(authInfo);

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
      <RatesList
        rates={rates || []}
       queryKey={["rates", authInfo?.team]}
        onRatePress={handleRateSelect}
        isLoading={isLoading}
        error={error}
      />
    </View>
  );
}
