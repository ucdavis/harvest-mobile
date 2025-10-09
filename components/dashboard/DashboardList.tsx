import { useAuth } from "@/components/context/AuthContext";
import { useRecentProjects } from "@/services/queries/projects";
import { useRecentExpenses, getRecentExpenseCardInfo } from "@/services/queries/expenses";
import { useScannedProjectHandler } from "@/hooks/useScannedProjectHandler";
import { useUserInfo } from "@/services/queries/users";
import { setUser } from "@sentry/react-native";
import { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ExpenseCardInfo } from "@/lib/expense";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ExpenseCard } from "@/components/ui/ExpenseCard";

export function DashboardList() {
  const router = useRouter();
  const { authInfo } = useAuth();
  const { handleProjectPress } = useScannedProjectHandler({ isEnabled: true });
  const userQuery = useUserInfo(authInfo);

  const {
    data: recentProjects,
    refetch: refetchProjects,
  } = useRecentProjects(authInfo);

  const {
    data: recentExpenses,
    refetch: refetchExpenses,
  } = useRecentExpenses(authInfo);

  const [expensesData, setExpensesData] = useState<ExpenseCardInfo[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (recentExpenses) {
      getRecentExpenseCardInfo(recentExpenses, authInfo).then(setExpensesData);
    }
  }, [recentExpenses]);

  useEffect(() => {
    if (userQuery?.data?.user) {
      setUser({
        id: userQuery.data.user.id,
        email: userQuery.data.user.email,
        team: userQuery.data.teamSlug,
      });
    }
  }, [userQuery.data]);

  const normalizedProjects = useMemo(
    () =>
      (recentProjects || []).map((p) => ({
        ...p,
        projectName: p.name ?? p.name ?? "Unnamed Project",
      })),
    [recentProjects]
  );

  const listData = useMemo(() => {
    const items: any[] = [];

    if (normalizedProjects.length) {
      items.push({ header: "Recent Projects" });
      normalizedProjects.forEach((p) =>
        items.push({ type: "project", data: p })
      );
    }

    if (expensesData.length) {
      items.push({ header: "Recent Expenses" });
      expensesData.forEach((e) => items.push({ type: "expense", data: e }));
    }

    return items;
  }, [normalizedProjects, expensesData]);

  const handleExpensePress = (expense: ExpenseCardInfo) => {
  const rate = encodeURIComponent(
    JSON.stringify({
      id: String(expense.rateId),
      description: expense.rateName,
      type: expense.type,
    })
  );

  router.push({
    pathname: "/expenseDetails",
    params: {
      rate: JSON.stringify(expense.rate),
      projectId: String(expense.projectId),
      projectName: expense.projectName,
      piName: expense.piName,
    },
  });
};



  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchProjects(), refetchExpenses()]);
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.header) {
      return (
        <Text className="text-xl font-bold px-4 pt-6 pb-2">{item.header}</Text>
      );
    }

    if (item.type === "project") {
      return (
        <ProjectCard
          {...item.data}
          onPress={() => handleProjectPress(item.data)}
        />
      );
    }

    if (item.type === "expense") {
      return (
        <ExpenseCard
          {...item.data}
          onPress={() => handleExpensePress(item.data)}
        />
      );
    }

    return null;
  };

  console.log("Mapped expensesData:", expensesData);


  return (
    <View className="flex-1 px-4">
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 88 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
