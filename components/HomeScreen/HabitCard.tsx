import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { HabitData } from "@/components/AddHabitModal/types";
import { ThemedText } from "../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/src/service/translateService";
import { useDispatch, useSelector } from "react-redux";
import { selectHabits, setHabits } from "@/src/store/habitsSlice";
import { updateHabitCompletion } from "@/src/service/apiService";
import { isAfter, isToday, parseISO } from "date-fns";
import DeleteHabitModal from "../modals/DeleteHabitModal";
import EditHabitModal from "../modals/EditHabitModal";
import { getIconForCategory } from "./methods/methods";
import { calculateStreak } from "@/src/utils/streakUtils";

interface HabitCardProps {
  habit: HabitData;
  selectedDate: string;
  isEditMode: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  selectedDate,
  isEditMode,
}) => {
  const dispatch = useDispatch();
  const habits = useSelector(selectHabits);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

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

  const streak = calculateStreak(
    habit.frequency,
    habit.startDate,
    habit.completionDates,
    habit.selectedDays
  );

  return (
    <>
      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={getIconForCategory(habit.category) as any}
                size={28}
                color={Colors.PrimaryRed}
              />
            </View>
            <View style={styles.titleContainer}>
              <ThemedText style={styles.title} bold>
                {habit.name}
              </ThemedText>
              {isTodayDate && streak > 0 && (
                <ThemedText style={styles.streak}>{`${streak} 🔥`}</ThemedText>
              )}
            </View>
          </View>
          {isEditMode ? (
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(true)}
                style={styles.actionButton}
              >
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.PrimaryGray}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsDeleteModalVisible(true)}
                style={styles.actionButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={Colors.HotPink}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={toggleCompletion}
              disabled={isLoading || isFutureDate}
              style={[
                styles.checkbox,
                isCompleted && styles.checkboxCompleted,
                isFutureDate && styles.checkboxDisabled,
              ]}
            >
              {isCompleted && (
                <Ionicons name="checkmark" size={20} color={Colors.White} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      <DeleteHabitModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        habitId={habit.id}
      />
      <EditHabitModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        habit={habit}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.White,
    borderRadius: 10,
    padding: 10,
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
  title: {
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.HotPink,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    backgroundColor: Colors.HotPink,
    borderColor: Colors.HotPink,
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  iconContainer: {
    backgroundColor: Colors.LightPink,
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  streak: {
    fontSize: 14,
    color: Colors.PrimaryGray,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginStart: 10,
  },
});

export default HabitCard;
