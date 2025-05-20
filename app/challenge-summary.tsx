import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useChallenges } from "@/src/hooks/useChallenges";
import { ChallengeHeader } from "@/components/ChallengeSummary/ChallengeHeader";
import { ChallengeDates } from "@/components/ChallengeSummary/ChallengeDates";
import { ChallengeStats } from "@/components/ChallengeSummary/ChallengeStats";
import { ChallengeHabits } from "@/components/ChallengeSummary/ChallengeHabits";
import { t } from "@/src/service/translateService";
import { HabitData } from "@/components/AddHabitModal/types";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { supabase } from "@/src/service/supabaseClient";
import { ThemedText } from "@/components/Commons/ThemedText";
import AddAfterPhotoModal from "@/components/modals/AddAfterPhotoModal";

interface Challenge {
  id: string;
  name: string;
  beforePhotoUri: string | null;
  afterPhotoUri: string | null;
  endDate: string;
  startDate: string;
  habits: string[];
}

export default function ChallengeSummaryScreen() {
  const { challengeId } = useLocalSearchParams();
  const router = useRouter();
  const { getChallengeById } = useChallenges();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddAfterPhotoModalVisible, setIsAddAfterPhotoModalVisible] =
    useState(false);
  const habits: HabitData[] = useSelector(
    (state: RootState) => state.habits.habits
  );

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const { data, error } = await supabase
          .from("challenges")
          .select("*")
          .eq("id", challengeId)
          .single();

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        if (data) {
          const challengeData = {
            id: data.id,
            name: data.name,
            beforePhotoUri: data.before_photo_uri,
            afterPhotoUri: data.after_photo_uri,
            endDate: data.end_date,
            startDate: data.start_date,
            habits: data.habits || [],
          };
          setChallenge(challengeData);
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId]);

  const handlePhotoAdded = async () => {
    setIsAddAfterPhotoModalVisible(false);
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("id", challengeId)
      .single();

    if (!error && data) {
      setChallenge({
        id: data.id,
        name: data.name,
        beforePhotoUri: data.before_photo_uri,
        afterPhotoUri: data.after_photo_uri,
        endDate: data.end_date,
        startDate: data.start_date,
        habits: data.habits || [],
      });
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </ScreenWrapper>
    );
  }

  if (!challenge) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <ThemedText>Challenge not found</ThemedText>
        </View>
      </ScreenWrapper>
    );
  }

  const challengeHabits = habits.filter((habit) => {
    return challenge?.habits?.includes(habit.id);
  });

  const startDate = new Date(challenge?.startDate || "");
  const endDate = new Date(challenge?.endDate || "");
  const totalDays =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  const totalCompletions = challengeHabits.reduce(
    (total: number, habit: HabitData) => {
      return (
        total +
        (habit.completionDates?.filter((date: string) => {
          const completionDate = new Date(date);
          return completionDate >= startDate && completionDate <= endDate;
        }).length || 0)
      );
    },
    0
  );

  const completionRate = Math.round(
    (totalCompletions / (totalDays * challengeHabits.length)) * 100
  );

  return (
    <ScreenWrapper>
      <ScreenHeader
        title={t("challenge_summary")}
        onBack={() => router.back()}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <ChallengeHeader title={challenge.name} />

        <ChallengeDates startDate={startDate} endDate={endDate} />

        <ChallengeStats
          totalDays={totalDays}
          totalCompletions={totalCompletions}
          completionRate={completionRate}
        />

        <ChallengeHabits
          habits={challengeHabits}
          startDate={startDate}
          endDate={endDate}
          totalDays={totalDays}
        />

        {!challenge.afterPhotoUri && (
          <View style={styles.afterPhotoSection}>
            <ThemedText style={styles.sectionTitle}>
              {t("add_after_photo")}
            </ThemedText>
            <ThemedText style={styles.description}>
              {t("add_after_photo_description")}
            </ThemedText>
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={() => setIsAddAfterPhotoModalVisible(true)}
            >
              <ThemedText style={styles.buttonText}>
                {t("add_photo")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {challenge.beforePhotoUri && (
          <View style={styles.photoSection}>
            <ThemedText style={styles.sectionTitle}>
              {t("before_photo")}
            </ThemedText>
            <Image
              source={{ uri: challenge.beforePhotoUri }}
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
        )}

        {challenge.afterPhotoUri && challenge.afterPhotoUri !== "skipped" && (
          <View style={styles.photoSection}>
            <ThemedText style={styles.sectionTitle}>
              {t("after_photo")}
            </ThemedText>
            <Image
              source={{ uri: challenge.afterPhotoUri }}
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
        )}
      </ScrollView>

      <AddAfterPhotoModal
        isVisible={isAddAfterPhotoModalVisible}
        onClose={() => setIsAddAfterPhotoModalVisible(false)}
        challengeId={challenge.id}
        onPhotoAdded={handlePhotoAdded}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.PrimaryGray,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.PrimaryGray,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    marginBottom: 16,
  },
  afterPhotoSection: {
    backgroundColor: Colors.White,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.PrimaryGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoSection: {
    marginBottom: 24,
  },
  photo: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  addPhotoButton: {
    backgroundColor: Colors.PrimaryPink,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "600",
  },
});
