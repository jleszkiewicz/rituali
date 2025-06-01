import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { HabitData } from "@/components/AddHabitModal/types";
import { useDispatch, useSelector } from "react-redux";
import { selectHabits, setHabits } from "@/src/store/habitsSlice";
import { selectUserId } from "@/src/store/userSlice";
import { updateHabitCompletion } from "@/src/service/apiService";
import { checkUncompletedHabits } from "@/src/service/notificationsService";
import { isAfter, isToday, parseISO } from "date-fns";
import { calculateStreak } from "@/src/utils/streakUtils";
import HabitTitle from "./HabitTitle";
import HabitActions from "./HabitActions";
import HabitCheckbox from "./HabitCheckbox";
import HabitIcon from "./HabitIcon";

interface HabitCardProps {
  habit: HabitData;
  selectedDate: string;
  isEditMode: boolean;
  onEdit: (habit: HabitData) => void;
  onDelete: (habitId: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  selectedDate,
  isEditMode,
  onEdit,
  onDelete,
}) => {
  const dispatch = useDispatch();
  const habits = useSelector(selectHabits);
  const userId = useSelector(selectUserId);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      checkUncompletedHabits(userId);
    }
  }, [userId, habit.completionDates]);

  const isFutureDate = isAfter(parseISO(selectedDate), new Date());
  const isTodayDate = isToday(parseISO(selectedDate));
  const isCompleted = habit.completionDates.some((date: string) => {
    if (!date) return false;
    return date === selectedDate;
  });

  const toggleCompletion = async () => {
    if (isLoading || isFutureDate) return;

    setIsLoading(true);
    try {
      const updatedCompletionDates = isCompleted
        ? habit.completionDates.filter((date: string) => date !== selectedDate)
        : [...habit.completionDates, selectedDate];

      const updatedHabits = habits.map((h) =>
        h.id === habit.id
          ? { ...h, completionDates: updatedCompletionDates }
          : h
      );
      dispatch(setHabits(updatedHabits));
      await updateHabitCompletion(habit.id, updatedCompletionDates);
    } catch (error) {
      console.error("Error updating habit completion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const streak = calculateStreak(habit.startDate, habit.completionDates);

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <HabitIcon category={habit.category} />
          <HabitTitle name={habit.name} streak={streak} isToday={isTodayDate} />
        </View>
        {isEditMode ? (
          <HabitActions
            onEdit={() => onEdit(habit)}
            onDelete={() => onDelete(habit.id)}
          />
        ) : (
          <HabitCheckbox
            isCompleted={isCompleted}
            isDisabled={isLoading || isFutureDate}
            onPress={toggleCompletion}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.LightPink,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});

export default HabitCard;
