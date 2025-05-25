import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import {
  fetchUserChallenges,
  fetchUserHabits,
  addChallenge,
  fetchFriends,
  sendChallengeInvitation,
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
import { Switch } from "react-native";
import Dropdown from "../Commons/Dropdown";
import CustomModal from "../Commons/CustomModal";

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
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    habits: [],
    beforePhotoUri: "",
    afterPhotoUri: "",
    participants: [userId],
  });
  const [durationDays, setDurationDays] = useState("30");
  const [errors, setErrors] = useState({
    name: "",
    durationDays: "",
    habits: "",
  });
  const [isHabitsExpanded, setIsHabitsExpanded] = useState(false);
  const [isWithBuddy, setIsWithBuddy] = useState(false);
  const [isBuddyExpanded, setIsBuddyExpanded] = useState(false);
  const [selectedBuddies, setSelectedBuddies] = useState<string[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type: "success" | "error";
  }>({
    title: "",
    message: "",
    type: "success",
  });

  useEffect(() => {
    const loadFriends = async () => {
      if (userId) {
        try {
          setIsLoadingFriends(true);
          const friendsList = await fetchFriends(userId);
          setFriends(friendsList || []);
        } catch (error) {
          console.error("Error fetching friends:", error);
          setFriends([]);
        } finally {
          setIsLoadingFriends(false);
        }
      }
    };
    loadFriends();
  }, [userId]);

  const showModal = (
    title: string,
    message: string,
    type: "success" | "error"
  ) => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

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
        name: challengeData.name,
        startDate: challengeData.startDate,
        endDate: format(endDate, dateFormat),
        habits: challengeData.habits,
        beforePhotoUri: challengeData.beforePhotoUri || "",
      };

      const newChallenge = await addChallenge(userId, challengeToSubmit);

      if (isWithBuddy && selectedBuddies.length > 0) {
        // Send invitations to selected buddies
        await Promise.all(
          selectedBuddies.map((buddyId) =>
            sendChallengeInvitation(newChallenge.id, userId, buddyId)
          )
        );
      }

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
        afterPhotoUri: "",
        participants: [userId],
      });
      setDurationDays("30");
      setIsHabitsExpanded(false);
      setIsWithBuddy(false);
      setSelectedBuddies([]);

      showModal(
        t("success"),
        isWithBuddy
          ? t("challenge_created_with_invitations")
          : t("challenge_created"),
        "success"
      );

      onClose();
    } catch (error) {
      console.error("Error adding challenge:", error);
      showModal(t("error"), t("unknown_error"), "error");
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

  const handleSendInvitations = async () => {
    if (!userId || !selectedBuddies.length) return;

    try {
      await Promise.all(
        selectedBuddies.map((buddyId) =>
          sendChallengeInvitation(challengeData.id, userId, buddyId)
        )
      );
      onClose();
    } catch (error) {
      console.error("Error sending invitations:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.container}>
        <TouchableWithoutFeedback>
          <View style={styles.content}>
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
              <View style={styles.formContainer}>
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
                  onToggleExpanded={() =>
                    setIsHabitsExpanded(!isHabitsExpanded)
                  }
                  onToggleHabit={toggleHabit}
                  onAddHabit={onAddHabit}
                />

                <View style={styles.buddyContainer}>
                  <ThemedText style={styles.label}>
                    {t("challenge_with_buddy")}
                  </ThemedText>
                  <Switch
                    value={isWithBuddy}
                    onValueChange={setIsWithBuddy}
                    trackColor={{
                      false: Colors.LightGray,
                      true: Colors.HotPink,
                    }}
                    thumbColor={Colors.White}
                  />
                </View>

                {isWithBuddy && (
                  <View style={styles.buddySelector}>
                    <Dropdown
                      isExpanded={isBuddyExpanded}
                      onToggle={() => setIsBuddyExpanded(!isBuddyExpanded)}
                      selectedText={
                        selectedBuddies.length > 0
                          ? `${t("selected_friends")}: ${
                              selectedBuddies.length
                            }`
                          : ""
                      }
                      placeholder={t("select_buddy")}
                      items={friends.map((friend) => ({
                        id: friend.id,
                        label: friend.display_name || t("unknown_user"),
                        isSelected: selectedBuddies.includes(friend.id),
                      }))}
                      onItemSelect={(id) => {
                        setSelectedBuddies((prev) =>
                          prev.includes(id)
                            ? prev.filter((buddyId) => buddyId !== id)
                            : [...prev, id]
                        );
                      }}
                      noItemsText={
                        isLoadingFriends ? t("loading") : t("no_friends")
                      }
                    />
                  </View>
                )}

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
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>

        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
        />
      </View>
    </TouchableWithoutFeedback>
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
    flexGrow: 1,
  },
  formContainer: {
    paddingBottom: 20,
  },
  buddyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  buddySelector: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.PrimaryGray,
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
