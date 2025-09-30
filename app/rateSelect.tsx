import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

import { useAuth } from "@/components/context/AuthContext";
import { RatesList } from "@/components/rates/RatesList";
import { Rate } from "@/lib/expense";
import { useRates } from "@/services/queries/rates";

export default function RateSelectScreen() {
  const { authInfo } = useAuth();
  const { projectId, projectName } = useLocalSearchParams<{ projectId: string; projectName: string; }>();
  const { data: rates, isLoading, error } = useRates(authInfo);

  const handleRateSelect = (rate: Rate) => {
    router.push({
      pathname: "/expenseDetails",
      params: {
        rate: JSON.stringify(rate),
        projectId: projectId || "",
        projectName,

      },
    });
  };

  const handleCancel = () => router.back();

  return (
    <View className="flex-1 bg-secondarybg">

      {/* <View className="modal-header">
        <TouchableOpacity onPress={handleCancel}>
          <Text className="text-base text-white">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-white">Select Rate</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/qrScan", params: { projectId: projectId || "" } })
          }
        >
          <Text className="text-base text-white">QR Scan</Text>
        </TouchableOpacity>
      </View> */}

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
