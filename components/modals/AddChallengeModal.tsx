import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import {
  fetchUserChallenges,
  fetchUserHabits,
  addChallenge,
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
import { format } from "date-fns";
import { dateFormat } from "@/constants/Constants";
import ModalHeader from "./ChallengeInfoModal/ModalHeader";

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
    startDate: format(new Date(), dateFormat),
    endDate: format(new Date(), dateFormat),
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

  useEffect(() => {
    if (isVisible) {
      // No need to animate the modal content as it's handled by the Pressable component
    }
  }, [isVisible]);

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

      const challengeToSubmit = {
        ...challengeData,
        endDate: format(endDate, dateFormat),
      };

      await addChallenge(userId, challengeToSubmit);

      const [freshChallenges, freshHabits] = await Promise.all([
        fetchUserChallenges(userId),
        fetchUserHabits(userId),
      ]);

      dispatch(setChallenges(freshChallenges));
      dispatch(setHabits(freshHabits));

      setChallengeData({
        id: "",
        name: "",
        startDate: format(new Date(), dateFormat),
        endDate: format(new Date(), dateFormat),
        habits: [],
      });
      setDurationDays("30");
      setIsHabitsExpanded(false);
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
        endDate: format(endDate, dateFormat),
      });
      setErrors({ ...errors, durationDays: "" });
    } else if (text === "") {
      setDurationDays(text);
    }
  };

  if (!isVisible) return null;

  return (
    <Pressable style={styles.modalContainer} onPress={onClose}>
      <Pressable
        style={styles.modalContent}
        onPress={(e) => e.stopPropagation()}
      >
        <ModalHeader
          title={t("add_challenge")}
          onClose={onClose}
          color={Colors.PrimaryGray}
        />

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
              startDate: format(date, dateFormat),
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
      </Pressable>

      <AddHabitModal
        isVisible={isAddHabitModalVisible}
        onClose={handleAddHabit}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    width: "100%",
    maxHeight: "90%",
  },
});
