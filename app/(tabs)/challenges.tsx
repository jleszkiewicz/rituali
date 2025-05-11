import React from "react";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import { t } from "@/src/service/translateService";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import RecommendedChallenge from "@/components/ChallengesScreen/RecommendedChallenge";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { ThemedText } from "@/components/Commons/ThemedText";
import { useSelector } from "react-redux";
import { selectChallenges } from "@/src/store/challengesSlice";
import { selectHabits } from "@/src/store/habitsSlice";
import YourChallengeCard from "@/components/ChallengesScreen/YourChallengeCard";

const ChallengesScreen = () => {
  const challenges = useSelector(selectChallenges);
  const habits = useSelector(selectHabits);
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth * 0.8;

  return (
    <ScreenWrapper>
      <ScreenHeader title={t("challenges")} />
      <ScrollView>
        <View style={styles.section}>
          <ThemedText bold style={styles.sectionTitle}>
            {t("your_challenges")}
          </ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {challenges.map((challenge) => (
              <YourChallengeCard
                key={challenge.id}
                challenge={challenge}
                habits={habits}
                width={cardWidth}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <ThemedText bold style={styles.sectionTitle}>
            {t("recommended_challenges")}
          </ThemedText>
          <RecommendedChallenge />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default ChallengesScreen;
