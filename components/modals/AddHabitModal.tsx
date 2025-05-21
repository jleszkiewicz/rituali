import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Switch,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import DaySelector from "../AddHabitModal/DaySelector";
import FrequencySelector from "../AddHabitModal/FrequencySelector";
import { HabitData } from "../AddHabitModal/types";
import { addHabit, updateChallengeHabits } from "@/src/service/apiService";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { setHabits } from "@/src/store/habitsSlice";
import { fetchUserHabits } from "@/src/service/apiService";
import CategoriesSelector from "../AddHabitModal/CategoriesSelector";
import { t } from "@/src/service/translateService";
import ModalButtons from "../AddChallengeModal/ModalButtons";
import { ThemedText } from "../Commons/ThemedText";
import { selectChallenges } from "@/src/store/challengesSlice";
import { format } from "date-fns";
import { dateFormat } from "@/constants/Constants";
import ModalHeader from "./ChallengeInfoModal/ModalHeader";
import { fetchUserChallenges } from "@/src/service/apiService";
import { setChallenges } from "@/src/store/challengesSlice";
import Dropdown from "../Commons/Dropdown";

interface AddHabitModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddChallenge?: () => void;
}

const AddHabitModal = ({
  isVisible,
  onClose,
  onAddChallenge,
}: AddHabitModalProps) => {
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
  const habitDataInitialState: HabitData = {
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
  const [habitData, setHabitData] = useState<HabitData>(habitDataInitialState);

  const handleCloseModal = () => {
    setHabitData(habitDataInitialState);
    setSelectedChallengeIds([]);
    setIsPartOfChallenge(false);
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
    if (!validateForm() || !userId) return;

    try {
      const habitToSubmit = {
        ...habitData,
        isPartOfChallenge: isPartOfChallenge,
      };

      const newHabits = await addHabit(userId, habitToSubmit);
      const newHabit = newHabits[0];

      if (isPartOfChallenge && selectedChallengeIds.length > 0) {
        for (const challengeId of selectedChallengeIds) {
          const challenge = challenges.find((c) => c.id === challengeId);
          if (challenge) {
            await updateChallengeHabits(challengeId, [
              ...challenge.habits,
              newHabit.id,
            ]);
          }
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

  if (!isVisible) return null;

  return (
    <Pressable style={styles.container} onPress={onClose}>
      <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
        <ModalHeader
          title={t("add_habit")}
          onClose={onClose}
          color={Colors.PrimaryGray}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>{t("habit_name")}</ThemedText>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={habitData.name}
              onChangeText={(text) => {
                setHabitData({ ...habitData, name: text });
                setErrors({ ...errors, name: "" });
              }}
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

          <FrequencySelector
            onFrequencyChange={(frequency) => {
              setHabitData({ ...habitData, frequency });
            }}
            frequency={habitData.frequency}
          />

          {habitData.frequency === "weekly" && (
            <DaySelector
              selectedDays={habitData.selectedDays}
              onDayToggle={handleDaySelect}
            />
          )}

          <View style={styles.challengeContainer}>
            <ThemedText style={styles.label}>
              {t("part_of_challenge")}
            </ThemedText>
            <Switch
              value={isPartOfChallenge}
              onValueChange={handleTogglePartOfChallenge}
              trackColor={{ false: Colors.LightGray, true: Colors.HotPink }}
              thumbColor={Colors.White}
            />
          </View>

          {isPartOfChallenge && (
            <View style={styles.challengesList}>
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
              />
              {errors.challenges ? (
                <ThemedText style={styles.errorText}>
                  {errors.challenges}
                </ThemedText>
              ) : null}
            </View>
          )}

          <ModalButtons onCancel={handleCloseModal} onSubmit={handleSubmit} />
        </ScrollView>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  content: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    width: "100%",
    maxHeight: "90%",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.PrimaryGray,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.HotPink,
  },
  errorText: {
    color: Colors.HotPink,
    fontSize: 14,
    marginTop: 5,
  },
  challengeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.HotPink,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  challengesList: {
    marginBottom: 20,
  },
  challengeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
  },
  challengeItemText: {
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
  selectedChallengeText: {
    color: Colors.HotPink,
    fontWeight: "bold",
  },
});

export default AddHabitModal;
