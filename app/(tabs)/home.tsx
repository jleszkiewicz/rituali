import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import {
  setHabits,
  selectHabits,
  setLoading,
  selectHabitsLoading,
} from "@/src/store/habitsSlice";
import { setChallenges, selectChallenges } from "@/src/store/challengesSlice";
import { fetchUserHabits, fetchUserChallenges } from "@/src/service/apiService";
import EmptyHabitsList from "@/components/HomeScreen/EmptyHabitsList";
import EmptyChallengeCard from "@/components/EmptyChallengeCard";
import CalendarCarousel from "@/components/HomeScreen/CalendarCarousel";
import { getLocale, t } from "@/src/service/translateService";
import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  isAfter,
  isBefore,
  parseISO,
  isSameDay,
} from "date-fns";
import { Colors } from "@/constants/Colors";
import type {
  HabitData,
  Challenge,
} from "../../components/AddHabitModal/types";
import AddHabitModal from "@/components/modals/AddHabitModal";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import HabitCard from "@/components/HomeScreen/HabitCard";

export default function HomeScreen() {
  const locale = getLocale();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const habits = useSelector(selectHabits);
  const challenges = useSelector(selectChallenges);
  const isLoading = useSelector(selectHabitsLoading);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddHabitModalVisible, setIsAddHabitModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitData | undefined>(
    undefined
  );

  useEffect(() => {
    const loadData = async () => {
      if (userId) {
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
      }
    };

    loadData();
  }, [userId, dispatch, isAddHabitModalVisible]);

  const getTitle = () => {
    if (isToday(selectedDate)) return t("today");
    if (isTomorrow(selectedDate)) return t("tomorrow");
    if (isYesterday(selectedDate)) return t("yesterday");
    return format(selectedDate, "d MMMM", { locale });
  };

  const handleAddHabit = () => {
    setIsAddHabitModalVisible(true);
  };

  const handleEditHabit = (habit: HabitData) => {
    setEditingHabit(habit);
    setIsAddHabitModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsAddHabitModalVisible(false);
    setEditingHabit(undefined);
  };

  const emptyChallenges = challenges.filter(
    (challenge: Challenge) =>
      !habits.some((habit: HabitData) => habit.challengeId === challenge.id)
  );

  const activeHabits = habits.filter((habit: HabitData) => {
    if (!habit.startDate || !habit.endDate) return false;
    const startDate = parseISO(habit.startDate);
    const endDate = parseISO(habit.endDate);
    return (
      (isBefore(startDate, selectedDate) ||
        isSameDay(startDate, selectedDate)) &&
      (isAfter(endDate, selectedDate) || isSameDay(endDate, selectedDate))
    );
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenWrapper>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.PrimaryPink} />
            <Text style={styles.loadingText}>{t("loading")}</Text>
          </View>
        </ScreenWrapper>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenWrapper>
        <Text style={styles.selectedDateText}>{getTitle()}</Text>
        <CalendarCarousel
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {emptyChallenges.length > 0 && activeHabits.length !== 0 && (
          <EmptyChallengeCard onPress={handleAddHabit} />
        )}
        <ScrollView>
          {activeHabits.length === 0 && <EmptyHabitsList />}
          {activeHabits.map((habit: HabitData) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              selectedDate={format(selectedDate, "yyyy-MM-dd")}
              onEdit={handleEditHabit}
            />
          ))}
        </ScrollView>
        <AddHabitModal
          isVisible={isAddHabitModalVisible}
          onClose={handleCloseModal}
          habit={editingHabit}
        />
      </ScreenWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
    flex: 1,
    marginTop: 10,
  },
  selectedDateText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 18,
    fontWeight: "600",
    color: Colors.PrimaryGray,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
});
