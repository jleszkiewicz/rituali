import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Switch,
  Pressable,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
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
  }>({
    name: "",
    challenges: "",
  });

  const defaultHabitData: HabitData = {
    id: "",
    name: "",
    category: "other",
    startDate: format(new Date(), dateFormat),
    endDate: null,
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
    if (!userId || !habit) return;

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
      await updateHabit(habit.id, {
        ...habitData,
        isPartOfChallenge: isPartOfChallenge,
      });

      if (isPartOfChallenge && selectedChallengeIds.length > 0) {
        await Promise.all(
          selectedChallengeIds.map((challengeId) =>
            updateChallengeHabits(challengeId, [habit.id])
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
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ModalHeader
          title={t("edit_habit")}
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
                title={t("select_challenge")}
                error={errors.challenges}
              >
                {challenges
                  .filter((challenge) => challenge.status === "active")
                  .map((challenge) => (
                    <TouchableOpacity
                      key={challenge.id}
                      style={styles.challengeItem}
                      onPress={() => handleChallengeChange(challenge.id)}
                    >
                      <View style={styles.challengeCheckbox}>
                        {selectedChallengeIds.includes(challenge.id) && (
                          <View style={styles.checkboxInner} />
                        )}
                      </View>
                      <ThemedText style={styles.challengeName}>
                        {challenge.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
              </Dropdown>
            </View>
          )}
        </ScrollView>

        <ModalButtons
          onCancel={handleCloseModal}
          onSubmit={handleSubmit}
          submitText={t("submit")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: Colors.White,
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
  },
  scrollView: {
    maxHeight: "80%",
  },
  scrollContent: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
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
    fontSize: 12,
    marginTop: 5,
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

export default EditHabitModal;
