import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store";
import { differenceInDays, format } from "date-fns";
import { dateFormat } from "@/constants/Constants";
import { t } from "@/src/service/translateService";

export default function ChallengeSummaryScreen() {
  const router = useRouter();
  const { challengeId } = useLocalSearchParams();
  const challenges = useSelector(
    (state: RootState) => state.challenges.challenges
  );
  const habits = useSelector((state: RootState) => state.habits.habits);

  const challenge = challenges.find((c) => c.id === challengeId);
  if (!challenge) {
    return null;
  }

  const challengeHabits = habits.filter((habit) =>
    challenge.habits.includes(habit.id)
  );

  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const totalDays = differenceInDays(endDate, startDate) + 1;

  const totalCompletions = challengeHabits.reduce((total, habit) => {
    return (
      total +
      habit.completionDates.filter((date) => {
        const completionDate = new Date(date);
        return completionDate >= startDate && completionDate <= endDate;
      }).length
    );
  }, 0);

  const totalPossibleCompletions = challengeHabits.reduce((total, habit) => {
    if (habit.frequency === "daily") {
      return total + totalDays;
    } else if (habit.frequency === "weekly") {
      return total + (totalDays / 7) * habit.selectedDays.length;
    } else if (habit.frequency === "monthly") {
      return total + (totalDays / 30) * habit.selectedDays.length;
    }
    return total;
  }, 0);

  const completionRate =
    totalPossibleCompletions > 0
      ? Math.round((totalCompletions / totalPossibleCompletions) * 100)
      : 0;

  return (
    <ScreenWrapper>
      <ScreenHeader
        title={t("challenge_summary")}
        onBack={() => router.back()}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.title} bold>
              {challenge.name}
            </ThemedText>
            <ThemedText style={styles.dates}>
              {format(startDate, dateFormat)} - {format(endDate, dateFormat)}
            </ThemedText>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue} bold>
                {totalDays}
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                {t("total_days")}
              </ThemedText>
            </View>

            <View style={styles.statItem}>
              <ThemedText style={styles.statValue} bold>
                {totalCompletions}
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                {t("total_completions")}
              </ThemedText>
            </View>

            <View style={styles.statItem}>
              <ThemedText style={styles.statValue} bold>
                {completionRate}%
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                {t("completion_rate")}
              </ThemedText>
            </View>
          </View>

          <View style={styles.habitsSection}>
            <ThemedText style={styles.sectionTitle} bold>
              {t("habits")}
            </ThemedText>
            {challengeHabits.map((habit) => {
              const habitCompletions = habit.completionDates.filter((date) => {
                const completionDate = new Date(date);
                return completionDate >= startDate && completionDate <= endDate;
              }).length;

              const habitCompletionRate =
                habit.frequency === "daily"
                  ? Math.round((habitCompletions / totalDays) * 100)
                  : habit.frequency === "weekly"
                  ? Math.round(
                      (habitCompletions /
                        ((totalDays / 7) * habit.selectedDays.length)) *
                        100
                    )
                  : Math.round(
                      (habitCompletions /
                        ((totalDays / 30) * habit.selectedDays.length)) *
                        100
                    );

              return (
                <View key={habit.id} style={styles.habitItem}>
                  <ThemedText style={styles.habitName} bold>
                    {habit.name}
                  </ThemedText>
                  <View style={styles.habitStats}>
                    <ThemedText style={styles.habitStat}>
                      {habitCompletions} {t("completions")}
                    </ThemedText>
                    <ThemedText style={styles.habitStat}>
                      {habitCompletionRate}%
                    </ThemedText>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: Colors.White,
    marginBottom: 8,
  },
  dates: {
    fontSize: 16,
    color: Colors.White,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statItem: {
    alignItems: "center",
    backgroundColor: Colors.PrimaryGray,
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
  },
  statValue: {
    fontSize: 24,
    color: Colors.White,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.White,
    opacity: 0.7,
    textAlign: "center",
  },
  habitsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: Colors.White,
    marginBottom: 15,
  },
  habitItem: {
    backgroundColor: Colors.PrimaryGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  habitName: {
    fontSize: 16,
    color: Colors.White,
    marginBottom: 8,
  },
  habitStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  habitStat: {
    fontSize: 14,
    color: Colors.White,
    opacity: 0.7,
  },
});
