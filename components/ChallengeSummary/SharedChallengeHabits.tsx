import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { HabitData } from "@/components/AddHabitModal/types";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";

interface SharedChallengeHabitsProps {
  habits: HabitData[];
  totalDays: number;
  participants: {
    id: string;
    display_name: string | null;
    completionHistory: {
      date: string;
      completion_percentage: number;
    }[];
  }[];
}

export const SharedChallengeHabits = ({
  habits,
  totalDays,
  participants,
}: SharedChallengeHabitsProps) => {
  const userId = useSelector(selectUserId);

  if (!habits || habits.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.noHabitsText}>
          {t("no_habits_in_challenge_description")}
        </ThemedText>
      </View>
    );
  }

  if (participants.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.noHabitsText}>
          {t("no_participants")}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.subtitle}>{t("completion_rate")}</ThemedText>
      </View>
      <View style={styles.tableHeader}>
        <View style={styles.habitColumn} />
        <View style={styles.statsColumn}>
          {participants.map((participant) => (
            <View key={participant.id} style={styles.participantColumn}>
              <ThemedText style={styles.headerText} bold>
                {participant.id === userId
                  ? t("you")
                  : participant.display_name || "User"}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
      {habits.map((habit, index) => (
        <View
          key={habit.id}
          style={[
            styles.habitRow,
            index === habits.length - 1 && styles.lastRow,
          ]}
        >
          <View style={styles.habitColumn}>
            <ThemedText style={styles.habitName} bold>
              {habit.name}
            </ThemedText>
          </View>
          <View style={styles.statsColumn}>
            {participants.map((participant) => {
              const participantCompletions =
                participant.completionHistory.filter(
                  (day) => day.completion_percentage > 0
                ).length;
              const participantRate = Math.round(
                (participantCompletions / totalDays) * 100
              );

              return (
                <View key={participant.id} style={styles.participantColumn}>
                  <ThemedText style={styles.completionRate}>
                    {participantRate}%
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.LightPink,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    opacity: 0.7,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.HotPink,
    paddingBottom: 8,
    marginBottom: 8,
  },
  habitRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.HotPink,
  },
  habitColumn: {
    flex: 2,
    paddingRight: 16,
  },
  statsColumn: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  participantColumn: {
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    textAlign: "center",
  },
  habitName: {
    fontSize: 14,
    color: Colors.PrimaryGray,
  },
  completionRate: {
    fontSize: 18,
    color: Colors.PrimaryGray,
    fontWeight: "500",
  },
  noHabitsText: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    opacity: 0.7,
    textAlign: "center",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
});
