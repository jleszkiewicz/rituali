import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Switch,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
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
  onSuccess?: (isPartOfChallenge: boolean) => void;
}

const AddHabitModal = ({
  isVisible,
  onClose,
  onSuccess,
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
  }>({
    name: "",
    challenges: "",
  });

  const habitDataInitialState: HabitData = {
    id: "",
    name: "",
    category: "other",
    startDate: format(new Date(), dateFormat),
    endDate: null,
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

  const handleSubmit = async () => {
    if (!userId) return;

    const newErrors = {
      name: "",
      challenges: "",
    };

    if (!habitData.name.trim()) {
      newErrors.name = t("habit_name_required");
    }

    if (isPartOfChallenge && selectedChallengeIds.length === 0) {
      newErrors.challenges = t("select_challenge_required");
    }

    if (newErrors.name || newErrors.challenges) {
      setErrors(newErrors);
      return;
    }

    try {
      const newHabit = await addHabit(userId, {
        ...habitData,
        isPartOfChallenge: isPartOfChallenge,
      });

      if (isPartOfChallenge && selectedChallengeIds.length > 0) {
        await Promise.all(
          selectedChallengeIds.map((challengeId) =>
            updateChallengeHabits(challengeId, [newHabit[0].id])
          )
        );
      }

      const [updatedHabits, updatedChallenges] = await Promise.all([
        fetchUserHabits(userId),
        fetchUserChallenges(userId),
      ]);

      dispatch(setHabits(updatedHabits));
      dispatch(setChallenges(updatedChallenges));

      handleCloseModal();
      if (onSuccess) {
        onSuccess(isPartOfChallenge);
      }
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ModalHeader
          title={t("add_habit")}
          onClose={handleCloseModal}
          color={Colors.PrimaryGray}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label} bold>
              {t("habit_name")}
            </ThemedText>
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
            <View style={styles.challengesContainer}>
              <ThemedText style={styles.label} bold>
                {t("select_challenge")}
              </ThemedText>
              <Dropdown
                isExpanded={isChallengesExpanded}
                onToggle={() => setIsChallengesExpanded(!isChallengesExpanded)}
                selectedText={
                  selectedChallengeIds.length > 0
                    ? `${t("selected_challenges")}: ${
                        selectedChallengeIds.length
                      }`
                    : ""
                }
                placeholder={t("select_challenge")}
                items={challenges
                  .filter((challenge) => {
                    const today = new Date();
                    const startDate = new Date(challenge.startDate);
                    const endDate = new Date(challenge.endDate);
                    return today >= startDate && today <= endDate;
                  })
                  .map((challenge) => ({
                    id: challenge.id,
                    label: challenge.name,
                    isSelected: selectedChallengeIds.includes(challenge.id),
                  }))}
                onItemSelect={handleChallengeChange}
                noItemsText={t("no_active_challenges")}
                error={errors.challenges}
              />
            </View>
          )}

          <ModalButtons onCancel={handleCloseModal} onSubmit={handleSubmit} />
        </ScrollView>
      </View>
    </View>
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
  scrollView: {
    maxHeight: "100%",
  },
  scrollContent: {
    paddingBottom: 20,
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
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.HotPink,
  },
  errorText: {
    color: Colors.HotPink,
    fontSize: 14,
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  switchText: {
    fontSize: 16,
  },
  challengesContainer: {
    marginBottom: 20,
  },
  challengeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  challengeCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.HotPink,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: Colors.HotPink,
    borderRadius: 2,
  },
  challengeName: {
    fontSize: 16,
  },
});

export default AddHabitModal;
