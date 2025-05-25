import React, { useState, useEffect, useCallback } from "react";
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
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { RecommendedChallengeData } from "@/components/AddHabitModal/types";
import RecommendedChallengeCard from "@/components/ChallengesScreen/RecommendedChallenge";
import PageIndicator from "@/components/Commons/PageIndicator";
import Carousel from "react-native-reanimated-carousel";
import { t } from "@/src/service/translateService";
import ConditionalRenderer from "@/components/Commons/ConditionalRenderer";
import Loading from "@/components/Commons/Loading";
import PendingChallengeInvitations from "@/components/ChallengesScreen/PendingChallengeInvitations";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PAGE_WIDTH = SCREEN_WIDTH - 40;
const ITEM_MARGIN = 10;

const ChallengesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [activeChallenges, setActiveChallenges] = useState<ChallengeData[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<
    ChallengeData[]
  >([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState<
    RecommendedChallengeData[]
  >([]);
  const [yourCurrentPage, setYourCurrentPage] = useState(0);
  const [completedCurrentPage, setCompletedCurrentPage] = useState(0);
  const [recommendedCurrentPage, setRecommendedCurrentPage] = useState(0);
  const userId = useSelector((state: RootState) => state.user.userId);

  const loadData = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      const [
        activeChallengesData,
        recommendedChallengesData,
        completedChallengesData,
      ] = await Promise.all([
        getActiveChallenges(userId),
        fetchRecommendedChallenges(),
        getCompletedChallenges(userId),
      ]);

      setActiveChallenges(activeChallengesData);
      setRecommendedChallenges(recommendedChallengesData);
      setCompletedChallenges(completedChallengesData);
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error loading challenges:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const renderContent = () => {
    if (
      isLoading &&
      !isDataLoaded &&
      activeChallenges.length === 0 &&
      completedChallenges.length === 0
    ) {
      return <Loading />;
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <PendingChallengeInvitations onInvitationHandled={loadData} />

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
                    <View style={{ width: PAGE_WIDTH - ITEM_MARGIN }}>
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
                    <View style={{ width: PAGE_WIDTH - ITEM_MARGIN }}>
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
    );
  };

  return (
    <ScreenWrapper>
      <ScreenHeader title={t("challenges")} />
      {renderContent()}
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
