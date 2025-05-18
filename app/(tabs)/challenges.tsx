import React, { useState, useEffect } from "react";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/Commons/ThemedText";
import { useSelector } from "react-redux";
import YourChallengeCard from "@/components/ChallengesScreen/YourChallengeCard";
import { RootState } from "@/src/store";
import {
  fetchRecommendedChallenges,
  getActiveChallenges,
  getCompletedChallenges,
} from "@/src/service/apiService";
import { RecommendedChallengeData } from "@/components/AddHabitModal/types";
import { Colors } from "@/constants/Colors";
import RecommendedChallengeCard from "@/components/ChallengesScreen/RecommendedChallenge";
import PageIndicator from "@/components/Commons/PageIndicator";
import Carousel from "react-native-reanimated-carousel";
import { t } from "@/src/service/translateService";
import ConditionalRenderer from "@/components/Commons/ConditionalRenderer";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PAGE_WIDTH = SCREEN_WIDTH - 40;
const ITEM_MARGIN = 10;

const ChallengesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const challenges = useSelector(
    (state: RootState) => state.challenges.challenges
  );
  const [recommendedChallenges, setRecommendedChallenges] = useState<
    RecommendedChallengeData[]
  >([]);
  const [yourCurrentPage, setYourCurrentPage] = useState(0);
  const [completedCurrentPage, setCompletedCurrentPage] = useState(0);
  const [recommendedCurrentPage, setRecommendedCurrentPage] = useState(0);

  const activeChallenges = getActiveChallenges(challenges);
  const completedChallenges = getCompletedChallenges(challenges);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const recommendedChallengesData = await fetchRecommendedChallenges();

        const filteredChallenges = recommendedChallengesData.filter(
          (recommendedChallenge) => {
            const isActive = activeChallenges.some(
              (userChallenge) =>
                userChallenge.name === recommendedChallenge.name
            );
            return !isActive;
          }
        );
        setRecommendedChallenges(filteredChallenges);
      } catch (err) {
        console.error("Error loading recommended challenges:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenges();
  }, [challenges]);

  return isLoading ? (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.HotPink} />
    </View>
  ) : (
    <ScreenWrapper>
      <ScreenHeader title={t("challenges")} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <ConditionalRenderer condition={activeChallenges.length > 0}>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                {t("your_open_challenges")}
              </ThemedText>
              <View style={{ width: PAGE_WIDTH, alignSelf: "center" }}>
                <Carousel
                  loop={false}
                  width={PAGE_WIDTH}
                  height={85}
                  data={activeChallenges}
                  onSnapToItem={setYourCurrentPage}
                  style={{ paddingHorizontal: ITEM_MARGIN }}
                  renderItem={({ item }) => (
                    <View style={{ width: PAGE_WIDTH }}>
                      <YourChallengeCard challenge={item} />
                    </View>
                  )}
                />
              </View>
              <PageIndicator
                isVisible={activeChallenges.length > 1}
                count={activeChallenges.length}
                currentIndex={yourCurrentPage}
              />
            </View>
          </ConditionalRenderer>

          <ConditionalRenderer condition={completedChallenges.length > 0}>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                {t("completed_challenges")}
              </ThemedText>
              <View style={{ width: PAGE_WIDTH, alignSelf: "center" }}>
                <Carousel
                  loop={false}
                  width={PAGE_WIDTH}
                  height={85}
                  data={completedChallenges}
                  onSnapToItem={setCompletedCurrentPage}
                  style={{ paddingHorizontal: ITEM_MARGIN }}
                  renderItem={({ item }) => (
                    <View style={{ width: PAGE_WIDTH }}>
                      <YourChallengeCard challenge={item} />
                    </View>
                  )}
                />
              </View>
              <PageIndicator
                isVisible={completedChallenges.length > 1}
                count={completedChallenges.length}
                currentIndex={completedCurrentPage}
              />
            </View>
          </ConditionalRenderer>

          <ConditionalRenderer condition={recommendedChallenges.length > 0}>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                {t("recommended_challenges")}
              </ThemedText>
              <View style={{ width: PAGE_WIDTH, alignSelf: "center" }}>
                <Carousel
                  loop={false}
                  width={PAGE_WIDTH}
                  height={360}
                  data={recommendedChallenges}
                  onSnapToItem={setRecommendedCurrentPage}
                  style={{ paddingHorizontal: ITEM_MARGIN }}
                  renderItem={({ item }) => (
                    <View style={{ width: PAGE_WIDTH - ITEM_MARGIN }}>
                      <RecommendedChallengeCard challenge={item} />
                    </View>
                  )}
                />
              </View>
              <PageIndicator
                isVisible={recommendedChallenges.length > 1}
                count={recommendedChallenges.length}
                currentIndex={recommendedCurrentPage}
              />
            </View>
          </ConditionalRenderer>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ChallengesScreen;
