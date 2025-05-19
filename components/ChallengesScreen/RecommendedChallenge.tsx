import React from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../Commons/ThemedText";
import { RecommendedChallengeData } from "../AddHabitModal/types";
import { getHabitsForCurrentLanguage } from "./methods";
import { t } from "@/src/service/translateService";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { addChallenge, addHabit } from "@/src/service/apiService";
import { format, addDays } from "date-fns";
import { dateFormat } from "@/constants/Constants";
import { useDispatch } from "react-redux";
import { setHabits } from "@/src/store/habitsSlice";
import { setChallenges } from "@/src/store/challengesSlice";
import { fetchUserHabits, fetchUserChallenges } from "@/src/service/apiService";

const RecommendedChallengeCard = ({
  challenge,
}: {
  challenge: RecommendedChallengeData;
}) => {
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();

  if (!challenge) {
    return null;
  }

  const habits = getHabitsForCurrentLanguage(challenge);

  const handleStart = async () => {
    if (!userId) {
      Alert.alert(t("error"), t("login_required"));
      return;
    }

    try {
      const habitPromises = habits.map(async (habitName) => {
        const habit = {
          id: "",
          name: habitName,
          frequency: "daily" as const,
          selectedDays: [],
          completionDates: [],
          category: "other" as const,
          isPartOfChallenge: true,
          startDate: format(new Date(), dateFormat),
          endDate: null,
          status: "active" as const,
        };
        const result = await addHabit(userId, habit);
        return result[0];
      });

      const addedHabits = await Promise.all(habitPromises);
      const habitIds = addedHabits.map((habit) => habit.id);

      const startDate = new Date();
      const endDate = addDays(startDate, parseInt(challenge.duration) - 1);

      const challengeData = {
        id: "",
        name: challenge.name,
        startDate: format(startDate, dateFormat),
        endDate: format(endDate, dateFormat),
        habits: habitIds,
      };

      await addChallenge(userId, challengeData);

      const [updatedHabits, updatedChallenges] = await Promise.all([
        fetchUserHabits(userId),
        fetchUserChallenges(userId),
      ]);

      dispatch(setHabits(updatedHabits));
      dispatch(setChallenges(updatedChallenges));

      Alert.alert(t("success"), t("challenge_started"));
    } catch (error) {
      console.error("Error starting challenge:", error);
      Alert.alert(t("error"), t("challenge_start_error"));
    }
  };

  return (
    <View style={styles.container} key={challenge.id}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.title}>{challenge.name}</ThemedText>
        <View style={styles.durationContainer}>
          <ThemedText style={styles.duration} bold>
            {challenge.duration}
          </ThemedText>
          <ThemedText style={styles.durationDays}>{t("days")}</ThemedText>
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
      <TouchableOpacity style={styles.buttonContainer} onPress={handleStart}>
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
    width: "100%",
    justifyContent: "space-between",
    marginEnd: 30,
    height: 350,
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
