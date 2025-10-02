import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { View } from "react-native";

import { useAuth } from "@/components/context/AuthContext";
import { useExpenses } from "@/components/context/ExpenseContext";
import { RatesList } from "@/components/rates/RatesList";
import { Rate } from "@/lib/expense";
import { useRates } from "@/services/queries/rates";

export default function RateSelectScreen() {
  const { authInfo } = useAuth();
  const { scannedRateId, setScannedRateId } = useExpenses();
  const { projectId, projectName } = useLocalSearchParams<{
    projectId: string;
    projectName: string;
  }>();
  const { data: rates, isLoading, error } = useRates(authInfo);

  const handleRateSelect = useCallback(
    (rate: Rate) => {
      router.push({
        pathname: "/expenseDetails",
        params: {
          rate: JSON.stringify(rate),
          projectId: projectId || "",
          projectName,
        },
      });
    },
    [projectId, projectName]
  );

  // Handle scanned rate ID
  useEffect(() => {
    if (scannedRateId && rates) {
      const scannedRate = rates.find(
        (rate) => rate.id.toString() === scannedRateId
      );
      if (scannedRate) {
        // Clear the scanned rate ID to prevent re-triggering
        setScannedRateId(null);
        handleRateSelect(scannedRate);
      } else {
        console.warn(
          `Scanned rate ID ${scannedRateId} not found in available rates`
        );
        // Clear the invalid scanned rate ID
        setScannedRateId(null);
      }
    }
  }, [scannedRateId, rates, handleRateSelect, setScannedRateId]);

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
