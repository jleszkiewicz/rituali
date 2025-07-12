import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { t } from "@/src/service/translateService";
import { format, parseISO, getDay, getWeek, getYear, isAfter } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { HabitData } from "@/components/AddHabitModal/types";
import { Calendar } from "@/components/Commons/Calendar";

interface CompletionDay {
  date: string;
  completion_percentage: number;
}

interface ParticipantStats {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  completionHistory: CompletionDay[];
}

interface CompletionStatsProps {
  participants: ParticipantStats[];
  currentUserId: string | null;
  challengeStartDate: string;
  challengeEndDate: string;
  hideLegend?: boolean;
  habits?: HabitData[];
}

export default function CompletionStats({
  participants,
  currentUserId,
  challengeStartDate,
  challengeEndDate,
  hideLegend,
  habits = [],
}: CompletionStatsProps) {
  const calculateStats = (history: CompletionDay[]) => {
    const averageCompletion =
      history.length > 0
        ? Math.round(
            history.reduce((sum, day) => sum + day.completion_percentage, 0) /
              history.length
          )
        : 0;

    const perfectDays = history.filter(
      (day) => day.completion_percentage === 100
    ).length;

    return { averageCompletion, perfectDays };
  };

  const participantsWithStats = participants
    .map((participant) => ({
      ...participant,
      stats: calculateStats(participant.completionHistory),
    }))
    .sort((a, b) => b.stats.averageCompletion - a.stats.averageCompletion);

  const startDate = challengeStartDate
    ? parseISO(challengeStartDate)
    : new Date();
  const endDate = challengeEndDate ? parseISO(challengeEndDate) : new Date();

  const getParticipantColor = (participantId: string, index: number) => {
    if (participantId === currentUserId) {
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

  const renderDayContent = (day: any) => {
    const dateFormat = "yyyy-MM-dd";
    const dateString = format(day.date, dateFormat);

    // Znajdź wszystkie ukończenia dla tego dnia
    const dayData = participantsWithStats.map((participant) => {
      const completion = participant.completionHistory.find(
        (d) => d.date === dateString
      );
      return {
        id: participant.id,
        completion: completion?.completion_percentage || 0,
      };
    });

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
          {dayData.map((data) => (
            <View
              key={data.id}
              style={[
                styles.completionDot,
                {
                  backgroundColor: day.shouldShow
                    ? getParticipantColor(
                        data.id,
                        participantsWithStats.findIndex((p) => p.id === data.id)
                      )
                    : Colors.LightGray,
                  opacity: data.completion / 100,
                },
              ]}
            />
          ))}
        </View>
      </>
    );
  };

  return (
    <View style={styles.section}>
      <View style={styles.statsContainer}>
        {participantsWithStats.map((participant) => {
          const { averageCompletion, perfectDays } = participant.stats;

          return (
            <View key={participant.id} style={styles.participantStats}>
              <View style={styles.participantHeader}>
                <View style={styles.nameContainer}>
                  <View
                    style={[
                      styles.participantDot,
                      {
                        backgroundColor: getParticipantColor(
                          participant.id,
                          participantsWithStats.findIndex(
                            (p) => p.id === participant.id
                          )
                        ),
                      },
                    ]}
                  />
                  <ThemedText style={styles.participantName}>
                    {participant.display_name?.replace(" ", "\n") || "User"}
                  </ThemedText>
                  {!hideLegend && (
                    <Image
                      source={require("@/assets/illustrations/trophy.png")}
                      style={styles.trophyIcon}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statValue}>
                      {averageCompletion}%
                    </ThemedText>
                    <ThemedText style={styles.statLabel}>
                      {t("average_completion")}
                    </ThemedText>
                  </View>

                  <View style={styles.statItem}>
                    <ThemedText style={styles.statValue}>
                      {perfectDays}
                    </ThemedText>
                    <ThemedText style={styles.statLabel}>
                      {t("perfect_days")}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <Calendar
        startDate={startDate}
        endDate={endDate}
        title={t("completion_calendar")}
        shouldShowHabitOnDate={shouldShowHabitOnDate}
        renderDayContent={renderDayContent}
        containerStyle={styles.calendarContainer}
      />
      {!hideLegend && (
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: Colors.LightPink }]}
            />
            <ThemedText style={styles.legendText}>{t("you")}</ThemedText>
          </View>
          {participantsWithStats
            .filter((p) => p.id !== currentUserId)
            .map((participant, index) => (
              <View key={participant.id} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    {
                      backgroundColor: getParticipantColor(
                        participant.id,
                        index
                      ),
                    },
                  ]}
                />
                <ThemedText style={styles.legendText}>
                  {participant.display_name || "User"}
                </ThemedText>
              </View>
            ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    backgroundColor: Colors.PrimaryGray,
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.White,
    marginBottom: 15,
  },
  statsContainer: {
    marginBottom: 20,
  },
  participantStats: {
    marginBottom: 16,
  },
  participantHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
    flex: 1,
  },
  participantDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  participantName: {
    fontSize: 16,
    color: Colors.White,
  },
  youLabel: {
    color: Colors.ButterYellow,
    fontSize: 12,
    fontStyle: "italic",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statItem: {
    alignItems: "flex-end",
    minWidth: 60,
  },
  statValue: {
    fontSize: 20,
    color: Colors.ButterYellow,
    fontWeight: "600",
  },
  statLabel: {
    fontSize: 12,
    color: Colors.White,
    opacity: 0.6,
    marginTop: 2,
    textAlign: "right",
    lineHeight: 16,
    width: "60%",
  },
  calendarContainer: {
    marginTop: 10,
    backgroundColor: Colors.ButterYellow,
    borderRadius: 10,
    padding: 15,
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
    gap: 2,
  },
  completionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.White,
    opacity: 0.8,
  },
  trophyIcon: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  moreDotsText: {
    fontSize: 8,
    color: Colors.PrimaryGray,
    marginLeft: 2,
  },
});
