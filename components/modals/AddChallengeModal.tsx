import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, Animated } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import {
  addChallenge,
  fetchUserChallenges,
  updateHabit,
  fetchUserHabits,
} from "@/src/service/apiService";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { setChallenges } from "@/src/store/challengesSlice";
import { setHabits } from "@/src/store/habitsSlice";
import DateSelector from "../AddHabitModal/DateSelector";
import AddHabitModal from "./AddHabitModal";
import ChallengeNameInput from "../AddChallengeModal/ChallengeNameInput";
import DurationInput from "../AddChallengeModal/DurationInput";
import HabitsSelector from "../AddChallengeModal/HabitsSelector";
import ModalButtons from "../AddChallengeModal/ModalButtons";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";

interface AddChallengeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AddChallengeModal({
  isVisible,
  onClose,
}: AddChallengeModalProps) {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const [challengeData, setChallengeData] = useState<ChallengeData>({
    id: "",
    name: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    habits: [],
  });
  const [durationDays, setDurationDays] = useState("30");
  const [errors, setErrors] = useState({
    name: "",
    durationDays: "",
    habits: "",
  });
  const [isHabitsExpanded, setIsHabitsExpanded] = useState(false);
  const [isAddHabitModalVisible, setIsAddHabitModalVisible] = useState(false);
  const [modalHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(modalHeight, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(modalHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isAddHabitModalVisible) {
      Animated.timing(modalHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(modalHeight, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isAddHabitModalVisible]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      durationDays: "",
      habits: "",
    };

    if (!challengeData.name.trim()) {
      newErrors.name = t("challenge_name_required");
    }

    const days = parseInt(durationDays);
    if (!days || days < 1 || days > 1000) {
      newErrors.durationDays = t("duration_days_required");
    }

    if (challengeData.habits.length === 0) {
      newErrors.habits = t("select_at_least_one_habit");
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.durationDays && !newErrors.habits;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !userId) return;

    try {
      const days = parseInt(durationDays);
      const endDate = new Date(challengeData.startDate);
      endDate.setDate(endDate.getDate() + days - 1);

      const newChallenge = await addChallenge(userId, {
        ...challengeData,
        endDate: endDate.toISOString(),
      });

      // Get all habits
      const allHabits = await fetchUserHabits(userId);

      // Update habits that are part of this challenge
      const updatedHabits = await Promise.all(
        allHabits.map((habit) =>
          challengeData.habits.includes(habit.id)
            ? updateHabit(habit.id, {
                ...habit,
                isPartOfChallenge: true,
                challenges: [...habit.challenges, newChallenge[0].id],
              })
            : Promise.resolve(habit)
        )
      );

      // Fetch fresh data for both challenges and habits
      const [freshChallenges, freshHabits] = await Promise.all([
        fetchUserChallenges(userId),
        fetchUserHabits(userId),
      ]);

      // Update store with fresh data
      dispatch(setChallenges(freshChallenges));
      dispatch(setHabits(freshHabits));

      setChallengeData({
        id: "",
        name: "",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        habits: [],
      });
      setDurationDays("30");
      onClose();
    } catch (error) {
      console.error("Error adding challenge:", error);
    }
  };

  const toggleHabit = (habitId: string) => {
    setChallengeData((prev) => ({
      ...prev,
      habits: prev.habits.includes(habitId)
        ? prev.habits.filter((id) => id !== habitId)
        : [...prev.habits, habitId],
    }));
    setErrors((prev) => ({ ...prev, habits: "" }));
  };

  const handleAddHabit = () => {
    setIsAddHabitModalVisible(false);
  };

  const handleDurationChange = (text: string) => {
    const number = parseInt(text);
    if (!isNaN(number) && number >= 1 && number <= 1000) {
      setDurationDays(text);
      const endDate = new Date(challengeData.startDate);
      endDate.setDate(endDate.getDate() + number - 1);
      setChallengeData({
        ...challengeData,
        endDate: endDate.toISOString(),
      });
      setErrors({ ...errors, durationDays: "" });
    } else if (text === "") {
      setDurationDays(text);
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
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                {
                  translateY: modalHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1000, 0],
                  }),
                },
              ],
              opacity: modalHeight,
            },
          ]}
        >
          <ThemedText style={styles.title} bold>
            {t("add_challenge")}
          </ThemedText>

          <ChallengeNameInput
            value={challengeData.name}
            error={errors.name}
            onChange={(text) => {
              setChallengeData({ ...challengeData, name: text });
              setErrors({ ...errors, name: "" });
            }}
          />

          <DateSelector
            label={t("start_date")}
            date={new Date(challengeData.startDate)}
            onDateChange={(date) =>
              setChallengeData({
                ...challengeData,
                startDate: date.toISOString(),
              })
            }
            minDate={new Date()}
            maxDate={new Date(challengeData.endDate)}
          />

          <DurationInput
            value={durationDays}
            error={errors.durationDays}
            onChange={handleDurationChange}
          />

          <HabitsSelector
            selectedHabits={challengeData.habits}
            error={errors.habits}
            isExpanded={isHabitsExpanded}
            onToggleExpanded={() => setIsHabitsExpanded(!isHabitsExpanded)}
            onToggleHabit={toggleHabit}
            onAddHabit={() => setIsAddHabitModalVisible(true)}
          />

          <ModalButtons onCancel={onClose} onSubmit={handleSubmit} />
        </Animated.View>
      </View>

      <AddHabitModal
        isVisible={isAddHabitModalVisible}
        onClose={handleAddHabit}
      />
    </Modal>
  );
}

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
    marginBottom: 20,
    textAlign: "center",
  },
});
