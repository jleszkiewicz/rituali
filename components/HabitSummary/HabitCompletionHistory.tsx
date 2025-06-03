import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/src/service/translateService";
import { HabitData } from "@/components/AddHabitModal/types";
import { format, eachDayOfInterval, addMonths, subMonths } from "date-fns";
import { dateFormat } from "@/constants/Constants";

interface HabitCompletionHistoryProps {
  habit: HabitData;
}

const HabitCompletionHistory: React.FC<HabitCompletionHistoryProps> = ({
  habit,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(habit.startDate));
  const today = new Date();

  const days = eachDayOfInterval({
    start: new Date(habit.startDate),
    end: today,
  });

  const daysByMonth = days.reduce((acc, day) => {
    const monthKey = format(day, "yyyy-MM");
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(day);
    return acc;
  }, {} as Record<string, Date[]>);

  const monthKeys = Object.keys(daysByMonth).sort();
  const currentMonthKey = format(currentMonth, "yyyy-MM");
  const currentMonthDays = daysByMonth[currentMonthKey] || [];

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    const prevMonthKey = format(prevMonth, "yyyy-MM");
    if (monthKeys.includes(prevMonthKey)) {
      setCurrentMonth(prevMonth);
    }
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    const nextMonthKey = format(nextMonth, "yyyy-MM");
    if (monthKeys.includes(nextMonthKey)) {
      setCurrentMonth(nextMonth);
    }
  };

  if (Object.keys(daysByMonth).length === 0) {
    return (
      <View style={styles.calendarContainer}>
        <ThemedText style={styles.noDataText}>
          {t("no_completion_data")}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.calendarContainer}>
      <ThemedText style={styles.sectionTitle} bold>
        {t("completion_calendar")}
      </ThemedText>

      <View style={styles.monthNavigation}>
        <TouchableOpacity
          onPress={handlePrevMonth}
          style={[
            styles.navButton,
            !monthKeys.includes(
              format(subMonths(currentMonth, 1), "yyyy-MM")
            ) && styles.navButtonDisabled,
          ]}
          disabled={
            !monthKeys.includes(format(subMonths(currentMonth, 1), "yyyy-MM"))
          }
        >
          <Ionicons name="chevron-back" size={24} color={Colors.HotPink} />
        </TouchableOpacity>

        <ThemedText style={styles.monthTitle} bold>
          {format(currentMonth, "MMMM yyyy")}
        </ThemedText>

        <TouchableOpacity
          onPress={handleNextMonth}
          style={[
            styles.navButton,
            !monthKeys.includes(
              format(addMonths(currentMonth, 1), "yyyy-MM")
            ) && styles.navButtonDisabled,
          ]}
          disabled={
            !monthKeys.includes(format(addMonths(currentMonth, 1), "yyyy-MM"))
          }
        >
          <Ionicons name="chevron-forward" size={24} color={Colors.HotPink} />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarGrid}>
        {currentMonthDays.map((day) => {
          const isCompleted = habit.completionDates.includes(
            format(day, dateFormat)
          );
          return (
            <View key={day.toString()} style={styles.calendarDay}>
              <ThemedText style={styles.dayNumber} bold>
                {format(day, "d")}
              </ThemedText>
              <View
                style={[
                  styles.completionDot,
                  {
                    backgroundColor: Colors.HotPink,
                    opacity: isCompleted ? 1 : 0,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: Colors.ButterYellow,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.PrimaryGray,
    marginBottom: 15,
  },
  monthNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  navButton: {
    padding: 5,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  monthTitle: {
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    padding: 5,
    alignItems: "center",
  },
  dayNumber: {
    fontSize: 12,
    color: Colors.PrimaryGray,
    marginBottom: 4,
  },
  completionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  noDataText: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    textAlign: "center",
    marginTop: 10,
  },
});

export default HabitCompletionHistory;
