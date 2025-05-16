import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import {
  setHabits,
  selectHabits,
  setLoading,
  selectHabitsLoading,
} from "@/src/store/habitsSlice";
import { selectChallenges, setChallenges } from "@/src/store/challengesSlice";
import { fetchUserHabits, fetchUserChallenges } from "@/src/service/apiService";
import CalendarCarousel from "@/components/HomeScreen/CalendarCarousel";
import { format } from "date-fns";
import { Colors } from "@/constants/Colors";
import type { HabitData } from "../../components/AddHabitModal/types";
import AddHabitModal from "@/components/modals/AddHabitModal";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import HabitCard from "@/components/HomeScreen/HabitCard";
import { dateFormat } from "@/constants/Constants";
import { getTitle } from "@/components/HomeScreen/methods/methods";
import Loading from "@/components/Commons/Loading";
import ChallengesList from "@/components/HomeScreen/ChallengesList";
import { t } from "@/src/service/translateService";
import ConditionalRenderer from "@/components/Commons/ConditionalRenderer";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { ThemedText } from "@/components/Commons/ThemedText";
import EmptyHabitsList from "@/components/HomeScreen/EmptyHabitsList";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const habits = useSelector(selectHabits);
  const challenges = useSelector(selectChallenges);
  const isLoading = useSelector(selectHabitsLoading);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddHabitModalVisible, setIsAddHabitModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const activeChallenges = challenges.filter(
    (challenge) =>
      new Date(challenge.endDate) >= selectedDate &&
      new Date(challenge.startDate) <= selectedDate
  );

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;

      try {
        dispatch(setLoading(true));
        const [habitsData, challengesData] = await Promise.all([
          fetchUserHabits(userId),
          fetchUserChallenges(userId),
        ]);
        dispatch(setHabits(habitsData));
        dispatch(setChallenges(challengesData));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadData();
  }, [userId, dispatch]);

  const activeHabits = habits
    .filter((habit: HabitData) => {
      const habitStartDate = new Date(habit.startDate);
      const habitEndDate = habit.endDate ? new Date(habit.endDate) : null;
      const isActiveInSelectedDate =
        habitStartDate <= selectedDate &&
        (!habitEndDate || habitEndDate >= selectedDate);

      if (habit.status === "deleted") {
        return false;
      }

      if (habit.status === "active") {
        return isActiveInSelectedDate;
      }

      return false;
    })
    .sort((a: HabitData, b: HabitData) => a.name.localeCompare(b.name));

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ScreenWrapper>
      <ScreenHeader title={getTitle(selectedDate)} />
      <CalendarCarousel
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      {activeHabits.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <ConditionalRenderer condition={activeChallenges.length > 0}>
            <ThemedText style={styles.sectionTitle}>
              {t("challenges")}
            </ThemedText>
            <ChallengesList
              challenges={activeChallenges}
              habits={habits}
              selectedDate={format(selectedDate, dateFormat)}
            />
          </ConditionalRenderer>
          <ConditionalRenderer condition={activeHabits.length > 0}>
            <View style={styles.habitsHeader}>
              <ThemedText style={styles.sectionTitle}>{t("habits")}</ThemedText>
              <TouchableOpacity
                onPress={() => setIsEditMode(!isEditMode)}
                style={styles.editButton}
              >
                <Ionicons
                  name={isEditMode ? "close" : "create-outline"}
                  size={24}
                  color={Colors.HotPink}
                />
                <ThemedText style={styles.editButtonText} bold>
                  {isEditMode ? t("editing_done") : t("edit")}
                </ThemedText>
              </TouchableOpacity>
            </View>
            {activeHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                selectedDate={format(selectedDate, dateFormat)}
                isEditMode={isEditMode}
              />
            ))}
          </ConditionalRenderer>
        </ScrollView>
      ) : (
        <EmptyHabitsList />
      )}
      <AddHabitModal
        isVisible={isAddHabitModalVisible}
        onClose={() => setIsAddHabitModalVisible(false)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
    flex: 1,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.PrimaryGray,
    marginBottom: 10,
    textTransform: "capitalize",
  },
  habitsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  editButton: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginBottom: 12,
  },
  editButtonText: {
    color: Colors.HotPink,
    fontSize: 16,
    fontWeight: "600",
  },
});
