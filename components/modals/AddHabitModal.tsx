import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import DaySelector from "../AddHabitModal/DaySelector";
import FrequencySelector from "../AddHabitModal/FrequencySelector";
import ChallengeSelector from "../AddHabitModal/ChallengeSelector";
import {
  Frequency,
  HabitCategory,
  HabitData,
  HabitStatus,
} from "../AddHabitModal/types";
import { addHabit, updateHabit } from "@/src/service/apiService";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { setHabits } from "@/src/store/habitsSlice";
import { fetchUserHabits } from "@/src/service/apiService";
import CategoriesSelector from "../AddHabitModal/CategoriesSelector";
import { t } from "@/src/service/translateService";
import ModalButtons from "../AddChallengeModal/ModalButtons";
import { ThemedText } from "../Commons/ThemedText";

interface AddHabitModalProps {
  isVisible: boolean;
  onClose: () => void;
  habit?: HabitData;
}

const AddHabitModal = ({ isVisible, onClose, habit }: AddHabitModalProps) => {
  const dispatch = useDispatch();
  const habitDataInitialState = {
    id: "",
    name: "",
    frequency: "daily" as Frequency,
    selectedDays: [],
    challenges: [],
    category: "other" as HabitCategory,
    isPartOfChallenge: false,
    startDate: new Date().toISOString(),
    endDate: null,
    completionDates: [],
    status: "active" as HabitStatus,
  };
  const userId = useSelector(selectUserId);
  const [habitData, setHabitData] = useState<HabitData>(
    habit ? habit : habitDataInitialState
  );
  const [errors, setErrors] = useState<{
    name: string;
    challenge?: string;
    selectedDays?: string;
  }>({
    name: "",
  });

  useEffect(() => {
    const today = new Date();
    if (habit) {
      setHabitData({
        ...habit,
        startDate: today.toISOString().split("T")[0],
        endDate: null,
      });
    } else {
      setHabitData({
        ...habitDataInitialState,
        startDate: today.toISOString().split("T")[0],
        endDate: null,
      });
    }
  }, [habit]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      challenge: "",
      selectedDays: "",
    };

    if (!habitData.name.trim()) {
      newErrors.name = t("habit_name_required");
    }

    if (
      habitData.frequency === "selected_days" &&
      habitData.selectedDays.length === 0
    ) {
      newErrors.selectedDays = t("select_at_least_one_day");
    }

    if (habitData.isPartOfChallenge && !habitData.challenges.length) {
      newErrors.challenge = t("select_challenge_required");
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.selectedDays && !newErrors.challenge;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !userId) return;

    try {
      if (habit) {
        await updateHabit(habit.id, {
          ...habitData,
        });
      } else {
        await addHabit(userId, {
          ...habitData,
        });
      }

      const updatedHabits = await fetchUserHabits(userId);
      dispatch(setHabits(updatedHabits));

      onClose();
    } catch (error) {
      console.error("Error saving habit:", error);
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
          <ThemedText style={styles.title}>{t("add_habit")}</ThemedText>

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

          <ChallengeSelector
            isPartOfChallenge={habitData.isPartOfChallenge}
            initialChallenges={habitData.challenges}
            onChallengeChange={(isPartOfChallenge, challenges) => {
              setHabitData((prev) => ({
                ...prev,
                isPartOfChallenge,
                challenges,
              }));
              setErrors((prev) => ({ ...prev, challenge: undefined }));
            }}
          />
          {errors.challenge && (
            <ThemedText style={styles.errorText}>{errors.challenge}</ThemedText>
          )}

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
    padding: 40,
    width: "100%",
    maxHeight: "90%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.DarkGray,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.PrimaryRed,
  },
  errorText: {
    color: Colors.PrimaryRed,
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: "40%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.DarkGray,
  },
  submitButton: {
    backgroundColor: Colors.HotPink,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddHabitModal;
