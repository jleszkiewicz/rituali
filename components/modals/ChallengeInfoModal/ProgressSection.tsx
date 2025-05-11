import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../../Commons/ThemedText";
import CircularProgress from "../../Commons/CircularProgress";
import { t } from "@/src/service/translateService";

interface ProgressSectionProps {
  completedHabits: number;
  totalHabits: number;
  daysPassed: number;
  totalDays: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({
  completedHabits,
  totalHabits,
  daysPassed,
  totalDays,
}) => {
  const progressPercentage =
    totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
  const timeProgressPercentage = Math.min(
    Math.max((daysPassed / totalDays) * 100, 0),
    100
  );

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressSection}>
        <ThemedText style={styles.progressTitle} bold>
          {t("time_progress")}
        </ThemedText>
        <CircularProgress
          progress={timeProgressPercentage}
          text={`${daysPassed}/${totalDays}\n${t("days")}`}
        />
      </View>

      <View style={styles.progressSection}>
        <ThemedText style={styles.progressTitle} bold>
          {t("habits_progress")}
        </ThemedText>
        <CircularProgress
          progress={progressPercentage}
          text={`${completedHabits}/${totalHabits}\n${t("habits")}`}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  progressSection: {
    alignItems: "center",
  },
  progressTitle: {
    fontSize: 16,
    color: Colors.White,
    marginBottom: 10,
  },
});

export default ProgressSection;
