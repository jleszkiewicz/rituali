import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/src/service/translateService";
import { HabitData } from "@/components/AddHabitModal/types";
import {
  format,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
  getWeek,
  getYear,
  isAfter,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval as eachDay,
} from "date-fns";
import { dateFormat } from "@/constants/Constants";

interface HabitCompletionHistoryProps {
  habit: HabitData;
}

const HabitCompletionHistory: React.FC<HabitCompletionHistoryProps> = ({
  habit,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(habit.startDate));
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

  const generateCalendarDays = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);

    const allDays = eachDay({ start, end });
    const weeks: (Date | null)[][] = [];

    let currentWeek: (Date | null)[] = [];

    allDays.forEach((day) => {
      currentWeek.push(day);

      if (getDay(day) === 0 || day.getTime() === end.getTime()) {
        while (currentWeek.length < 7) {
          currentWeek.unshift(null);
        }
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const hasDaysInCurrentMonth = currentMonthDays.length > 0;
  const calendarWeeks = hasDaysInCurrentMonth
    ? generateCalendarDays(currentMonth)
    : [];

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

      <View style={styles.calendarHeader}>
        {[
          t("mon"),
          t("tue"),
          t("wed"),
          t("thu"),
          t("fri"),
          t("sat"),
          t("sun"),
        ].map((dayName) => (
          <View key={dayName} style={styles.calendarHeaderDay}>
            <ThemedText style={styles.calendarHeaderText}>{dayName}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {calendarWeeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.calendarWeek}>
            {week.map((day, dayIndex) => {
              if (!day) {
                return <View key={dayIndex} style={styles.calendarDay} />;
              }

              const isCompleted = habit.completionDates.includes(
                format(day, dateFormat)
              );
              const shouldShow = shouldShowHabitOnDate(day);

              return (
                <View key={day.toString()} style={styles.calendarDay}>
                  <ThemedText
                    style={[
                      styles.dayNumber,
                      !shouldShow && styles.dayNumberDisabled,
                    ]}
                    bold
                  >
                    {format(day, "d")}
                  </ThemedText>
                  <View
                    style={[
                      styles.completionDot,
                      {
                        backgroundColor: shouldShow
                          ? Colors.HotPink
                          : Colors.LightGray,
                        opacity: isCompleted ? 1 : 0,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        ))}
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
  calendarHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  calendarHeaderDay: {
    width: "14.28%",
    alignItems: "center",
    paddingVertical: 5,
  },
  calendarHeaderText: {
    fontSize: 12,
    color: Colors.PrimaryGray,
    fontWeight: "bold",
  },
  calendarGrid: {
    flexDirection: "column",
  },
  calendarWeek: {
    flexDirection: "row",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    padding: 5,
    alignItems: "center",
  },
  dayNumber: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    marginBottom: 4,
  },
  dayNumberDisabled: {
    opacity: 0.3,
  },
  dayNumberOtherMonth: {
    opacity: 0.2,
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
