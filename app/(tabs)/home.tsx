import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import {
  setHabits,
  selectHabits,
  setLoading,
  selectHabitsLoading,
} from "@/src/store/habitsSlice";
import { setChallenges } from "@/src/store/challengesSlice";
import { fetchUserHabits, fetchUserChallenges } from "@/src/service/apiService";
import EmptyHabitsList from "@/components/HomeScreen/EmptyHabitsList";
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

export default function HomeScreen() {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const habits = useSelector(selectHabits);
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

  const handleEditHabit = (habit: HabitData) => {
    setEditingHabit(habit);
    setIsAddHabitModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsAddHabitModalVisible(false);
    setEditingHabit(undefined);
  };

  const activeHabits = habits
    .filter((habit: HabitData) => {
      if (habit.status === "deleted" && habit.endDate) {
        return new Date(habit.endDate) > selectedDate;
      }
      if (habit.status === "active") {
        return new Date(habit.startDate) <= selectedDate;
      }
    })
    .sort((a: HabitData, b: HabitData) => a.name.localeCompare(b.name));

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
        <ScrollView showsVerticalScrollIndicator={false}>
          {activeHabits.length === 0 && <EmptyHabitsList />}

          {activeHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              selectedDate={format(selectedDate, dateFormat)}
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
});
