import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import { t } from "@/src/service/translateService";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import RecommendedChallenge from "@/components/ChallengesScreen/RecommendedChallenge";
import { View, Text, StyleSheet } from "react-native";

const ChallengesScreen = () => {
  return (
    <ScreenWrapper>
      <ScreenHeader title={t("challenges")} />
      <RecommendedChallenge />
      <View style={styles.challengesContainer}>
        <Text style={styles.challengesTitle}>Your Challenges</Text>
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
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ChallengesScreen;
