import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, ScrollView, View } from "react-native";
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
import { t } from "@/src/service/translateService";
import { format, isAfter, isBefore, parseISO, isSameDay } from "date-fns";
import { Colors } from "@/constants/Colors";
import type {
  HabitData,
  Challenge,
} from "../../components/AddHabitModal/types";
import AddHabitModal from "@/components/modals/AddHabitModal";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import HabitCard from "@/components/HomeScreen/HabitCard";
import { dateFormat } from "@/constants/Constants";
import {
  getChallengeDayLabel,
  getTitle,
} from "@/components/HomeScreen/methods/methods";
import Loading from "@/components/Commons/Loading";

export default function HomeScreen() {
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
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenWrapper>
        <Text style={styles.selectedDateText}>{getTitle(selectedDate)}</Text>
        <CalendarCarousel
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {emptyChallenges.length > 0 && activeHabits.length !== 0 && (
          <EmptyChallengeCard onPress={handleAddHabit} />
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 20 }}
        >
          {activeHabits.length === 0 && <EmptyHabitsList />}

          {challenges.map((challenge: Challenge) => {
            const habitsInChallenge = activeHabits.filter(
              (habit) => habit.challengeId === challenge.id
            );

            if (habitsInChallenge.length === 0) return null;

            return (
              <View key={challenge.id} style={{ marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>
                  {`${t("challenge_title")} ${
                    challenge.name
                  } (${getChallengeDayLabel(challenge, selectedDate)})`}
                </Text>
                {habitsInChallenge.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    selectedDate={format(selectedDate, dateFormat)}
                    onEdit={handleEditHabit}
                  />
                ))}
              </View>
            );
          })}

          {activeHabits.some((habit) => !habit.challengeId) && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>{t("other_habits")}</Text>
              {activeHabits
                .filter((habit) => !habit.challengeId)
                .map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    selectedDate={format(selectedDate, dateFormat)}
                    onEdit={handleEditHabit}
                  />
                ))}
            </View>
          )}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.PrimaryGray,
    marginBottom: 10,
  },
});
