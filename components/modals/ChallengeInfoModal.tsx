import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { HabitData } from "@/components/AddHabitModal/types";
import { Svg, Circle } from "react-native-svg";
import { differenceInDays } from "date-fns";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import HabitCard from "../HomeScreen/HabitCard";

interface ChallengeInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  challenge: ChallengeData;
  habits: HabitData[];
  selectedDate: string;
}

export default function ChallengeInfoModal({
  isVisible,
  onClose,
  challenge,
  habits,
  selectedDate,
}: ChallengeInfoModalProps) {
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

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <ThemedText style={styles.title} bold>
              {challenge.name}
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.White} />
            </TouchableOpacity>
          </View>

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
                  stroke={Colors.HotPink}
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
            <ThemedText style={styles.timeProgressText} bold>
              {daysPassed}/{totalDays}{" "}
              {totalDays === 1 ? t("days_one") : t("days")}
            </ThemedText>
          </View>

          <View style={styles.habitsContainer}>
            <ThemedText style={styles.habitsTitle} bold>
              {t("habits")}
            </ThemedText>
            {challengeHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                selectedDate={selectedDate}
                onEdit={() => {}}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    marginTop: 100,
    flex: 1,
    backgroundColor: Colors.PrimaryGray,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    color: Colors.White,
    lineHeight: 30,
  },
  closeButton: {
    padding: 5,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
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
    fontSize: 20,
    color: Colors.White,
  },
  timeProgressContainer: {
    marginBottom: 20,
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
    fontSize: 14,
    color: Colors.White,
    textAlign: "center",
    marginTop: 5,
  },
  habitsContainer: {
    flex: 1,
  },
  habitsTitle: {
    fontSize: 18,
    color: Colors.White,
    marginBottom: 10,
  },
});
