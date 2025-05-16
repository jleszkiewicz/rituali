import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../Commons/ThemedText";
import { RecommendedChallengeData } from "../AddHabitModal/types";
import { getHabitsForCurrentLanguage } from "./methods";
import { t } from "@/src/service/translateService";

const RecommendedChallengeCard = ({
  key,
  challenge,
}: {
  key: string;
  challenge: RecommendedChallengeData;
}) => {
  console.log("RecommendedChallengeCard: challenge:", challenge);

  if (!challenge) {
    console.warn("RecommendedChallengeCard: challenge is undefined");
    return null;
  }

  const habits = getHabitsForCurrentLanguage(challenge);
  console.log("RecommendedChallengeCard: habits:", habits);

  return (
    <View style={styles.container} key={key}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.title}>{challenge.name}</ThemedText>
        <View style={styles.durationContainer}>
          <ThemedText style={styles.duration} bold>
            {challenge.duration}
          </ThemedText>
          <ThemedText style={styles.durationDays}>{"dni"}</ThemedText>
        </View>
      </View>
      <View style={styles.rulesContainer}>
        {(Array.isArray(habits) ? habits : []).map((habit, index) => (
          <ThemedText
            key={`${habit}-${index}`}
            style={styles.rule}
          >{`• ${habit}`}</ThemedText>
        ))}
      </View>
      <TouchableOpacity style={styles.buttonContainer}>
        <ThemedText style={styles.buttonText}>{t("start")}</ThemedText>
        <Ionicons name="arrow-forward" size={24} color={Colors.HotPink} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 10,
    padding: 20,
    minHeight: 360,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "bold",
    color: Colors.HotPink,
  },
  duration: {
    fontSize: 26,
    color: Colors.White,
    lineHeight: 30,
  },
  rulesContainer: {
    marginTop: 10,
  },
  rule: {
    fontSize: 14,
    color: Colors.White,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.ButterYellow,
    borderRadius: 10,
    padding: 10,
    alignSelf: "flex-end",
  },
  buttonText: {
    fontSize: 16,
    color: Colors.HotPink,
    fontWeight: "bold",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationDays: {
    fontSize: 16,
    color: Colors.White,
  },
  durationContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default RecommendedChallengeCard;
