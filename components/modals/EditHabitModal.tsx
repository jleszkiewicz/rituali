import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Colors } from "@/constants/Colors";
import DaySelector from "../AddHabitModal/DaySelector";
import FrequencySelector from "../AddHabitModal/FrequencySelector";
import { HabitData } from "../AddHabitModal/types";
import { updateHabit, updateChallengeHabits } from "@/src/service/apiService";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { setHabits } from "@/src/store/habitsSlice";
import { fetchUserHabits } from "@/src/service/apiService";
import CategoriesSelector from "../AddHabitModal/CategoriesSelector";
import { t } from "@/src/service/translateService";
import ModalButtons from "../AddChallengeModal/ModalButtons";
import { ThemedText } from "../Commons/ThemedText";
import { selectChallenges } from "@/src/store/challengesSlice";
import ModalHeader from "./ChallengeInfoModal/ModalHeader";
import { fetchUserChallenges } from "@/src/service/apiService";
import { setChallenges } from "@/src/store/challengesSlice";
import Dropdown from "../Commons/Dropdown";
import { format } from "date-fns";
import { dateFormat } from "@/constants/Constants";

interface EditHabitModalProps {
  isVisible: boolean;
  onClose: () => void;
  habit: HabitData;
}

const EditHabitModal = ({ isVisible, onClose, habit }: EditHabitModalProps) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const challenges = useSelector(selectChallenges);
  const [isChallengesExpanded, setIsChallengesExpanded] = useState(false);
  const [selectedChallengeIds, setSelectedChallengeIds] = useState<string[]>(
    []
  );
  const [isPartOfChallenge, setIsPartOfChallenge] = useState(false);
  const [errors, setErrors] = useState<{
    name: string;
    challenges: string;
    selectedDays: string;
  }>({
    name: "",
    challenges: "",
    selectedDays: "",
  });

  const defaultHabitData: HabitData = {
    id: "",
    name: "",
    category: "other",
    frequency: "daily",
    startDate: format(new Date(), dateFormat),
    endDate: null,
    selectedDays: [],
    completionDates: [],
    isPartOfChallenge: false,
    status: "active",
  };

  const [habitData, setHabitData] = useState<HabitData>(
    habit || defaultHabitData
  );

  useEffect(() => {
    if (habit) {
      const habitChallenges = challenges
        .filter((challenge) => challenge.habits.includes(habit.id))
        .map((challenge) => challenge.id);

      setHabitData({
        ...habit,
        startDate: habit.startDate,
        endDate: habit.endDate,
        isPartOfChallenge: habitChallenges.length > 0,
      });
      setIsPartOfChallenge(habitChallenges.length > 0);
      setSelectedChallengeIds(habitChallenges);
    }
  }, [habit, challenges]);

  const handleCloseModal = () => {
    if (habit) {
      setHabitData(habit);
      const habitChallenges = challenges
        .filter((challenge) => challenge.habits.includes(habit.id))
        .map((challenge) => challenge.id);
      setSelectedChallengeIds(habitChallenges);
      setIsPartOfChallenge(habitChallenges.length > 0);
    }
    setErrors({
      name: "",
      challenges: "",
      selectedDays: "",
    });
    onClose();
  };

  const handleTogglePartOfChallenge = () => {
    setIsPartOfChallenge(!isPartOfChallenge);
    if (!isPartOfChallenge) {
      setSelectedChallengeIds([]);
    }
  };

  const handleChallengeChange = (challengeId: string) => {
    setSelectedChallengeIds((prev) =>
      prev.includes(challengeId)
        ? prev.filter((id) => id !== challengeId)
        : [...prev, challengeId]
    );
    setErrors((prev) => ({ ...prev, challenges: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      challenges: "",
      selectedDays: "",
    };

    if (!habitData.name.trim()) {
      newErrors.name = t("habit_name_required");
    }

    if (isPartOfChallenge && selectedChallengeIds.length === 0) {
      newErrors.challenges = t("select_at_least_one_challenge");
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.challenges && !newErrors.selectedDays;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !userId || !habitData.id) {
      console.error("Cannot submit: missing required data", {
        userId,
        habitId: habitData.id,
      });
      return;
    }

    try {
      const habitToSubmit = {
        ...habitData,
        isPartOfChallenge: isPartOfChallenge,
      };

      await updateHabit(habitData.id, habitToSubmit);

      const currentChallenges = challenges.filter((challenge) =>
        challenge.habits.includes(habitData.id)
      );

      for (const challenge of currentChallenges) {
        if (!selectedChallengeIds.includes(challenge.id)) {
          const updatedHabits = challenge.habits.filter(
            (id) => id !== habitData.id
          );
          await updateChallengeHabits(challenge.id, updatedHabits);
        }
      }

      for (const challengeId of selectedChallengeIds) {
        const challenge = challenges.find((c) => c.id === challengeId);
        if (challenge && !challenge.habits.includes(habitData.id)) {
          await updateChallengeHabits(challengeId, [
            ...challenge.habits,
            habitData.id,
          ]);
        }
      }

      const [freshChallenges, freshHabits] = await Promise.all([
        fetchUserChallenges(userId),
        fetchUserHabits(userId),
      ]);

      dispatch(setChallenges(freshChallenges));
      dispatch(setHabits(freshHabits));

      handleCloseModal();
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  const handleDaySelect = (day: string) => {
    setHabitData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ModalHeader
            title={t("edit_habit")}
            onClose={onClose}
            color={Colors.PrimaryGray}
          />

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>{t("habit_name")}</ThemedText>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={habitData.name}
              onChangeText={(text) => {
                setHabitData({ ...habitData, name: text });
                setErrors({ ...errors, name: "" });
              }}
              placeholder={t("habit_name")}
            />
            {errors.name ? (
              <ThemedText style={styles.errorText}>{errors.name}</ThemedText>
            ) : null}
          </View>

          <CategoriesSelector
            onCategoryChange={(category) => {
              setHabitData({ ...habitData, category });
            }}
            initialCategory={habitData.category}
          />

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.switchContainer}
              onPress={handleTogglePartOfChallenge}
            >
              <ThemedText style={styles.switchText} bold>
                {t("part_of_challenge")}
              </ThemedText>
              <Switch
                value={isPartOfChallenge}
                onValueChange={handleTogglePartOfChallenge}
                trackColor={{ false: Colors.LightGray, true: Colors.HotPink }}
                thumbColor={Colors.White}
                ios_backgroundColor={Colors.LightGray}
              />
            </TouchableOpacity>

            {isPartOfChallenge && (
              <Dropdown
                isExpanded={isChallengesExpanded}
                onToggle={() => setIsChallengesExpanded(!isChallengesExpanded)}
                selectedText={
                  selectedChallengeIds.length > 0
                    ? `${t("challenges_selected")}: ${
                        selectedChallengeIds.length
                      }`
                    : ""
                }
                placeholder={t("select_challenges")}
                items={challenges.map((challenge) => ({
                  id: challenge.id,
                  label: challenge.name,
                  isSelected: selectedChallengeIds.includes(challenge.id),
                }))}
                onItemSelect={handleChallengeChange}
                noItemsText={t("no_active_challenges")}
                error={errors.challenges}
                expandHeight
                additionalStyle={styles.dropdown}
              />
            )}
            {errors.challenges && (
              <ThemedText style={styles.errorText}>
                {errors.challenges}
              </ThemedText>
            )}
          </View>

          <FrequencySelector
            frequency={habitData.frequency}
            onFrequencyChange={(frequency) =>
              setHabitData((prev) => ({ ...prev, frequency }))
            }
          />

          {habitData.frequency === "selected_days" && (
            <>
              <DaySelector
                selectedDays={habitData.selectedDays}
                onDayToggle={handleDaySelect}
              />
              {errors.selectedDays && (
                <ThemedText style={styles.errorText}>
                  {errors.selectedDays}
                </ThemedText>
              )}
            </>
          )}

          <ModalButtons onCancel={onClose} onSubmit={handleSubmit} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    width: "100%",
    maxHeight: "90%",
  },
  inputContainer: {
    marginBottom: 15,
    position: "relative",
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  inputError: {
    borderColor: Colors.PrimaryRed,
  },
  errorText: {
    color: Colors.PrimaryRed,
    fontSize: 12,
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  switchText: {
    fontSize: 16,
  },
  dropdown: {
    zIndex: 3,
    position: "absolute",
    width: "100%",
    top: 50,
    backgroundColor: Colors.White,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default EditHabitModal;
