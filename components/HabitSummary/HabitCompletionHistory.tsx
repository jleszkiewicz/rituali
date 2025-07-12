import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { t } from "@/src/service/translateService";
import { format, parseISO } from "date-fns";
import { HabitData } from "@/components/AddHabitModal/types";
import { Calendar } from "@/components/Commons/Calendar";

interface HabitCompletionHistoryProps {
  habit: HabitData;
}

const HabitCompletionHistory: React.FC<HabitCompletionHistoryProps> = ({
  habit,
}) => {
  const shouldShowHabitOnDate = (date: Date): boolean => {
    if (!habit.frequency || habit.frequency === "daily") {
      return true;
    }

    if (habit.frequency === "weekly") {
      return true;
    }

    if (habit.frequency === "selected_days" && habit.selectedDays) {
      const dayOfWeek = format(date, "EEEE").toLowerCase();
      return habit.selectedDays.includes(dayOfWeek);
    }

    return true;
  };

  const renderDayContent = (day: any) => {
    const dateFormat = "yyyy-MM-dd";
    const isCompleted = habit.completionDates.includes(
      format(day.date, dateFormat)
    );

    return (
      <>
        <ThemedText
          style={[
            styles.dayNumber,
            !day.shouldShow && styles.dayNumberDisabled,
          ]}
          bold
        >
          {format(day.date, "d")}
        </ThemedText>
        <View
          style={[
            styles.completionDot,
            {
              backgroundColor: day.shouldShow
                ? Colors.HotPink
                : Colors.LightGray,
              opacity: isCompleted ? 1 : 0,
            },
          ]}
        />
      </>
    );
  };

  const startDate = habit.startDate ? parseISO(habit.startDate) : new Date();
  const endDate = new Date();

  return (
    <Calendar
      startDate={startDate}
      endDate={endDate}
      title={t("completion_calendar")}
      shouldShowHabitOnDate={shouldShowHabitOnDate}
      renderDayContent={renderDayContent}
    />
  );
};

const styles = StyleSheet.create({
  dayNumber: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    marginBottom: 4,
  },
  dayNumberDisabled: {
    opacity: 0.3,
  },
  completionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default HabitCompletionHistory;
