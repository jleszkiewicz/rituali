import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
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
import { RecommendedChallengeData } from "../AddHabitModal/types";
import { SuccessModal } from "./SuccessModal";

interface StartChallengeModalProps {
  isVisible: boolean;
  onClose: () => void;
  challenge: RecommendedChallengeData;
  refreshChallenges: () => void;
}

export const StartChallengeModal = ({
  isVisible,
  onClose,
  challenge,
  refreshChallenges,
}: StartChallengeModalProps) => {
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();

  const handleStart = async () => {
    if (!userId) {
      console.error("User not found");
      return;
    }

    try {
      const habitPromises = challenge.habits.en.map(async (habitName) => {
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
        beforePhotoUri: "",
      };

      await addChallenge(userId, challengeData);

      const [updatedHabits, updatedChallenges] = await Promise.all([
        fetchUserHabits(userId),
        fetchUserChallenges(userId),
      ]);

      dispatch(setHabits(updatedHabits));
      dispatch(setChallenges(updatedChallenges));
      refreshChallenges();

      onClose();
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.error("Error starting challenge:", error);
      onClose();
    }
  };

  return (
    <>
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={require("@/assets/ilustrations/medal.png")}
              style={styles.modalImage}
            />
            <ThemedText style={styles.modalTitle}>
              {t("start_challenge")}
            </ThemedText>
            <ThemedText style={styles.modalDescription}>
              {t("start_challenge_description")}
            </ThemedText>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
              >
                <ThemedText style={styles.buttonText}>{t("cancel")}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleStart}
              >
                <ThemedText style={styles.buttonText}>{t("start")}</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SuccessModal
        isVisible={isSuccessModalVisible}
        onClose={() => setIsSuccessModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    color: Colors.Black,
    marginBottom: 8,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: Colors.Black,
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.7,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.LightGray,
  },
  addButton: {
    backgroundColor: Colors.HotPink,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.White,
  },
});
