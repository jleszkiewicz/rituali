import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/src/service/translateService";
import { HabitData } from "@/components/AddHabitModal/types";
import { calculateStreak } from "@/src/utils/streakUtils";
import {
  eachDayOfInterval,
  getDay,
  getWeek,
  getYear,
  isAfter,
  parseISO,
} from "date-fns";

interface HabitStatsProps {
  habit: HabitData;
}

const HabitStats: React.FC<HabitStatsProps> = ({ habit }) => {
  const startDate = new Date(habit.startDate);
  const today = new Date();

  const shouldShowHabitOnDate = (date: Date): boolean => {
    const parsedStartDate = parseISO(habit.startDate);

    if (isAfter(parsedStartDate, date)) {
      return false;
    }

    switch (habit.frequency) {
      case "daily":
        return true;

      case "weekly":
        const weekOfYear = getWeek(date);
        const yearOfYear = getYear(date);
        const habitStartWeek = getWeek(parsedStartDate);
        const habitStartYear = getYear(parsedStartDate);
        return weekOfYear === habitStartWeek && yearOfYear === habitStartYear;

      case "selected_days":
        const dayNames = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        const currentDayName = dayNames[getDay(date)];
        return habit.selectedDays?.includes(currentDayName) || false;

      default:
        return true;
    }
  };

  const allDays = eachDayOfInterval({
    start: startDate,
    end: today,
  });

  const totalDays = allDays.filter(shouldShowHabitOnDate).length;

  const totalCompletions = habit.completionDates.length;
  const completionRate = Math.round((totalCompletions / totalDays) * 100);
  const streak = calculateStreak(
    habit.startDate,
    habit.completionDates,
    habit.frequency,
    habit.selectedDays || []
  );

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <View style={styles.statIconContainer}>
          <Ionicons name="calendar-number" size={24} color={Colors.White} />
        </View>
        <ThemedText style={styles.statValue} bold>
          {totalDays}
        </ThemedText>
        <ThemedText style={styles.statLabel}>{t("total_days")}</ThemedText>
      </View>

      <View style={styles.statItem}>
        <View style={styles.statIconContainer}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.White} />
        </View>
        <ThemedText style={styles.statValue} bold>
          {totalCompletions}
        </ThemedText>
        <ThemedText style={styles.statLabel}>
          {t("total_completions")}
        </ThemedText>
      </View>

      <View style={styles.statItem}>
        <View style={styles.statIconContainer}>
          <Ionicons name="trophy" size={24} color={Colors.White} />
        </View>
        <ThemedText style={styles.statValue} bold>
          {completionRate}%
        </ThemedText>
        <ThemedText style={styles.statLabel}>{t("completion_rate")}</ThemedText>
      </View>

      <View style={styles.statItem}>
        <View style={styles.statIconContainer}>
          <Ionicons name="flame" size={24} color={Colors.White} />
        </View>
        <ThemedText style={styles.statValue} bold>
          {streak}
        </ThemedText>
        <ThemedText style={styles.statLabel}>{t("current_streak")}</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statItem: {
    alignItems: "center",
    backgroundColor: Colors.PrimaryGray,
    padding: 8,
    borderRadius: 15,
    width: "48%",
    marginBottom: 15,
    shadowColor: Colors.Black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.HotPink,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    color: Colors.White,
    marginBottom: 4,
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.White,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default HabitStats;
