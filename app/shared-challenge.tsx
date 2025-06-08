import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { t } from "@/src/service/translateService";
import { ThemedText } from "@/components/Commons/ThemedText";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { selectHabits } from "@/src/store/habitsSlice";
import { setChallenges } from "@/src/store/challengesSlice";
import { setHabits } from "@/src/store/habitsSlice";
import HabitsSection from "@/components/modals/ChallengeInfoModal/HabitsSection";
import SelectHabitsModal from "@/components/modals/SelectHabitsModal";
import ConfirmationModal from "@/components/modals/DeleteAccountModal";
import { HabitData } from "@/components/AddHabitModal/types";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import ParticipantsProgress from "@/components/SharedChallengeScreen/ParticipantsProgress";
import ActionButtons from "@/components/SharedChallengeScreen/ActionButtons";
import CompletionStats from "@/components/SharedChallengeScreen/CompletionStats";
import {
  fetchSharedChallenge,
  fetchChallengeParticipants,
  leaveSharedChallenge,
  deleteSharedChallenge,
  updateChallengeHabits,
  fetchUserHabits,
  fetchUserChallenges,
  fetchChallengeCompletionHistory,
} from "@/src/service/apiService";
import Loading from "@/components/Commons/Loading";

interface ParticipantProgress {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  completion_percentage: number;
}

interface CompletionDay {
  date: string;
  completion_percentage: number;
}

interface ParticipantStats extends ParticipantProgress {
  completionHistory: CompletionDay[];
}

export default function SharedChallengeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const habits = useSelector(selectHabits);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [participants, setParticipants] = useState<ParticipantProgress[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
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

  useEffect(() => {
    setCurrentUserId(userId);
  }, [userId]);

  const loadChallenge = async () => {
    try {
      const challengeData = await fetchSharedChallenge(id as string);
      setChallenge(challengeData);

      if (challengeData) {
        const participantsData = await fetchChallengeParticipants(
          challengeData
        );
        setParticipants(participantsData);

        const participantsWithHistory = await Promise.all(
          participantsData.map(async (participant) => {
            const history = await fetchChallengeCompletionHistory(
              challengeData.id,
              participant.id
            );
            return {
              ...participant,
              completionHistory: history,
            };
          })
        );

        setParticipantsStats(participantsWithHistory);
      }
    } catch (error) {
      console.error("Error loading challenge:", error);
      router.push("/challenges");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveChallenge = async () => {
    if (!userId || !challenge) return;
    try {
      const { updatedHabits, updatedChallenges } = await leaveSharedChallenge(
        challenge.id,
        userId
      );

      dispatch(setHabits(updatedHabits));
      dispatch(setChallenges(updatedChallenges));
      router.back();
    } catch (error) {
      console.error("Error leaving challenge:", error);
    }
  };

  const handleDelete = async () => {
    if (!userId || !challenge) return;
    try {
      await deleteSharedChallenge(challenge.id);
      const updatedChallenges = await fetchUserChallenges(userId);
      dispatch(setChallenges(updatedChallenges));
      router.push("/challenges");
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
        <View>
          <HabitsSection
            habits={challengeHabits}
            challengeId={challenge.id}
            headerColor={Colors.PrimaryGray}
            onAddHabit={handleAddHabit}
          />

          <ThemedText style={styles.sectionTitle} bold>
            {t("participants_progress")}
          </ThemedText>
          <ParticipantsProgress
            participants={participants}
            currentUserId={currentUserId}
          />

          <ThemedText style={styles.sectionTitle} bold>
            {t("completion_stats")}
          </ThemedText>

          <CompletionStats
            participants={participantsStats}
            currentUserId={currentUserId}
            challengeStartDate={challenge.startDate}
            challengeEndDate={challenge.endDate}
          />

          <ActionButtons
            onLeaveChallenge={handleLeaveChallenge}
            onDeleteChallenge={() => setIsDeleteConfirmationVisible(true)}
            isCreator={challenge.participants[0] === currentUserId}
          />
        </View>
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
        message={t("delete_challenge_confirmation_message_shared")}
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
});
