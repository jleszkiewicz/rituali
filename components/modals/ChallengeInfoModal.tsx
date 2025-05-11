import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { HabitData } from "@/components/AddHabitModal/types";
import { differenceInDays } from "date-fns";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import CircularProgress from "../Commons/CircularProgress";
import AddHabitModal from "./AddHabitModal";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import {
  deleteChallenge,
  fetchUserChallenges,
  fetchUserHabits,
  updateChallengeHabits,
  updateHabit,
} from "@/src/service/apiService";
import { setChallenges } from "@/src/store/challengesSlice";
import { setHabits } from "@/src/store/habitsSlice";
import ChallengeHabitCard from "../HomeScreen/HabitCard/ChallengeHabitCard";
import SelectHabitsModal from "./SelectHabitsModal";

interface ChallengeInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  challenge: ChallengeData;
  habits: HabitData[];
  selectedDate: string;
}

const ChallengeInfoModal: React.FC<ChallengeInfoModalProps> = ({
  isVisible,
  onClose,
  challenge,
  habits,
  selectedDate,
}) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const [isSelectHabitsModalVisible, setIsSelectHabitsModalVisible] =
    useState(false);

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

  const handleAddHabit = () => {
    setIsSelectHabitsModalVisible(true);
  };

  const handleSelectHabits = async (selectedHabits: HabitData[]) => {
    if (!userId) return;

    try {
      // Update challenge with new habits
      const updatedChallengeHabits = [
        ...challenge.habits,
        ...selectedHabits.map((h) => h.id),
      ];
      await updateChallengeHabits(challenge.id, updatedChallengeHabits);

      // Update each selected habit with the challenge ID
      for (const habit of selectedHabits) {
        const updatedHabitChallenges = [...habit.challenges, challenge.id];
        await updateHabit(habit.id, {
          ...habit,
          challenges: updatedHabitChallenges,
        });
      }

      // Refresh data from server
      const [updatedHabits, updatedChallenges] = await Promise.all([
        fetchUserHabits(userId),
        fetchUserChallenges(userId),
      ]);

      // Update store
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
          <View style={styles.header}>
            <ThemedText style={styles.title} bold>
              {challenge.name}
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.White} />
            </TouchableOpacity>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressSection}>
              <ThemedText style={styles.progressTitle} bold>
                {t("habits_progress")}
              </ThemedText>
              <CircularProgress
                progress={progressPercentage}
                text={`${completedHabits}/${totalHabits}`}
                color={Colors.HotPink}
              />
            </View>

            <View style={styles.progressSection}>
              <ThemedText style={styles.progressTitle} bold>
                {t("time_progress")}
              </ThemedText>
              <CircularProgress
                progress={timeProgressPercentage}
                text={`${daysPassed}/${totalDays}`}
                color={Colors.White}
              />
            </View>
          </View>

          <View style={styles.habitsContainer}>
            <View style={styles.habitsHeader}>
              <ThemedText style={styles.habitsTitle} bold>
                {t("habits")}
              </ThemedText>
              <TouchableOpacity
                style={styles.addHabitButton}
                onPress={handleAddHabit}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color={Colors.White}
                />
                <ThemedText style={styles.addHabitText}>
                  {t("add_habit")}
                </ThemedText>
              </TouchableOpacity>
            </View>

            <FlatList
              data={challengeHabits}
              renderItem={({ item }) => (
                <ChallengeHabitCard habit={item} challengeId={challenge.id} />
              )}
              keyExtractor={(item) => item.id}
              style={styles.habitsList}
            />
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteChallenge}
          >
            <Ionicons name="trash-outline" size={24} color={Colors.HotPink} />
            <ThemedText style={styles.deleteButtonText}>
              {t("delete_challenge")}
            </ThemedText>
          </TouchableOpacity>
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
  habitsContainer: {
    flex: 1,
  },
  habitsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  habitsTitle: {
    fontSize: 18,
    color: Colors.White,
    textTransform: "capitalize",
  },
  addHabitButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addHabitText: {
    color: Colors.White,
    fontSize: 16,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.HotPink,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: Colors.HotPink,
    fontSize: 16,
  },
});

export default ChallengeInfoModal;
