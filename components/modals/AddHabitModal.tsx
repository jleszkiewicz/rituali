import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import DaySelector from "../AddHabitModal/DaySelector";
import FrequencySelector from "../AddHabitModal/FrequencySelector";
import DateSelector from "../AddHabitModal/DateSelector";
import ChallengeSelector from "../AddHabitModal/ChallengeSelector";
import { HabitData } from "../AddHabitModal/types";

interface AddHabitModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (habit: HabitData) => void;
}

const AddHabitModal = ({
  isVisible,
  onClose,
  onSubmit,
}: AddHabitModalProps) => {
  const [habitData, setHabitData] = useState<HabitData>({
    name: "",
    isPartOfChallenge: false,
    challengeId: null,
    frequency: "daily",
    selectedDays: [],
    startDate: new Date(),
    endDate: new Date(),
  });

  const [errors, setErrors] = useState<{
    name?: string;
    selectedDays?: string;
    challenge?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!habitData.name.trim()) {
      newErrors.name = t("habit_name_required");
      isValid = false;
    }

    if (
      habitData.frequency === "selected_days" &&
      habitData.selectedDays.length === 0
    ) {
      newErrors.selectedDays = t("select_at_least_one_day");
      isValid = false;
    }

    if (habitData.isPartOfChallenge && !habitData.challengeId) {
      newErrors.challenge = t("select_challenge_required");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(habitData);
    }
  };

  const toggleDay = (day: number) => {
    setHabitData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
    if (habitData.frequency === "selected_days") {
      setErrors((prev) => ({ ...prev, selectedDays: undefined }));
    }
  };

  const getValidationMessage = () => {
    if (!habitData.name.trim()) {
      return t("habit_name_required");
    }
    if (
      habitData.frequency === "selected_days" &&
      habitData.selectedDays.length === 0
    ) {
      return t("select_at_least_one_day");
    }
    if (habitData.isPartOfChallenge && !habitData.challengeId) {
      return t("select_challenge_required");
    }
    return null;
  };

  const validationMessage = getValidationMessage();

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t("add_habit")}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t("habit_name")}</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder={t("habit_name")}
              placeholderTextColor={Colors.PrimaryGray}
              value={habitData.name}
              onChangeText={(text) => {
                setHabitData((prev) => ({ ...prev, name: text }));
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <ChallengeSelector
            isPartOfChallenge={habitData.isPartOfChallenge}
            challengeId={habitData.challengeId}
            onChallengeChange={(isPartOfChallenge, challengeId) => {
              setHabitData((prev) => ({
                ...prev,
                isPartOfChallenge,
                challengeId,
              }));
              setErrors((prev) => ({ ...prev, challenge: undefined }));
            }}
          />
          {errors.challenge && (
            <Text style={styles.errorText}>{errors.challenge}</Text>
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
                onToggleDay={toggleDay}
              />
              {errors.selectedDays && (
                <Text style={styles.errorText}>{errors.selectedDays}</Text>
              )}
            </>
          )}

          <DateSelector
            label={t("start_date")}
            date={habitData.startDate}
            onDateChange={(date) =>
              setHabitData((prev) => ({ ...prev, startDate: date }))
            }
            minDate={new Date()}
            maxDate={habitData.endDate}
          />

          <DateSelector
            label={t("end_date")}
            date={habitData.endDate}
            onDateChange={(date) =>
              setHabitData((prev) => ({ ...prev, endDate: date }))
            }
            minDate={habitData.startDate}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>{t("submit")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 10,
    padding: 10,
  },
  inputError: {
    borderColor: Colors.PrimaryRed,
  },
  errorText: {
    color: Colors.PrimaryRed,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    backgroundColor: Colors.LightGray,
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
    backgroundColor: Colors.HotPink,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    fontWeight: "600",
  },
  submitButtonText: {
    fontSize: 16,
    color: Colors.White,
    fontWeight: "600",
  },
  validationMessage: {
    color: Colors.HotPink,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    fontStyle: "italic",
  },
});

export default AddHabitModal;
