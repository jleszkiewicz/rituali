import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { t } from "@/src/service/translateService";
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
} from "date-fns";
import { Ionicons } from "@expo/vector-icons";

interface CalendarDay {
  date: Date;
  shouldShow: boolean;
  data?: any; // Custom data for each day (e.g., completion status, participant data)
}

interface CalendarProps {
  startDate: Date;
  endDate: Date;
  title?: string;
  containerStyle?: any;
  renderDayContent?: (day: CalendarDay) => React.ReactNode;
  shouldShowHabitOnDate?: (date: Date) => boolean;
  showTitle?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
  startDate,
  endDate,
  title,
  containerStyle,
  renderDayContent,
  shouldShowHabitOnDate,
  showTitle = true,
}) => {
  const [currentMonth, setCurrentMonth] = useState(startDate);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const daysByMonth = days.reduce((acc, day) => {
    const monthKey = format(day, "yyyy-MM");
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(day);
    return acc;
  }, {} as Record<string, Date[]>);

  const generateCalendarWeeks = (month: Date) => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const allDays = eachDayOfInterval({ start, end });
    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    allDays.forEach((day) => {
      currentWeek.push(day);

      // Jeśli to niedziela lub ostatni dzień miesiąca, zakończ tydzień
      if (getDay(day) === 0 || day.getTime() === end.getTime()) {
        // Uzupełnij tydzień pustymi miejscami na początku, jeśli potrzeba
        while (currentWeek.length < 7) {
          currentWeek.unshift(null);
        }
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    // Jeśli zostały jakieś dni, dodaj ostatni tydzień
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const monthKeys = Object.keys(daysByMonth).sort();
  const calendarWeeks = generateCalendarWeeks(currentMonth);

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

  const defaultShouldShow = (date: Date): boolean => {
    return shouldShowHabitOnDate ? shouldShowHabitOnDate(date) : true;
  };

  const defaultRenderDayContent = (day: CalendarDay) => (
    <>
      <ThemedText
        style={[styles.dayNumber, !day.shouldShow && styles.dayNumberDisabled]}
        bold
      >
        {format(day.date, "d")}
      </ThemedText>
    </>
  );

  if (Object.keys(daysByMonth).length === 0) {
    return (
      <View style={[styles.container, containerStyle]}>
        <ThemedText style={styles.noDataText}>
          {t("no_completion_data")}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {showTitle && title && (
        <ThemedText style={styles.title} bold>
          {title}
        </ThemedText>
      )}

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

              const shouldShow = defaultShouldShow(day);
              const calendarDay: CalendarDay = {
                date: day,
                shouldShow,
              };

              return (
                <View key={day.toString()} style={styles.calendarDay}>
                  {renderDayContent
                    ? renderDayContent(calendarDay)
                    : defaultRenderDayContent(calendarDay)}
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
  container: {
    backgroundColor: Colors.ButterYellow,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  title: {
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
  noDataText: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    textAlign: "center",
    marginTop: 10,
  },
});
