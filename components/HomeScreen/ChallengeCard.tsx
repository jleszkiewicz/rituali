import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { HabitData } from "@/components/AddHabitModal/types";
import { Svg, Circle } from "react-native-svg";
import { format, differenceInDays } from "date-fns";
import { t } from "@/src/service/translateService";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "../Commons/ThemedText";

interface ChallengeCardProps {
  challenge: ChallengeData;
  habits: HabitData[];
  selectedDate: string;
  width: number;
}

export default function ChallengeCard({
  challenge,
  habits,
  selectedDate,
  width,
}: ChallengeCardProps) {
  const challengeHabits = habits.filter((habit) =>
    challenge.habits.includes(habit.id)
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

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  return (
    <LinearGradient
      colors={[Colors.LightPink, Colors.HotPink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { width }]}
    >
      <ThemedText style={styles.title}>{challenge.name}</ThemedText>

      <View style={styles.progressContainer}>
        <View style={styles.circularProgressContainer}>
          <Svg width={radius * 2 + 10} height={radius * 2 + 10}>
            <Circle
              cx={radius + 5}
              cy={radius + 5}
              r={radius}
              stroke={Colors.White}
              strokeWidth={5}
              fill="none"
            />
            <Circle
              cx={radius + 5}
              cy={radius + 5}
              r={radius}
              stroke={Colors.DarkPink}
              strokeWidth={5}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${radius + 5} ${radius + 5})`}
            />
          </Svg>
          <View style={styles.progressTextContainer}>
            <ThemedText style={styles.progressText}>
              {completedHabits}/{totalHabits}
            </ThemedText>
          </View>
        </View>
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
        <ThemedText style={styles.timeProgressText}>
          {daysPassed}/{totalDays} {t("days")}
        </ThemedText>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    marginBottom: 8,
    fontSize: 17,
    textAlign: "left",
    color: Colors.White,
  },
  progressContainer: {
    alignItems: "center",
  },
  circularProgressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  progressTextContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    fontSize: 16,
    color: Colors.White,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.White,
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
