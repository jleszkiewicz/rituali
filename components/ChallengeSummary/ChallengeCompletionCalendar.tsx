import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
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
import { useSelector } from "react-redux";
import { selectUserId, selectDisplayName } from "@/src/store/userSlice";
import {
  fetchSharedChallenge,
  fetchChallengeParticipants,
  fetchChallengeCompletionHistory,
} from "@/src/service/apiService";
import { HabitData } from "@/components/AddHabitModal/types";

interface ChallengeCompletionCalendarProps {
  startDate: Date;
  endDate: Date;
  challengeId: string;
  showLegend?: boolean;
  habits?: HabitData[];
}

interface ParticipantStats {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  completionHistory: {
    date: string;
    completion_percentage: number;
  }[];
}

export const ChallengeCompletionCalendar: React.FC<
  ChallengeCompletionCalendarProps
> = ({ startDate, endDate, challengeId, showLegend = false, habits = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(startDate);
  const [participants, setParticipants] = useState<ParticipantStats[]>([]);
  const userId = useSelector(selectUserId);
  const displayName = useSelector(selectDisplayName);

  React.useEffect(() => {
    const loadParticipants = async () => {
      try {
        const challengeData = await fetchSharedChallenge(challengeId);
        const participantsData = await fetchChallengeParticipants(
          challengeData
        );

        if (participantsData.length === 0) {
          if (!userId) return;
          const history = await fetchChallengeCompletionHistory(
            challengeId,
            userId
          );
          setParticipants([
            {
              id: userId,
              display_name: displayName,
              avatar_url: null,
              completionHistory: history,
            },
          ]);
          return;
        }

        const participantsWithHistory = await Promise.all(
          participantsData.map(async (participant) => {
            const history = await fetchChallengeCompletionHistory(
              challengeId,
              participant.id
            );
            return {
              ...participant,
              completionHistory: history,
            };
          })
        );

        setParticipants(participantsWithHistory);
      } catch (error) {
        console.error("Error loading participants:", error);
      }
    };
    loadParticipants();
  }, [challengeId, userId, displayName]);

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

  const monthKeys = Object.keys(daysByMonth).sort();
  const currentMonthKey = format(currentMonth, "yyyy-MM");
  const currentMonthDays = daysByMonth[currentMonthKey] || [];

  const generateCalendarWeeks = (month: Date) => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const allDays = eachDayOfInterval({ start, end });
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

  const getParticipantColor = (participantId: string, index: number) => {
    if (participantId === userId) {
      return Colors.LightPink;
    }

    const colors = [Colors.Yellow, Colors.PrimaryRed, Colors.LightBlue];
    return colors[index % colors.length];
  };

  const shouldShowHabitOnDate = (date: Date): boolean => {
    if (habits.length === 0) return true;

    return habits.some((habit) => {
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
    });
  };

  if (Object.keys(daysByMonth).length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.title} bold>
          {t("completion_calendar")}
        </ThemedText>
        <ThemedText style={styles.noDataText}>
          {t("no_completion_data")}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
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
              <ThemedText style={styles.calendarHeaderText}>
                {dayName}
              </ThemedText>
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

                const dayData = participants.map((participant) => {
                  const completion = participant.completionHistory.find(
                    (d) => d.date === format(day, "yyyy-MM-dd")
                  );
                  return {
                    id: participant.id,
                    completion: completion?.completion_percentage || 0,
                  };
                });

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
                    <View style={styles.dotsContainer}>
                      {dayData.map((data) => (
                        <View
                          key={data.id}
                          style={[
                            styles.completionDot,
                            {
                              backgroundColor: shouldShow
                                ? getParticipantColor(
                                    data.id,
                                    participants.findIndex(
                                      (p) => p.id === data.id
                                    )
                                  )
                                : Colors.LightGray,
                              opacity: data.completion / 100,
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {showLegend && (
        <View style={styles.legendContainer}>
          {participants.map((participant, index) => (
            <View key={participant.id} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  {
                    backgroundColor: getParticipantColor(participant.id, index),
                  },
                ]}
              />
              <ThemedText style={styles.legendText}>
                {participant.id === userId
                  ? t("you")
                  : participant.display_name || "User"}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: Colors.White,
    marginBottom: 15,
  },
  calendarContainer: {
    marginTop: 10,
    backgroundColor: Colors.ButterYellow,
    borderRadius: 10,
    padding: 15,
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
    fontSize: 12,
    color: Colors.PrimaryGray,
    marginBottom: 4,
  },
  dayNumberDisabled: {
    opacity: 0.3,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 2,
  },
  completionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  noDataText: {
    fontSize: 14,
    color: Colors.White,
    textAlign: "center",
    marginTop: 10,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: Colors.White,
  },
});
