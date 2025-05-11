import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { HabitData } from "@/components/AddHabitModal/types";
import { differenceInDays, format } from "date-fns";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { selectHabits } from "@/src/store/habitsSlice";
import {
  deleteChallenge,
  fetchUserChallenges,
  fetchUserHabits,
  updateChallengeHabits,
  updateHabit,
} from "@/src/service/apiService";
import { setChallenges } from "@/src/store/challengesSlice";
import { setHabits } from "@/src/store/habitsSlice";
import SelectHabitsModal from "./SelectHabitsModal";
import ModalHeader from "./ChallengeInfoModal/ModalHeader";
import ProgressSection from "./ChallengeInfoModal/ProgressSection";
import HabitsSection from "./ChallengeInfoModal/HabitsSection";
import { dateFormat } from "@/constants/Constants";
import ConfirmationModal from "./ConfirmationModal";
import PrimaryButton from "../Commons/PrimaryButton";

interface ChallengeInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  challenge: ChallengeData;
}

const ChallengeInfoModal: React.FC<ChallengeInfoModalProps> = ({
  isVisible,
  onClose,
  challenge,
}) => {
  const today = new Date();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const habits = useSelector(selectHabits);
  const [isSelectHabitsModalVisible, setIsSelectHabitsModalVisible] =
    useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);

  const challengeHabits = habits.filter(
    (habit) => challenge.habits.includes(habit.id) && habit.status === "active"
  );

  const completedHabits = challengeHabits.filter((habit) =>
    habit.completionDates.includes(format(today, dateFormat))
  ).length;

  const totalHabits = challengeHabits.length;

  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const daysPassed = differenceInDays(today, startDate) + 1;

  const handleAddHabit = () => {
    setIsSelectHabitsModalVisible(true);
  };

  const handleSelectHabits = async (selectedHabits: HabitData[]) => {
    if (!userId) return;

    try {
      const currentHabits = challenge.habits.filter((habitId) => {
        const habit = habits.find((h) => h.id === habitId);
        return habit && habit.status === "active";
      });

      const updatedChallengeHabits = [
        ...currentHabits,
        ...selectedHabits.map((h) => h.id),
      ];
      await updateChallengeHabits(challenge.id, updatedChallengeHabits);

      const [updatedHabits, updatedChallenges] = await Promise.all([
        fetchUserHabits(userId),
        fetchUserChallenges(userId),
      ]);

      dispatch(setHabits(updatedHabits));
      dispatch(setChallenges(updatedChallenges));
    } catch (error) {
      console.error("Error adding habits to challenge:", error);
    }
  };

  const handleDeleteChallenge = async () => {
    if (!userId) return;
    try {
      await deleteChallenge(challenge.id);
      const updatedChallenges = await fetchUserChallenges(userId);
      dispatch(setChallenges(updatedChallenges));
      onClose();
    } catch (error) {
      console.error("Error deleting challenge:", error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View>
            <ModalHeader
              title={challenge.name}
              onClose={onClose}
              color={Colors.White}
            />

            <ProgressSection
              completedHabits={completedHabits}
              totalHabits={totalHabits}
              daysPassed={daysPassed}
              totalDays={totalDays}
            />
            <HabitsSection
              habits={challengeHabits}
              challengeId={challenge.id}
              onAddHabit={handleAddHabit}
            />
          </View>
          <PrimaryButton
            style={styles.deleteButton}
            onPress={() => setIsDeleteConfirmationVisible(true)}
          >
            <>
              <Ionicons name="trash-outline" size={24} color={Colors.HotPink} />
              <ThemedText style={styles.deleteButtonText} bold>
                {t("delete_challenge")}
              </ThemedText>
            </>
          </PrimaryButton>
        </View>

        <SelectHabitsModal
          isVisible={isSelectHabitsModalVisible}
          onClose={() => setIsSelectHabitsModalVisible(false)}
          availableHabits={habits.filter(
            (habit) =>
              !challenge.habits.includes(habit.id) && habit.status === "active"
          )}
          onSelectHabits={handleSelectHabits}
        />

        <ConfirmationModal
          isVisible={isDeleteConfirmationVisible}
          onClose={() => setIsDeleteConfirmationVisible(false)}
          onConfirm={handleDeleteChallenge}
          title={t("delete_challenge_confirmation_title")}
          message={t("delete_challenge_confirmation_message")}
        />
      </View>
    </Modal>
  );
};

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
    justifyContent: "space-between",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 15,
    marginTop: 20,
  },
  deleteButtonText: {
    color: Colors.HotPink,
    fontSize: 16,
  },
});

export default ChallengeInfoModal;
