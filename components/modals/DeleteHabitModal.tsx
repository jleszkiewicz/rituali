import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import {
  updateHabit,
  fetchUserHabits,
  updateChallengeHabits,
  fetchUserChallenges,
} from "@/src/service/apiService";
import { useDispatch, useSelector } from "react-redux";
import { selectHabits, setHabits } from "@/src/store/habitsSlice";
import { selectChallenges, setChallenges } from "@/src/store/challengesSlice";
import { t } from "@/src/service/translateService";
import { HabitStatus } from "../AddHabitModal/types";
import { selectUserId } from "@/src/store/userSlice";
import { ThemedText } from "../Commons/ThemedText";
import { format } from "date-fns";
import { dateFormat } from "@/constants/Constants";
import PrimaryButton from "../Commons/PrimaryButton";

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
    if (!userId) return;

    try {
      const habitToUpdate = habits.find((h) => h.id === habitId);
      if (!habitToUpdate) return;

      const updatedHabit = {
        ...habitToUpdate,
        status: "deleted" as HabitStatus,
        endDate: format(new Date(), dateFormat),
      };
      await updateHabit(habitId, updatedHabit);

      const associatedChallenges = challenges.filter((challenge) =>
        challenge.habits.includes(habitId)
      );

      const updatePromises = associatedChallenges.map((challenge) => {
        const updatedHabits = challenge.habits.filter((id) => id !== habitId);
        return updateChallengeHabits(challenge.id, updatedHabits);
      });
      await Promise.all(updatePromises);

      const [freshHabits, freshChallenges] = await Promise.all([
        fetchUserHabits(userId),
        fetchUserChallenges(userId),
      ]);

      dispatch(setHabits(freshHabits));
      dispatch(setChallenges(freshChallenges));

      onClose();
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <Pressable
        style={styles.modalContent}
        onPress={(e) => e.stopPropagation()}
      >
        <Image
          source={require("@/assets/ilustrations/trash.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
        <ThemedText style={styles.title}>{t("delete_habit")}</ThemedText>
        <ThemedText style={styles.description}>
          {t("delete_habit_confirmation")}
        </ThemedText>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <ThemedText style={styles.buttonText}>{t("cancel")}</ThemedText>
          </Pressable>
          <PrimaryButton style={styles.button} onPress={handleDelete}>
            <ThemedText
              style={[styles.buttonText, styles.deleteButtonText]}
              bold
            >
              {t("delete")}
            </ThemedText>
          </PrimaryButton>
        </View>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    flex: 1,
    marginHorizontal: -20,
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  illustration: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.PrimaryGray,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.PrimaryGray,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  deleteButtonText: {
    color: Colors.White,
  },
});

export default DeleteHabitModal;
