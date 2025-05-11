import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../../Commons/ThemedText";
import { calculateStreak } from "@/src/utils/streakUtils";
import { isToday } from "date-fns";
import HabitIcon from "./HabitIcon";
import HabitCheckbox from "./HabitCheckbox";
import { HabitData } from "@/components/AddHabitModal/types";

interface HabitCardContentProps {
  habit: HabitData;
  selectedDate: string;
  isCompleted: boolean;
  isLoading: boolean;
  isFutureDate: boolean;
  onToggleCompletion: () => void;
}

const HabitCardContent: React.FC<HabitCardContentProps> = ({
  habit,
  selectedDate,
  isCompleted,
  isLoading,
  isFutureDate,
  onToggleCompletion,
}) => {
  const streak = calculateStreak(
    habit.frequency,
    habit.startDate,
    habit.completionDates,
    habit.selectedDays
  );
  const isTodayDate = isToday(new Date(selectedDate));

  return (
    <View style={styles.cardContent}>
      <HabitIcon category={habit.category} />
      <View style={styles.textContainer}>
        <ThemedText style={styles.title} bold>
          {habit.name}
        </ThemedText>
        {isTodayDate && streak > 0 && (
          <ThemedText style={styles.streak}>{`${streak} 🔥`}</ThemedText>
        )}
      </View>
      <HabitCheckbox
        isCompleted={isCompleted}
        isLoading={isLoading}
        isFutureDate={isFutureDate}
        onPress={onToggleCompletion}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 16,
  },
  streak: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    textAlign: "left",
  },
});

export default HabitCardContent;
