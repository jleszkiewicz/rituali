import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { t } from "@/src/service/translateService";
import { ThemedText } from "@/components/Commons/ThemedText";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId, selectDisplayName } from "@/src/store/userSlice";
import { selectHabits } from "@/src/store/habitsSlice";
import { setChallenges } from "@/src/store/challengesSlice";
import { setHabits } from "@/src/store/habitsSlice";
import HabitsSection from "@/components/modals/ChallengeInfoModal/HabitsSection";
import SelectHabitsModal from "@/components/modals/SelectHabitsModal";
import ConfirmationModal from "@/components/modals/DeleteAccountModal";
import { HabitData } from "@/components/AddHabitModal/types";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import CompletionStats from "@/components/SharedChallengeScreen/CompletionStats";
import PrimaryButton from "@/components/Commons/PrimaryButton";
import { supabase } from "@/src/service/supabaseClient";
import {
  fetchSharedChallenge,
  fetchChallengeParticipants,
  deleteSharedChallenge,
  updateChallengeHabits,
  fetchUserHabits,
  fetchUserChallenges,
  fetchChallengeCompletionHistory,
} from "@/src/service/apiService";
import Loading from "@/components/Commons/Loading";

interface ParticipantStats {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  completionHistory: {
    date: string;
    completion_percentage: number;
  }[];
}

export default function ChallengeInfoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const displayName = useSelector(selectDisplayName);
  const habits = useSelector(selectHabits);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [participantsStats, setParticipantsStats] = useState<
    ParticipantStats[]
  >([]);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);
  const [isSelectHabitsModalVisible, setIsSelectHabitsModalVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadChallenge();
    }
  }, [id]);

  const loadChallenge = async () => {
    try {
      const challengeData = await fetchSharedChallenge(id as string);
      setChallenge(challengeData);

      if (challengeData && userId) {
        const history = await fetchChallengeCompletionHistory(
          challengeData.id,
          userId
        );

        setParticipantsStats([
          {
            id: userId,
            display_name: displayName,
            avatar_url: null,
            completionHistory: history,
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading challenge:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userId || !challenge) return;
    try {
      await deleteSharedChallenge(challenge.id);
      const updatedChallenges = await fetchUserChallenges(userId);
      dispatch(setChallenges(updatedChallenges));
      router.back();
    } catch (error) {
      console.error("Error deleting challenge:", error);
    }
  };

  const handleAddHabit = () => {
    setIsSelectHabitsModalVisible(true);
  };

  const handleSelectHabits = async (selectedHabits: HabitData[]) => {
    if (!userId || !challenge) return;

    try {
      const currentHabits = challenge.habits.filter((habitId) => {
        const habit = habits.find((h) => h.id === habitId);
        return habit && habit.status === "active";
      });

      const updatedChallengeHabits = [
        ...currentHabits,
        ...selectedHabits.map((h) => h.id),
      ];
      await updateChallengeHabits(challenge.id, updatedChallengeHabits);

      const [updatedHabits, updatedChallenges] = await Promise.all([
        fetchUserHabits(userId),
        fetchUserChallenges(userId),
      ]);

      dispatch(setHabits(updatedHabits));
      dispatch(setChallenges(updatedChallenges));
      loadChallenge();

      setIsSelectHabitsModalVisible(false);
    } catch (error) {
      console.error("Error adding habits to challenge:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={styles.container}>
        <ThemedText>{t("loading")}</ThemedText>
      </View>
    );
  }

  const challengeHabits = habits.filter(
    (habit) => challenge.habits.includes(habit.id) && habit.status === "active"
  );

  return (
    <ScreenWrapper>
      <ScreenHeader
        title={challenge.name}
        onBack={() => router.push("/challenges")}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <HabitsSection
          habits={challengeHabits}
          challengeId={challenge.id}
          headerColor={Colors.PrimaryGray}
          onAddHabit={handleAddHabit}
        />

        <ThemedText style={styles.sectionTitle} bold>
          {t("completion_stats")}
        </ThemedText>

        <CompletionStats
          participants={participantsStats}
          currentUserId={userId}
          challengeStartDate={challenge.startDate}
          challengeEndDate={challenge.endDate}
          hideLegend={true}
        />

        <PrimaryButton
          style={styles.deleteButton}
          onPress={() => setIsDeleteConfirmationVisible(true)}
        >
          <ThemedText style={styles.deleteButtonText} bold>
            {t("delete_challenge")}
          </ThemedText>
        </PrimaryButton>
      </ScrollView>

      <SelectHabitsModal
        isVisible={isSelectHabitsModalVisible}
        onClose={() => setIsSelectHabitsModalVisible(false)}
        availableHabits={habits.filter(
          (habit) =>
            !challenge.habits.includes(habit.id) && habit.status === "active"
        )}
        onSelectHabits={handleSelectHabits}
      />

      <ConfirmationModal
        isVisible={isDeleteConfirmationVisible}
        onClose={() => setIsDeleteConfirmationVisible(false)}
        onConfirm={handleDelete}
        title={t("delete_challenge_confirmation_title")}
        message={t("delete_challenge_confirmation_message")}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.PrimaryGray,
    marginVertical: 10,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 15,
    marginVertical: 20,
    backgroundColor: Colors.HotPink,
  },
  deleteButtonText: {
    color: Colors.White,
    fontSize: 16,
  },
});
