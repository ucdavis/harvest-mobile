import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CubeIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  WrenchScrewdriverIcon,
  XCircleIcon,
} from "react-native-heroicons/outline";

import { Rate } from "@/lib/expense";

type RatesListProps = {
  rates: Rate[];
  queryKey: (string | undefined)[];
  onRatePress: (rate: Rate) => void;
  isLoading?: boolean;
  error?: Error | null;
};

export function RatesList({
  rates,
  queryKey,
  onRatePress,
  isLoading = false,
  error,
}: RatesListProps) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter rates based on search term
  const filteredRates = useMemo(() => {
    if (!rates) return [];
    if (!searchTerm.trim()) return rates;

    const q = searchTerm.toLowerCase();

    return rates.filter(
      (r) =>
        String(r.description).toLowerCase().includes(q) ||
        String(r.type).toLowerCase().includes(q) ||
        String(r.unit).toLowerCase().includes(q) ||
        String(r.price).toLowerCase().includes(q)
    );
  }, [rates, searchTerm]);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries({
      queryKey,
    });
    setRefreshing(false);
  };

  const handleRatePress = (rate: Rate) => {
    onRatePress(rate);
  };

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

  const renderRateItem = ({ item }: { item: Rate }) => {
    const Icon = getRateTypeIcon(item.type);
    return (
      <TouchableOpacity activeOpacity={0.7}
        onPress={() => handleRatePress(item)}
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
            <Text className="tertiary-label uppercase">
              {item.type}
            </Text>
            <Text className="text-lg font-semibold text-primary-font">
              {item.description}
            </Text>
          </View>

          <View className="items-end">

            <Text className="tertiary-label text-right">
              {item.unit}
            </Text>
            <Text className="text-lg font-semibold text-primary-font">
              ${item.price}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <View className="flex-1">
        {/* Search Bar */}
        <View className="flex-row items-center p-4 bg-white border-b border-primary-border">
          <MagnifyingGlassIcon size={20} color="#a0a0a0" />
          <TextInput
            className="flex-1 text-lg mx-2 text-primary-font"
            placeholder="Search rates, types, or units…"
            placeholderTextColor="#a0a0a0"
            value={searchTerm}
            onChangeText={setSearchTerm}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm("")} className="p-1">
              <XCircleIcon size={24} color="#a0a0a0" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#5e8a5e" />
          <Text className="mt-4 text-base text-neutral-500 dark:text-neutral-400">
            Loading rates...
          </Text>
        </View>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <ExclamationTriangleIcon size={48} color="#EF4444" />
        <Text className="mt-4 text-center text-base text-neutral-500 dark:text-neutral-400">
          Failed to load rates
        </Text>
        <TouchableOpacity
          onPress={() => queryClient.refetchQueries({ queryKey })}
          className="mt-4 rounded-lg bg-[#5e8a5e] px-6 py-3"
        >
          <Text className="text-base font-semibold text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Search Bar */}
      <View className="flex-row items-center p-4 bg-white border-b border-primary-border">
        <MagnifyingGlassIcon size={20} color="#a0a0a0" />
        <TextInput
          className="flex-1 text-lg mx-2 text-primary-font"
          placeholder="Search rates, types, or units…"
          placeholderTextColor="#a0a0a0"
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm("")} className="p-1">
            <XCircleIcon size={24} color="#a0a0a0" />
          </TouchableOpacity>
        )}
      </View>

      {/* Counter */}
      {searchTerm.length > 0 && (
        <View className="items-center mb-2">
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            {filteredRates.length} result
            {filteredRates.length !== 1 ? "s" : ""} found
          </Text>
        </View>
      )}

      {/* Rates List Content */}
      {filteredRates.length > 0 ? (
        <View className="px-4 flex-1">
          <FlatList
            data={filteredRates}
            renderItem={renderRateItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 88 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      ) : searchTerm.length > 0 ? (
        <View className="items-center justify-center py-16 px-5">
          <MagnifyingGlassIcon size={80} color="#808080" />
          <Text className="text-lg font-semibold mt-4 text-center text-neutral-800 dark:text-neutral-200">
            No rates found
          </Text>
          <Text className="text-sm mt-2 text-center text-neutral-500 dark:text-neutral-400">
            Try adjusting your search terms
          </Text>
        </View>
      ) : (
        <View className="items-center justify-center py-16 px-5">
          <WrenchScrewdriverIcon size={80} color="#808080" />
          <Text className="text-lg font-semibold mt-4 text-center text-neutral-800 dark:text-neutral-200">
            No rates available
          </Text>
          <Text className="text-sm mt-2 text-center text-neutral-500 dark:text-neutral-400">
            Contact your administrator
          </Text>
        </View>
      )}
    </View>
  );
}
