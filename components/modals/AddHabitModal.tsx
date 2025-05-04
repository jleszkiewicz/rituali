import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import DaySelector from "../AddHabitModal/DaySelector";
import FrequencySelector from "../AddHabitModal/FrequencySelector";
import DateSelector from "../AddHabitModal/DateSelector";
import ChallengeSelector from "../AddHabitModal/ChallengeSelector";
import { Frequency, HabitCategory, HabitData } from "../AddHabitModal/types";
import { useTranslation } from "react-i18next";
import { addHabit, updateHabit } from "@/src/service/apiService";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { selectHabits, setHabits } from "@/src/store/habitsSlice";
import { fetchUserHabits } from "@/src/service/apiService";

interface AddHabitModalProps {
  isVisible: boolean;
  onClose: () => void;
  habit?: HabitData;
}

const AddHabitModal = ({ isVisible, onClose, habit }: AddHabitModalProps) => {
  const dispatch = useDispatch();
  const habits = useSelector(selectHabits);
  const habitDataInitialState = {
    id: "",
    name: "",
    frequency: "daily" as Frequency,
    selectedDays: [],
    challengeId: null,
    category: "other" as HabitCategory,
    isPartOfChallenge: false,
    startDate: "01.01.2025",
    endDate: "01.01.2025",
    completionDates: [],
  };
  const { t } = useTranslation();
  const userId = useSelector(selectUserId);
  const [habitData, setHabitData] = useState<HabitData>(
    habit ? habit : habitDataInitialState
  );
  const [errors, setErrors] = useState<{
    name: string;
    category: string;
    challenge?: string;
    selectedDays?: string;
  }>({
    name: "",
    category: "",
  });
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);

  useEffect(() => {
    console.log("Received habit prop:", habit);
    if (habit) {
      const startDate = new Date(habit.startDate);
      const endDate = new Date(habit.endDate);

      console.log("Parsed dates:", {
        startDate: startDate,
        endDate: endDate,
        startDateString: habit.startDate,
        endDateString: habit.endDate,
      });

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error("Invalid dates in habit:", habit);
        return;
      }

      setHabitData({
        ...habit,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });
    } else {
      const today = new Date();
      setHabitData({
        ...habitDataInitialState,
        startDate: today.toISOString().split("T")[0],
        endDate: today.toISOString().split("T")[0],
      });
    }
  }, [habit]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      category: "",
      challenge: "",
      selectedDays: "",
    };

    if (!habitData.name.trim()) {
      newErrors.name = t("habit_name_required");
    }

    if (!habitData.category) {
      newErrors.category = t("category_required");
    }

    if (
      habitData.frequency === "selected_days" &&
      habitData.selectedDays.length === 0
    ) {
      newErrors.selectedDays = t("select_at_least_one_day");
    }

    if (habitData.isPartOfChallenge && !habitData.challengeId) {
      newErrors.challenge = t("select_challenge_required");
    }

    setErrors(newErrors);
    return (
      !newErrors.name &&
      !newErrors.category &&
      !newErrors.selectedDays &&
      !newErrors.challenge
    );
  };

  const handleSubmit = async () => {
    if (!validateForm() || !userId) return;

    try {
      if (habit) {
        await updateHabit(habit.id, {
          ...habitData,
          startDate: new Date(habitData.startDate).toISOString().split("T")[0],
          endDate: new Date(habitData.endDate).toISOString().split("T")[0],
        });
      } else {
        await addHabit(userId, {
          ...habitData,
          startDate: new Date(habitData.startDate).toISOString().split("T")[0],
          endDate: new Date(habitData.endDate).toISOString().split("T")[0],
        });
      }

      // Pobierz najnowsze dane z serwera
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
          <Text style={styles.title}>{t("add_habit")}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("habit_name")}</Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={habitData.name}
              onChangeText={(text) =>
                setHabitData({ ...habitData, name: text })
              }
              placeholder={t("habit_name")}
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("category")}</Text>
            <TouchableOpacity
              style={[
                styles.dropdownHeader,
                errors.category ? styles.inputError : null,
              ]}
              onPress={() => setIsCategoryExpanded(!isCategoryExpanded)}
            >
              <Text style={styles.dropdownHeaderText}>
                {habitData.category
                  ? t(`category_${habitData.category}`)
                  : t("select_category")}
              </Text>
              <Text style={styles.dropdownArrow}>
                {isCategoryExpanded ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>

            {isCategoryExpanded && (
              <ScrollView style={styles.dropdownContent}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setHabitData({ ...habitData, category: "health" });
                    setIsCategoryExpanded(false);
                  }}
                >
                  <Text>{t("category_health")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setHabitData({ ...habitData, category: "fitness" });
                    setIsCategoryExpanded(false);
                  }}
                >
                  <Text>{t("category_fitness")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setHabitData({ ...habitData, category: "beauty" });
                    setIsCategoryExpanded(false);
                  }}
                >
                  <Text>{t("category_beauty")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setHabitData({ ...habitData, category: "mindfulness" });
                    setIsCategoryExpanded(false);
                  }}
                >
                  <Text>{t("category_mindfulness")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setHabitData({ ...habitData, category: "education" });
                    setIsCategoryExpanded(false);
                  }}
                >
                  <Text>{t("category_education")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setHabitData({
                      ...habitData,
                      category: "self-development",
                    });
                    setIsCategoryExpanded(false);
                  }}
                >
                  <Text>{t("category_self-development")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setHabitData({ ...habitData, category: "other" });
                    setIsCategoryExpanded(false);
                  }}
                >
                  <Text>{t("category_other")}</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {errors.category ? (
              <Text style={styles.errorText}>{errors.category}</Text>
            ) : null}
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
                onToggleDay={handleDaySelect}
              />
              {errors.selectedDays && (
                <Text style={styles.errorText}>{errors.selectedDays}</Text>
              )}
            </>
          )}

          <DateSelector
            label={t("start_date")}
            date={new Date(habitData.startDate)}
            onDateChange={(date) =>
              setHabitData((prev) => ({
                ...prev,
                startDate: date.toISOString().split("T")[0],
              }))
            }
            minDate={new Date()}
            maxDate={new Date(habitData.endDate)}
          />

          <DateSelector
            label={t("end_date")}
            date={new Date(habitData.endDate)}
            onDateChange={(date) =>
              setHabitData((prev) => ({
                ...prev,
                endDate: date.toISOString().split("T")[0],
              }))
            }
            minDate={new Date(habitData.startDate)}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>{t("cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>{t("submit")}</Text>
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: "100%",
    maxHeight: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
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
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 5,
  },
  dropdownHeaderText: {
    fontSize: 16,
  },
  dropdownArrow: {
    fontSize: 12,
  },
  dropdownContent: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    zIndex: 2,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 120,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  submitButton: {
    backgroundColor: Colors.HotPink,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddHabitModal;
