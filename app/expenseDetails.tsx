import { router, useLocalSearchParams, useSegments } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { ExclamationTriangleIcon } from "react-native-heroicons/solid";

import { useExpenses } from "@/components/context/ExpenseContext";
import { createExpenseWithUniqueId, Rate } from "@/lib/expense";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getRateTypeColor, RateTypeIcon } from "@/components/ui/rateType";
import { Colors } from "@/constants/Colors";
import { usePathname } from "expo-router";

export default function ExpenseDetailsScreen() {
  const { rate: rateParam, projectId, projectName, piName } = useLocalSearchParams<{
    rate: string;
    projectId: string;
    projectName: string;
    piName: string;
  }>();

  // Parse the rate from URL params
  let rate: Rate | null = null;
  try {
    rate = rateParam ? JSON.parse(rateParam) : null;
  } catch {
    rate = null;
  }
  const { addExpense } = useExpenses();

  // for positioning submit button
  const insets = useSafeAreaInsets();


  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const handleQuantityChange = (value: string) => {
    // Allow empty string for clearing the input
    if (value === "") {
      setQuantity("");
      return;
    }

    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return; // Don't update if multiple decimal points
    }

    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      return; // Don't update if more than 2 decimal places
    }

    // Prevent leading zeros before decimal (except single 0)
    if (parts[0].length > 1 && parts[0].startsWith("0") && parts.length === 1) {
      return;
    }

    setQuantity(numericValue);
  };
  const quantityInputRef = useRef<TextInput>(null);
const pathname = usePathname();

useEffect(() => {
  console.log("📍 Current page:", pathname);
}, [pathname]);
  // Focus on quantity input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      quantityInputRef.current?.focus();
    }, 100); // Small delay to ensure the component is fully mounted

    return () => clearTimeout(timer);
  }, []);

  // rate needs to be other and passthrough, but all passthrough rates are other so just check that
  const showDescriptionInput = rate?.isPassthrough || false;

  const handleCancel = () => {
    router.back();
  };

  const segments = useSegments();

  const handleConfirm = () => {
    const numericQuantity = parseFloat(quantity);

    if (!quantity.trim() || isNaN(numericQuantity) || numericQuantity <= 0) {
      Alert.alert(
        "Invalid Quantity",
        "Please enter a valid quantity greater than 0."
      );
      return;
    }

    if (!rate) {
      Alert.alert("Error", "Rate information is missing.");
      return;
    }

    if (showDescriptionInput && !description.trim()) {
      Alert.alert(
        "Description Required",
        "Please enter a description for this expense (required for passthrough)."
      );
      return;
    }

    // Create the new expense
    const newExpense = createExpenseWithUniqueId({
      type: rate.type,
      activity: "", // activity will be set in addExpenses screen
      description: description || rate.description,
      price: rate.price,
      quantity: numericQuantity,
      projectId: Number(projectId),
      rateId: rate.id,
      rate,
    });

    // Add expense to context
    addExpense(newExpense);

    if (segments.length > 2) {

    router.dismiss(); // dismiss expenseDetails modal
    router.dismiss(); // dismiss rateSelect modal
  } else {
    // You're in Dashboard → ExpenseDetails
    router.replace({
    pathname: "/addExpenses",
    params: {
      projectId,
      projectName,
      piName,
   
    },
  });
  }


};

  const getTotalCost = () => {
    const numericQuantity = parseFloat(quantity) || 0;
    return (numericQuantity * (rate?.price || 0)).toFixed(2);
  };

  if (!rate) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8f9fa] p-8">
        <ExclamationTriangleIcon size={48} color={Colors.merlot} />
        <Text className="mt-4 text-base text-neutral-600 text-center">
          Rate information is missing
        </Text>
        <TouchableOpacity
          className="mt-4 bg-[#5e8a5e] px-6 py-3 rounded-lg"
          onPress={handleCancel}
        >
          <Text className="text-white text-base font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-secondarybg"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >

      <Pressable className="flex-1 bg-secondarybg" onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1">

            <View className="modal-header">
              <TouchableOpacity onPress={handleCancel}>
                <Text className="text-base text-white">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-xl font-semibold text-white">
                Expense Details
              </Text>
              <View className="w-[60px]" />
            </View>
            <View className="flex-1">
              <View
                className="bg-white p-4 mb-2 border-b-2"
                style={{ borderColor: getRateTypeColor(rate.type) }}
              >
                <View className="flex-row items-center">
                  <View
                    className="mr-3 h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: getRateTypeColor(rate.type) }}
                  >

                    <RateTypeIcon type={rate.type} colorOverride="white" size={16} />
                  </View>
                  <View className="flex-1">
                    <Text className="tertiary-label uppercase">
                      {rate.type}
                    </Text>
                    <Text className="text-lg font-semibold text-primaryfont">
                      {rate.description}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="tertiary-label text-right">
                      {rate.unit}
                    </Text>
                    <Text className="text-lg font-bold text-primaryfont">
                      ${rate.price}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="px-4 py-2">
                {/* Quantity Input */}
                <View className="mb-4">
                  <Text className="text-[12px] font-semibold text-neutral-500 tracking-tight mb-2">
                    Quantity ({rate.unit})
                  </Text>
                  <TextInput
                    ref={quantityInputRef}
                    className="bg-white rounded-lg p-2 text-[18px] font-semibold border border-primaryborder text-center"
                    value={quantity}
                    onChangeText={handleQuantityChange}
                    placeholder="0.00"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    selectTextOnFocus

                  />
                </View>

                {/* Description Input */}
                {showDescriptionInput && (
                  <View className="mb-6">
                    <Text className="text-sm font-semibold text-primaryfont/60 tracking-tight mb-2">
                      Description (required for passthrough)
                    </Text>
                    <TextInput
                      className="bg-white rounded-lg p-4 text-base border border-primaryborder min-h-[80px]"
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Enter description (required)"
                      placeholderTextColor="#999"
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* spacer to keep bottom bar pinned */}
          <View className="flex-1" />
        </ScrollView>
        {/* sticky bottom bar outside of the scroll view */}
        <View className="px-5 py-2 flex-row items-end justify-between">
          <Text className="text-lg font-semibold text-harvest">
            {projectName}
          </Text>
          <Text className="text-sm uppercase font-bold text-primaryfont/40 tracking-tight">
            # {projectId}
          </Text>
        </View>
        <View
          style={{ paddingBottom: (insets.bottom || 12) + 12 }}
          className="border-t border-primaryborder bg-white px-2 pt-1"
        >

          <View className="px-4 py-2 flex-row items-center justify-between mb-5">
            <View>

              <Text className="text-base font-semibold text-primaryfont/40 text-start">
                {quantity || "0"} {rate.unit} × ${rate.price}
              </Text>
              <Text
                className="text-lg font-extrabold text-harvest"

              >
                ${getTotalCost()}
              </Text>
            </View>

            <TouchableOpacity
              className="harvest-button w-[55%]"
              onPress={handleConfirm}
            >
              <Text className="harvest-button-text">Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Pressable>

    </KeyboardAvoidingView>
  );
}
