import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { HabitData } from "@/components/AddHabitModal/types";
import { ThemedText } from "../../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/src/service/translateService";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { updateChallengeHabits, updateHabit } from "@/src/service/apiService";
import { setHabits } from "@/src/store/habitsSlice";
import { setChallenges } from "@/src/store/challengesSlice";
import { fetchUserHabits, fetchUserChallenges } from "@/src/service/apiService";
import ConfirmationModal from "../../modals/DeleteAccountModal";
import HabitIcon from "./HabitIcon";
import FrequencyChip from "./FrequencyChip";

interface ChallengeHabitCardProps {
  habit: HabitData;
  challengeId: string;
  onHabitRemoved?: () => void;
}

const ChallengeHabitCard: React.FC<ChallengeHabitCardProps> = ({
  habit,
  challengeId,
  onHabitRemoved,
}) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);

  const handleDeleteHabit = async () => {
    if (!userId) return;

    try {
      const currentChallenges = await fetchUserChallenges(userId);
      const currentChallenge = currentChallenges.find(
        (c) => c.id === challengeId
      );

      if (!currentChallenge) return;

      const updatedChallengeHabits = currentChallenge.habits.filter(
        (id: string) => id !== habit.id
      );

      await updateChallengeHabits(challengeId, updatedChallengeHabits);

      const [updatedHabits, updatedChallenges] = await Promise.all([
        fetchUserHabits(userId),
        fetchUserChallenges(userId),
      ]);

      dispatch(setHabits(updatedHabits));
      dispatch(setChallenges(updatedChallenges));

      setIsDeleteConfirmationVisible(false);

      if (onHabitRemoved) {
        onHabitRemoved();
      }
    } catch (error) {
      console.error("Error removing habit from challenge:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.habitInfo}>
        <HabitIcon category={habit.category} />
        <View style={styles.habitDetails}>
          <ThemedText style={styles.habitName} bold>
            {habit.name}
          </ThemedText>
          <FrequencyChip
            frequency={habit.frequency}
            selectedDays={habit.selectedDays || []}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setIsDeleteConfirmationVisible(true)}
      >
        <Ionicons name="trash-outline" size={24} color={Colors.HotPink} />
      </TouchableOpacity>

      <ConfirmationModal
        isVisible={isDeleteConfirmationVisible}
        onClose={() => setIsDeleteConfirmationVisible(false)}
        onConfirm={handleDeleteHabit}
        title={t("delete_habit_confirmation_title")}
        message={t("delete_habit_confirmation_message")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.LightPink,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  habitInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  habitDetails: {
    flex: 1,
    marginStart: 10,
  },
  habitName: {
    fontSize: 16,
    marginStart: 10,
    color: Colors.PrimaryGray,
    maxWidth: "80%",
    marginBottom: 5,
  },
  deleteButton: {
    padding: 5,
  },
});

export default ChallengeHabitCard;
