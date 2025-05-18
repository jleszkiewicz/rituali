import React, { useState, useEffect } from "react";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
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
import Loading from "@/components/Commons/Loading";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PAGE_WIDTH = SCREEN_WIDTH - 40;
const ITEM_MARGIN = 10;

const ChallengesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
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
    let isMounted = true;

    const loadChallenges = async () => {
      if (!isDataLoaded) {
        try {
          setIsLoading(true);
          const recommendedChallengesData = await fetchRecommendedChallenges();

          if (isMounted) {
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
            setIsDataLoaded(true);
          }
        } catch (err) {
          console.error("Error loading recommended challenges:", err);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };

    loadChallenges();

    return () => {
      isMounted = false;
    };
  }, [activeChallenges]);

  if (isLoading || !isDataLoaded) {
    return <Loading />;
  }

  return (
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
