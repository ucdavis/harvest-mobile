import { useAuth } from "@/components/context/AuthContext";
import { useRecentRates } from "@/services/queries/rates";
import { useQueryClient } from "@tanstack/react-query";
import { useUserInfo } from "@/services/queries/users";
import { useEffect, useMemo, useState } from "react";
import { setUser } from "@sentry/react-native";
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
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon
} from "react-native-heroicons/outline";

import { RateTypeIcon, getRateTypeColor } from "@/components/ui/rateType";
import { Rate } from "@/lib/expense";
import { XMarkIcon } from "react-native-heroicons/solid";

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

  const [filtersOpen, setFiltersOpen] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { authInfo } = useAuth();
  const [showRecent, setShowRecent] = useState(false);

  const userQuery = useUserInfo(authInfo);
  const { data: recentRates } = useRecentRates(authInfo);

  const showRecentButton = recentRates && recentRates.length > 0;

    useEffect(() => {
        // whenever the user info changes, update sentry
        if (userQuery?.data?.user) {
          setUser({
            id: userQuery.data.user.id,
            email: userQuery.data.user.email,
            team: userQuery.data.teamSlug,
          });
        }
      }, [userQuery.data]);

    useEffect(() => {
    if (selectedType) {
      setShowRecent(false);
    }
  }, [selectedType]);


  const uniqueTypes = useMemo(() => {
    const set = new Set<string>();
    (rates ?? []).forEach((r) => set.add(String(r.type)));
    return Array.from(set);
  }, [rates]);


  const filteredRates = useMemo(() => {
    if (!rates) return [];
    const q = searchTerm.trim().toLowerCase();

    return rates.filter((r) => {
      const matchesSearch =
        !q ||
        String(r.description).toLowerCase().includes(q) ||
        String(r.type).toLowerCase().includes(q) ||
        String(r.unit).toLowerCase().includes(q) ||
        String(r.price).toLowerCase().includes(q);

      const matchesType = !selectedType || String(r.type) === selectedType;

      return matchesSearch && matchesType;
    });
  }, [rates, searchTerm, selectedType]);

  const ratesToShow = useMemo(() => {
  if (showRecent && recentRates) {
    return recentRates;
  }
  return filteredRates;
}, [showRecent, recentRates, filteredRates]);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries({ queryKey });
    setRefreshing(false);
  };

  const handleRatePress = (rate: Rate) => {
    onRatePress(rate);
  };

  const renderRateItem = ({ item }: { item: Rate }) => {
    const bg = getRateTypeColor(item.type as any);
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleRatePress(item)}
        className="mb-3 rounded-xl border border-primary-border bg-white p-4"
      >
        <View className="relative flex-row items-center">
          <View
            className="mr-3 h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: bg }}
          >
            <RateTypeIcon type={item.type as any} size={16} colorOverride="white" />
          </View>

          <View className="flex-1">
            <Text className="tertiary-label uppercase">{item.type}</Text>
            <Text className="text-lg font-semibold text-primary-font">
              {item.description}
            </Text>
          </View>

          <View className="items-end">
            <Text className="tertiary-label text-right">{item.unit}</Text>
            <Text className="text-lg font-semibold text-primary-font">
              ${item.price}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Shared Search Bar with Filters toggle
  const SearchBar = (
    <>
      <View className="flex-row items-center px-4 h-14 bg-white border-b border-primary-border">
        <MagnifyingGlassIcon size={20} color="#a0a0a0" />
        <TextInput
          className="flex-1 text-lg leading-6 mx-2 text-primary-font"
          placeholder="Search rates, types, or units…"
          placeholderTextColor="#a0a0a0"
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"

        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchTerm("")}
            className="p-1 mr-1"
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <XMarkIcon size={20} color="#a0a0a0" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => setFiltersOpen((v) => !v)}
          className="p-1"
          accessibilityRole="button"
          accessibilityLabel={filtersOpen ? "Hide filters" : "Show filters"}
        >
          <AdjustmentsHorizontalIcon
            size={24}
            color={filtersOpen || selectedType ? "#266041" : "#a0a0a0"}
          />
        </TouchableOpacity>
      </View>

      {/* Collapsible filter chips row */}
      {filtersOpen && (
        <View className="bg-white border-b border-primary-border px-4 py-3">
          <View className="flex-row flex-wrap">
            {uniqueTypes.map((t) => {
              const isActive = selectedType === t;
              const tint = getRateTypeColor(t as any);
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSelectedType(isActive ? null : t)}
                  className="mr-2 rounded-full border px-3 py-2"
                  style={{
                    borderColor: isActive ? tint : "#e5e7eb",
                    backgroundColor: isActive ? "#f3f4f6" : "#ffffff",
                  }}
                >
                  <View className="flex-row items-center">
                    <RateTypeIcon
                      type={t as any}
                      size={14}
                      colorOverride={isActive ? String(tint) : "#a0a0a0"}
                    />
                    <Text
                      className="ml-1 text-sm font-medium"
                      style={{ color: isActive ? tint : "#4b5563" }}
                    >
                      {t}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            {showRecentButton && (
          <TouchableOpacity
            onPress={() => {
              setSelectedType(null);
              setShowRecent(true);
            }}
            className="mr-2 rounded-full border px-3 py-2"
            style={{
              borderColor: showRecent ? "#000000" : "#e5e7eb",
              backgroundColor: showRecent ? "#f3f4f6" : "#ffffff",
            }}
          >
            <View className="flex-row items-center">
              <RateTypeIcon type="recent" size={14}/>
              <Text className="ml-1 text-sm font-medium" >
                Recent
              </Text>
            </View>
          </TouchableOpacity>
        )}

            {(selectedType || showRecent) && (
              <TouchableOpacity
                onPress={() => {setSelectedType(null); setShowRecent(false);}}
                className="mr-2 rounded-full border border-primary-border px-3 py-2"
                accessibilityRole="button"
                accessibilityLabel="Clear filter"
              >
                <Text className="text-sm text-primary-font/80">Clear</Text>
</TouchableOpacity> 
            )}
          </View>
        </View>
      )}      
    </>
  );

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1">
        {SearchBar}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#266041" />
          <Text className="mt-4 text-base text-primary-font/80">
            Loading rates...
          </Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <ExclamationTriangleIcon size={48} color="#79242F" />
        <Text className="mt-4 text-center text-base text-primary-font/80">
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

  // Normal state
  return (
    <View className="flex-1">
      {SearchBar}

      {/* Counter */}
      {(searchTerm.length > 0 || selectedType || showRecent) && (
        <View className="items-center mt-2">
          <Text className="text-sm text-primary-font/80">
            {ratesToShow.length} result
            {ratesToShow.length !== 1 ? "s" : ""} found
            {selectedType ? ` • filtered by ${selectedType}` : ""}
            {showRecent ? ` • filtered by recent` : ""}
          </Text>
        </View>
      )}

      {/* Rates List Content */}
      {ratesToShow.length > 0 ? (
        <View className="px-4 flex-1">
          <FlatList
            data={ratesToShow}
            renderItem={renderRateItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 88 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      ) : searchTerm.length > 0 || selectedType || showRecent? (
        <View className="items-center justify-center py-16 px-5">
          <MagnifyingGlassIcon size={80} color="#a0a0a0" />
          <Text className="text-lg font-semibold mt-4 text-center text-primary-font/40">
            No rates found
          </Text>
          <Text className="text-sm mt-2 text-center text-primary-font/40">
            Try adjusting your search terms or filters
          </Text>
        </View>
      ) : (
        <View className="items-center justify-center py-16 px-5">
          <WrenchScrewdriverIcon size={80} color="#a0a0a0" />
          <Text className="text-lg font-semibold mt-4 text-center text-primary-font/40">
            No rates available
          </Text>
          <Text className="text-sm mt-2 text-center text-primary-font/40">
            Contact your administrator
          </Text>
        </View>
      )}
    </View>
  );
}
