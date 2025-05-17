import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { HabitData } from "@/components/AddHabitModal/types";
import { differenceInDays } from "date-fns";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import { AppRoutes } from "@/src/routes/AppRoutes";
import { router } from "expo-router";

interface ChallengeCardProps {
  challenge: ChallengeData;
  habits: HabitData[];
  selectedDate: string;
  width: number;
  style?: any;
}

export default function ChallengeCard({
  challenge,
  habits,
  selectedDate,
  width,
  style,
}: ChallengeCardProps) {
  const challengeHabits = habits.filter(
    (habit) => challenge.habits.includes(habit.id) && habit.status === "active"
  );

  const completedHabits = challengeHabits.filter((habit) =>
    habit.completionDates.includes(selectedDate)
  ).length;

  const totalHabits = challengeHabits.length;
  const progressPercentage =
    totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const daysPassed = differenceInDays(new Date(selectedDate), startDate) + 1;
  const timeProgressPercentage = Math.min(
    Math.max((daysPassed / totalDays) * 100, 0),
    100
  );

  const isCompleted = completedHabits === totalHabits && totalHabits > 0;

  const naviagteToChallengesScreen = () => {
    router.push(AppRoutes.Challenges);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { width }, style]}
        onPress={() => naviagteToChallengesScreen()}
      >
        <ThemedText style={styles.title} bold>
          {challenge.name}
        </ThemedText>
        <ThemedText style={styles.statusText} bold>
          {isCompleted ? t("completed_for_today") : t("please_complete_me")}
        </ThemedText>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>
          <ThemedText style={styles.progressText} bold>
            {completedHabits}/{totalHabits} {t("habits")}
          </ThemedText>
        </View>

        <View style={styles.timeProgressContainer}>
          <View style={styles.timeProgressBar}>
            <View
              style={[
                styles.timeProgressFill,
                { width: `${timeProgressPercentage}%` },
              ]}
            />
          </View>
          <ThemedText style={styles.timeProgressText} bold>
            {daysPassed}/{totalDays}{" "}
            {totalDays === 1 ? t("days_one") : t("days")}
          </ThemedText>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    shadowColor: Colors.Black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 17,
    textAlign: "left",
    color: Colors.White,
  },
  statusText: {
    fontSize: 15,
    color: Colors.ButterYellow,
    marginTop: 4,
    opacity: 0.8,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.HotPink,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.White,
    textAlign: "center",
    marginTop: 5,
  },
  timeProgressContainer: {
    marginTop: 10,
  },
  timeProgressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  timeProgressFill: {
    height: "100%",
    backgroundColor: Colors.White,
    borderRadius: 3,
  },
  timeProgressText: {
    fontSize: 12,
    color: Colors.White,
    textAlign: "center",
    marginTop: 5,
  },
});
