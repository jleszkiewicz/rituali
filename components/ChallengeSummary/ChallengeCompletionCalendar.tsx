import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { t } from "@/src/service/translateService";
import { format, parseISO } from "date-fns";
import { ChallengeData } from "@/src/types/challenge";
import { HabitData } from "@/components/AddHabitModal/types";
import { Calendar } from "@/components/Commons/Calendar";

interface ChallengeCompletionCalendarProps {
  startDate: Date;
  endDate: Date;
  challengeId: string;
  showLegend?: boolean;
  habits?: HabitData[];
}

const ChallengeCompletionCalendar: React.FC<
  ChallengeCompletionCalendarProps
> = ({ startDate, endDate, challengeId, showLegend = false, habits = [] }) => {
  const shouldShowHabitOnDate = (date: Date): boolean => {
    if (habits.length === 0) return true;

    return date >= startDate && date <= endDate;
  };

  const renderDayContent = (day: any) => {
    const dateFormat = "yyyy-MM-dd";
    const dateString = format(day.date, dateFormat);

    // Znajdź wszystkie ukończenia dla tego dnia
    const dayCompletions = habits.flatMap((habit: HabitData) =>
      habit.completionDates.filter((date: string) => date === dateString)
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
        <View style={styles.dotsContainer}>
          {dayCompletions.slice(0, 3).map((_: string, index: number) => (
            <View
              key={index}
              style={[
                styles.completionDot,
                {
                  backgroundColor: day.shouldShow
                    ? Colors.HotPink
                    : Colors.LightGray,
                },
              ]}
            />
          ))}
          {dayCompletions.length > 3 && (
            <ThemedText style={styles.moreDotsText}>
              +{dayCompletions.length - 3}
            </ThemedText>
          )}
        </View>
      </>
    );
  };

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
  dotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  completionDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  moreDotsText: {
    fontSize: 8,
    color: Colors.PrimaryGray,
    marginLeft: 2,
  },
});

export default ChallengeCompletionCalendar;
