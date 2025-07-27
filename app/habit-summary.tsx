import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { ThemedText } from "@/components/Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { fetchHabitById } from "@/src/service/apiService";
import { HabitData } from "@/components/AddHabitModal/types";
import { format } from "date-fns";
import { dateFormat } from "@/constants/Constants";
import HabitStats from "@/components/HabitSummary/HabitStats";
import HabitCompletionHistory from "@/components/HabitSummary/HabitCompletionHistory";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import EditHabitModal from "@/components/modals/EditHabitModal";
import DeleteHabitModal from "@/components/modals/DeleteHabitModal";
import Loading from "@/components/Commons/Loading";
import { AppRoutes } from "@/src/routes/AppRoutes";
import FrequencyChip from "@/components/HomeScreen/HabitCard/FrequencyChip";
import React from "react";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";

const HabitSummaryScreen = () => {
  const { habitId } = useLocalSearchParams();
  const router = useRouter();
  const [habit, setHabit] = useState<HabitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    const loadHabit = async () => {
      try {
        if (typeof habitId === "string") {
          const habitData = await fetchHabitById(habitId);
          setHabit(habitData);
        }
      } catch (err) {
        setError(t("error_loading_habit"));
        console.error("Error loading habit:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHabit();
  }, [habitId]);

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !habit) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          {error || t("habit_not_found")}
        </ThemedText>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <ScreenHeader title={t("habit_summary")} onBack={() => router.back()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.habitInfo}>
          <View style={styles.habitNameContainer}>
            <ThemedText style={styles.habitName} bold>
              {habit.name}
            </ThemedText>
            <View style={styles.habitActions}>
              <TouchableOpacity
                onPress={handleEdit}
                style={styles.actionButton}
              >
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.PrimaryGray}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.actionButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={Colors.HotPink}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ThemedText style={styles.habitDate}>
            {t("started")}: {format(new Date(habit.startDate), dateFormat)}
          </ThemedText>
          <View style={styles.frequencyContainer}>
            <ThemedText style={styles.frequencyLabel}>
              {t("frequency")}:
            </ThemedText>
            <FrequencyChip
              frequency={habit.frequency}
              selectedDays={habit.selectedDays || []}
            />
          </View>
        </View>

        <HabitStats habit={habit} />

        <HabitCompletionHistory habit={habit} />
      </ScrollView>

      {habit && (
        <>
          <EditHabitModal
            isVisible={isEditModalVisible}
            onClose={() => {
              setIsEditModalVisible(false);
              if (typeof habitId === "string") {
                fetchHabitById(habitId).then(setHabit);
              }
            }}
            habit={habit}
          />
          <DeleteHabitModal
            isVisible={isDeleteModalVisible}
            onClose={() => {
              setIsDeleteModalVisible(false);
            }}
            onDeleteSuccess={() => {
              router.push(AppRoutes.Home);
            }}
            habitId={habit.id}
          />
        </>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  habitInfo: {
    marginBottom: 24,
  },
  habitNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  habitName: {
    fontSize: 24,
    lineHeight: 32,
    color: Colors.PrimaryGray,
    flex: 1,
  },
  habitActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  habitDate: {
    fontSize: 16,
    color: Colors.LightGray,
    marginBottom: 8,
  },
  frequencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  frequencyLabel: {
    fontSize: 16,
    color: Colors.LightGray,
    marginRight: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.DarkGray,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.HotPink,
    textAlign: "center",
  },
});

export default HabitSummaryScreen;
