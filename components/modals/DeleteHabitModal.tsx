import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import {
  updateHabit,
  fetchUserHabits,
  updateChallengeHabits,
} from "@/src/service/apiService";
import { useDispatch, useSelector } from "react-redux";
import { selectHabits, setHabits } from "@/src/store/habitsSlice";
import { selectChallenges, setChallenges } from "@/src/store/challengesSlice";
import { t } from "@/src/service/translateService";
import { HabitStatus } from "../AddHabitModal/types";
import { selectUserId } from "@/src/store/userSlice";
import { ThemedText } from "../Commons/ThemedText";

interface DeleteHabitModalProps {
  isVisible: boolean;
  onClose: () => void;
  habitId: string;
}

const DeleteHabitModal = ({
  isVisible,
  onClose,
  habitId,
}: DeleteHabitModalProps) => {
  const dispatch = useDispatch();
  const habits = useSelector(selectHabits);
  const challenges = useSelector(selectChallenges);
  const userId = useSelector(selectUserId);

  const handleDelete = async () => {
    try {
      const habitToUpdate = habits.find((h) => h.id === habitId);

      if (habitToUpdate && userId) {
        const updatedHabit = {
          ...habitToUpdate,
          status: "deleted" as HabitStatus,
          endDate: new Date().toISOString(),
        };
        await updateHabit(habitId, updatedHabit);

        const associatedChallenges = challenges.filter((challenge) =>
          challenge.habits.includes(habitId)
        );

        for (const challenge of associatedChallenges) {
          const updatedHabits = challenge.habits.filter((id) => id !== habitId);
          await updateChallengeHabits(challenge.id, updatedHabits);
        }

        const updatedChallenges = challenges.map((challenge) => ({
          ...challenge,
          habits: challenge.habits.filter((id) => id !== habitId),
        }));
        dispatch(setChallenges(updatedChallenges));

        const updatedHabits = await fetchUserHabits(userId);
        dispatch(setHabits(updatedHabits));
      }
      onClose();
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.title}>{t("delete_habit")}</ThemedText>
          <ThemedText style={styles.message}>
            {t("delete_habit_confirmation")}
          </ThemedText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <ThemedText style={styles.buttonText}>{t("cancel")}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <ThemedText style={styles.buttonText}>{t("delete")}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.LightGray,
  },
  deleteButton: {
    backgroundColor: Colors.HotPink,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DeleteHabitModal;
