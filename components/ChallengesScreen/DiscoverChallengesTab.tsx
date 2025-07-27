import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import ConditionalRenderer from "../Commons/ConditionalRenderer";
import EmptyChallengesList from "./EmptyChallengesList";
import { RecommendedChallenge } from "./RecommendedChallenge";
import { RecommendedChallengeData } from "../AddHabitModal/types";
import { getHabitsForCurrentLanguage } from "./methods";

interface DiscoverChallengesTabProps {
  recommendedChallenges: RecommendedChallengeData[];
  isLoading: boolean;
  onChallengePress: (challenge: RecommendedChallengeData) => void;
}

const DiscoverChallengesTab: React.FC<DiscoverChallengesTabProps> = ({
  recommendedChallenges,
  isLoading,
  onChallengePress,
}) => {
  if (recommendedChallenges.length === 0 && !isLoading) {
    return (
      <EmptyChallengesList
        imageWidth={250}
        textColor={Colors.PrimaryGray}
        title={t("no_recommended_challenges_title")}
        description={t("no_recommended_challenges_description")}
      />
    );
  }

  const sortedChallenges = [...recommendedChallenges].sort((a, b) => {
    const habitsA = getHabitsForCurrentLanguage(a);
    const habitsB = getHabitsForCurrentLanguage(b);
    return (
      (Array.isArray(habitsA) ? habitsA.length : 0) -
      (Array.isArray(habitsB) ? habitsB.length : 0)
    );
  });

  return (
    <ConditionalRenderer condition={recommendedChallenges.length > 0}>
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>
          {t("recommended_challenges")}
        </ThemedText>
        <View style={styles.recommendedChallengesContainer}>
          {sortedChallenges.map((item) => {
            const habits = getHabitsForCurrentLanguage(item);
            const isSingleHabit = Array.isArray(habits) && habits.length === 1;
            return (
              <View
                key={item.id}
                style={[
                  styles.recommendedCardContainer,
                  !isSingleHabit && styles.fullWidthCard,
                ]}
              >
                <RecommendedChallenge
                  challenge={item}
                  onPress={onChallengePress}
                />
              </View>
            );
          })}
        </View>
      </View>
    </ConditionalRenderer>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recommendedChallengesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
  },
  recommendedCardContainer: {
    marginBottom: 4,
    width: (Dimensions.get("window").width - 20 - 10) / 2,
    flex: 0,
  },
  fullWidthCard: {
    width: Dimensions.get("window").width - 20,
    flex: 0,
  },
});

export default DiscoverChallengesTab;
