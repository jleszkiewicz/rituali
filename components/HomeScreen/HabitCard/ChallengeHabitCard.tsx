import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { HabitData } from "@/components/AddHabitModal/types";
import { useDispatch, useSelector } from "react-redux";
import { selectHabits, setHabits } from "@/src/store/habitsSlice";
import { selectChallenges, setChallenges } from "@/src/store/challengesSlice";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../../Commons/ThemedText";
import HabitIcon from "./HabitIcon";
import { updateChallengeHabits } from "@/src/service/apiService";

interface ChallengeHabitCardProps {
  habit: HabitData;
  challengeId: string;
}

const ChallengeHabitCard: React.FC<ChallengeHabitCardProps> = ({
  habit,
  challengeId,
}) => {
  const dispatch = useDispatch();
  const habits = useSelector(selectHabits);
  const challenges = useSelector(selectChallenges);

  const handleRemoveHabit = async () => {
    try {
      const challenge = challenges.find((c) => c.id === challengeId);
      if (challenge) {
        const updatedHabits = challenge.habits.filter((id) => id !== habit.id);
        await updateChallengeHabits(challengeId, updatedHabits);

        const updatedChallenges = challenges.map((c) =>
          c.id === challengeId ? { ...c, habits: updatedHabits } : c
        );
        dispatch(setChallenges(updatedChallenges));

        const updatedHabitsList = habits.map((h) =>
          h.id === habit.id
            ? {
                ...h,
                challenges: h.challenges.filter((id) => id !== challengeId),
                isPartOfChallenge: h.challenges.length > 1,
              }
            : h
        );
        dispatch(setHabits(updatedHabitsList));
      }
    } catch (error) {
      console.error("Error removing habit from challenge:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HabitIcon category={habit.category} />
        <ThemedText style={styles.title} bold>
          {habit.name}
        </ThemedText>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={handleRemoveHabit}>
        <Ionicons name="trash-outline" size={24} color={Colors.PrimaryRed} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.White,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    flex: 1,
  },
  deleteButton: {
    padding: 5,
  },
});

export default ChallengeHabitCard;
