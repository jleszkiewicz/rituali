import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { HabitData } from "@/components/AddHabitModal/types";

interface ChallengeHabitsProps {
  habits: HabitData[];
  startDate: Date;
  endDate: Date;
  totalDays: number;
}

export const ChallengeHabits = ({
  habits,
  startDate,
  endDate,
  totalDays,
}: ChallengeHabitsProps) => {
  return (
    <View style={styles.habitsSection}>
      <ThemedText style={styles.sectionTitle} bold>
        {t("habits")}
      </ThemedText>
      {habits.map((habit) => {
        const habitCompletions = habit.completionDates.filter((date) => {
          const completionDate = new Date(date);
          return completionDate >= startDate && completionDate <= endDate;
        }).length;

        const habitCompletionRate =
          habit.frequency === "daily"
            ? Math.round((habitCompletions / totalDays) * 100)
            : habit.frequency === "weekly"
            ? Math.round(
                (habitCompletions /
                  ((totalDays / 7) * habit.selectedDays.length)) *
                  100
              )
            : Math.round(
                (habitCompletions /
                  ((totalDays / 30) * habit.selectedDays.length)) *
                  100
              );

        return (
          <View key={habit.id} style={styles.habitItem}>
            <ThemedText style={styles.habitName} bold>
              {habit.name}
            </ThemedText>
            <View style={styles.habitStats}>
              <ThemedText style={styles.habitStat}>
                {habitCompletions} {t("completions")}
              </ThemedText>
              <ThemedText style={styles.habitStat}>
                {habitCompletionRate}%
              </ThemedText>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  habitsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: Colors.PrimaryGray,
    marginBottom: 15,
    lineHeight: 26,
  },
  habitItem: {
    backgroundColor: Colors.PrimaryGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  habitName: {
    fontSize: 16,
    color: Colors.White,
    marginBottom: 8,
    lineHeight: 22,
  },
  habitStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  habitStat: {
    fontSize: 14,
    color: Colors.White,
    opacity: 0.7,
    lineHeight: 20,
  },
});
