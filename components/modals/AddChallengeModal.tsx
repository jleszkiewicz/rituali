import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
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
import ChallengeNameInput from "../AddChallengeModal/ChallengeNameInput";
import DurationInput from "../AddChallengeModal/DurationInput";
import HabitsSelector from "../AddChallengeModal/HabitsSelector";
import ModalButtons from "../AddChallengeModal/ModalButtons";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import { format } from "date-fns";
import { dateFormat } from "@/constants/Constants";
import ModalHeader from "./ChallengeInfoModal/ModalHeader";
import PhotoPicker from "../Commons/PhotoPicker";
import * as ImagePicker from "expo-image-picker";

interface AddChallengeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddHabit?: () => void;
}

export default function AddChallengeModal({
  isVisible,
  onClose,
  onAddHabit,
}: AddChallengeModalProps) {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const [challengeData, setChallengeData] = useState<ChallengeData>({
    id: "",
    name: "",
    startDate: format(new Date(), dateFormat),
    endDate: format(new Date(), dateFormat),
    habits: [],
    beforePhotoUri: "",
  });
  const [durationDays, setDurationDays] = useState("30");
  const [errors, setErrors] = useState({
    name: "",
    durationDays: "",
    habits: "",
  });
  const [isHabitsExpanded, setIsHabitsExpanded] = useState(false);

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
        beforePhotoUri: "",
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

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setChallengeData({
          ...challengeData,
          beforePhotoUri: result.assets[0].uri,
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleRemovePhoto = () => {
    setChallengeData({
      ...challengeData,
      beforePhotoUri: "",
    });
  };

  if (!isVisible) return null;

  return (
    <Pressable style={styles.container} onPress={onClose}>
      <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
        <ModalHeader
          title={t("add_challenge")}
          onClose={onClose}
          color={Colors.PrimaryGray}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
            onAddHabit={onAddHabit}
          />

          <View style={styles.photoSection}>
            <ThemedText style={styles.sectionTitle} bold>
              {t("before_photo")}
            </ThemedText>
            <ThemedText style={styles.description}>
              {t("before_photo_description")}
            </ThemedText>
            <PhotoPicker
              onPress={handlePickImage}
              height={200}
              style={styles.photo}
              imageUri={challengeData.beforePhotoUri}
              onRemove={handleRemovePhoto}
            />
          </View>

          <View style={styles.buttonsContainer}>
            <ModalButtons onCancel={onClose} onSubmit={handleSubmit} />
          </View>
        </ScrollView>
      </Pressable>
    </Pressable>
  );
}

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
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  photoSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.PrimaryGray,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    marginBottom: 12,
  },
  photo: {
    width: "100%",
    borderRadius: 12,
  },
  buttonsContainer: {
    marginBottom: 20,
  },
});
