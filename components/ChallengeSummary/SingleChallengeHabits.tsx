import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { HabitData } from "@/components/AddHabitModal/types";

interface SingleChallengeHabitsProps {
  habits: HabitData[];
  totalDays: number;
}

export const SingleChallengeHabits = ({
  habits,
  totalDays,
}: SingleChallengeHabitsProps) => {
  if (!habits || habits.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.noHabitsText}>
          {t("no_habits_in_challenge_description")}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <View style={styles.habitColumn} />
        <View style={styles.statsColumn}>
          <View style={styles.participantColumn}>
            <ThemedText style={styles.headerText} bold>
              {t("you")}
            </ThemedText>
          </View>
        </View>
      </View>
      {habits.map((habit) => (
        <View key={habit.id} style={styles.habitRow}>
          <View style={styles.habitColumn}>
            <ThemedText style={styles.habitName} bold>
              {habit.name}
            </ThemedText>
          </View>
          <View style={styles.statsColumn}>
            <View style={styles.participantColumn}>
              <ThemedText style={styles.completionRate}>
                {Math.round(
                  (habit.completionDates?.length || 0 / totalDays) * 100
                )}
                %
              </ThemedText>
            </View>
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
});
