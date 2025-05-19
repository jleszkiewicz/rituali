import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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

export default function ChallengeSummaryScreen() {
  const { challengeId } = useLocalSearchParams();
  const router = useRouter();
  const { getChallengeById } = useChallenges();
  const challenge = getChallengeById(challengeId as string);
  const habits: HabitData[] = useSelector(
    (state: RootState) => state.habits.habits
  );

  if (!challenge) {
    return null;
  }

  const challengeHabits = habits.filter((habit) => {
    return challenge.habits.includes(habit.id);
  });

  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const totalDays =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  const totalCompletions = challengeHabits.reduce(
    (total: number, habit: HabitData) => {
      return (
        total +
        habit.completionDates.filter((date: string) => {
          const completionDate = new Date(date);
          return completionDate >= startDate && completionDate <= endDate;
        }).length
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
      </ScrollView>
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
});
