import React from "react";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import { t } from "@/src/service/translateService";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import RecommendedChallenge from "@/components/ChallengesScreen/RecommendedChallenge";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/Commons/ThemedText";

const ChallengesScreen = () => {
  return (
    <ScreenWrapper>
      <ScreenHeader title={t("challenges")} />
      <View style={styles.challengesContainer}>
        <ThemedText bold style={styles.challengesTitle}>
          Recommended Challenges
        </ThemedText>
        <RecommendedChallenge />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  challengesContainer: {
    marginTop: 20,
  },
  challengesTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default ChallengesScreen;
