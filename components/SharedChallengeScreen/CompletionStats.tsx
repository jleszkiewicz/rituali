import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { t } from "@/src/service/translateService";
import {
  format,
  eachDayOfInterval,
  parseISO,
  addMonths,
  subMonths,
} from "date-fns";
import { Ionicons } from "@expo/vector-icons";

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
}

export default function CompletionStats({
  participants,
  currentUserId,
  challengeStartDate,
  challengeEndDate,
}: CompletionStatsProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
  const today = new Date();

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate > today ? today : endDate,
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

  const getParticipantColor = (participantId: string, index: number) => {
    if (participantId === currentUserId) {
      return Colors.LightPink;
    }

    const colors = [Colors.Yellow, Colors.PrimaryRed, Colors.LightBlue];

    return colors[index % colors.length];
  };

  if (Object.keys(daysByMonth).length === 0) {
    return (
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle} bold>
          {t("completion_stats")}
        </ThemedText>
        <ThemedText style={styles.noDataText}>
          {t("no_completion_data")}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.statsContainer}>
        {participantsWithStats.map((participant, index) => {
          const { averageCompletion, perfectDays } = participant.stats;

          return (
            <View key={participant.id} style={styles.participantStats}>
              <View style={styles.participantHeader}>
                <View style={styles.nameContainer}>
                  <ThemedText style={styles.participantName}>
                    {participant.display_name || "User"}
                  </ThemedText>
                  {index === 0 && (
                    <Image
                      source={require("@/assets/ilustrations/trophy.png")}
                      style={styles.trophyIcon}
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

        <View style={styles.calendarGrid}>
          {currentMonthDays.map((day) => {
            const dayData = participantsWithStats.map((participant) => {
              const completion = participant.completionHistory.find(
                (d) => d.date === format(day, "yyyy-MM-dd")
              );
              return {
                id: participant.id,
                completion: completion?.completion_percentage || 0,
              };
            });

            return (
              <View key={day.toString()} style={styles.calendarDay}>
                <ThemedText style={styles.dayNumber} bold>
                  {format(day, "d")}
                </ThemedText>
                <View style={styles.dotsContainer}>
                  {dayData.map((data) => (
                    <View
                      key={data.id}
                      style={[
                        styles.completionDot,
                        {
                          backgroundColor: getParticipantColor(
                            data.id,
                            participantsWithStats.findIndex(
                              (p) => p.id === data.id
                            )
                          ),
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
      </View>

      <View style={styles.legendContainer}>
        {participantsWithStats.map((participant, index) => (
          <View key={participant.id} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                {
                  backgroundColor: getParticipantColor(participant.id, index),
                },
              ]}
            />
            <ThemedText style={styles.legendText}>
              {participant.display_name || "User"}
              {participant.id === currentUserId && ` (${t("you")})`}
            </ThemedText>
          </View>
        ))}
      </View>
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
    flex: 1,
    marginRight: 16,
  },
  participantName: {
    fontSize: 16,
    color: Colors.White,
    width: "110%",
  },
  youLabel: {
    color: Colors.ButterYellow,
    fontSize: 12,
    fontStyle: "italic",
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    flexShrink: 0,
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
  monthTitle: {
    fontSize: 18,
    color: Colors.HotPink,
    textAlign: "center",
    marginBottom: 15,
    textTransform: "capitalize",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
    paddingBottom: 10,
  },
  calendarDay: {
    width: 40,
    aspectRatio: 1,
    alignItems: "center",
  },
  dayNumber: {
    fontSize: 12,
    color: Colors.PrimaryGray,
    marginBottom: 4,
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
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: Colors.White,
  },
  trophyIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  noDataText: {
    color: Colors.White,
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  monthNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  navButton: {
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
});
