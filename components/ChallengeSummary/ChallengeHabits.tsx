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
  if (!habits || habits.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.noHabitsText}>
          {t("no_habits_in_challenge_description")}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} bold>
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
            <ThemedText style={styles.habitName}>{habit.name}</ThemedText>
            <ThemedText style={styles.habitStats}>
              {habitCompletions} / {totalDays} {t("completions")}
            </ThemedText>
            <ThemedText style={styles.habitStat}>
              {habitCompletionRate}%
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.LightPink,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.PrimaryGray,
    marginBottom: 16,
    textTransform: "capitalize",
  },
  habitItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.HotPink,
  },
  habitName: {
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
  habitStats: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    opacity: 0.7,
  },
  habitStat: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    opacity: 0.7,
  },
  noHabitsText: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    opacity: 0.7,
    textAlign: "center",
  },
});
