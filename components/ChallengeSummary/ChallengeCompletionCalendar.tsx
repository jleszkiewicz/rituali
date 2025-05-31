import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
import { t } from "@/src/service/translateService";
import { format, eachDayOfInterval, addMonths, subMonths } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { selectUserId, selectDisplayName } from "@/src/store/userSlice";
import {
  fetchSharedChallenge,
  fetchChallengeParticipants,
  fetchChallengeCompletionHistory,
} from "@/src/service/apiService";

interface ChallengeCompletionCalendarProps {
  startDate: Date;
  endDate: Date;
  challengeId: string;
  showLegend?: boolean;
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
> = ({ startDate, endDate, challengeId, showLegend = false }) => {
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

        <View style={styles.calendarGrid}>
          {currentMonthDays.map((day) => {
            const dayData = participants.map((participant) => {
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
                            participants.findIndex((p) => p.id === data.id)
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
