import React, { useState, useEffect, useCallback } from "react";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { ThemedText } from "@/components/Commons/ThemedText";
import { useSelector } from "react-redux";
import YourChallengeCard from "@/components/ChallengesScreen/YourChallengeCard";
import SharedChallengeCard from "@/components/ChallengesScreen/SharedChallengeCard";
import { RootState } from "@/src/store";
import {
  fetchRecommendedChallenges,
  getActiveChallenges,
  getCompletedChallenges,
  fetchFriends,
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
const PAGE_WIDTH = SCREEN_WIDTH - 20;
const ITEM_MARGIN = 10;

interface Friend {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  completion_percentage: number;
}

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
  const [friends, setFriends] = useState<Friend[]>([]);
  const [completedCurrentPage, setCompletedCurrentPage] = useState(0);
  const [recommendedCurrentPage, setRecommendedCurrentPage] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [sharedSlide, setSharedSlide] = useState(0);
  const userId = useSelector((state: RootState) => state.user.userId);

  const loadData = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const [
        activeChallengesData,
        completedChallengesData,
        recommendedChallengesData,
        friendsData,
      ] = await Promise.all([
        getActiveChallenges(userId),
        getCompletedChallenges(userId),
        fetchRecommendedChallenges(userId),
        fetchFriends(userId),
      ]);

      setActiveChallenges(activeChallengesData);
      setCompletedChallenges(completedChallengesData);
      setRecommendedChallenges(recommendedChallengesData);
      setFriends(friendsData);
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const handleChallengeDeleted = useCallback(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sharedChallenges = activeChallenges.filter(
    (challenge) =>
      challenge.participants.length > 1 &&
      challenge.participants.includes(userId || "")
  );

  const renderContent = () => {
    if (isLoading || !isDataLoaded) {
      return <Loading />;
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <PendingChallengeInvitations onInvitationHandled={loadData} />

          <ConditionalRenderer condition={sharedChallenges.length > 0}>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle} bold>
                {t("shared_challenges")}
              </ThemedText>
              <Carousel
                loop={false}
                width={PAGE_WIDTH}
                height={85}
                data={sharedChallenges}
                onSnapToItem={setSharedSlide}
                style={{ paddingHorizontal: ITEM_MARGIN }}
                renderItem={({ item }) => {
                  const friendId = item.participants.find(
                    (id) => id !== userId
                  );
                  const friend = friends.find((f) => f.id === friendId);
                  const additionalParticipants = item.participants.length - 2;
                  return (
                    <View style={{ width: PAGE_WIDTH - ITEM_MARGIN }}>
                      <SharedChallengeCard
                        challenge={item}
                        onChallengeDeleted={handleChallengeDeleted}
                        friendName={friend?.display_name || "Friend"}
                        friendAvatarUrl={friend?.avatar_url || null}
                        additionalParticipants={additionalParticipants}
                      />
                    </View>
                  );
                }}
              />
              <PageIndicator
                isVisible={sharedChallenges.length > 1}
                count={sharedChallenges.length}
                currentIndex={sharedSlide}
              />
            </View>
          </ConditionalRenderer>

          <ConditionalRenderer condition={activeChallenges.length > 0}>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle} bold>
                {t("your_open_challenges")}
              </ThemedText>
              <Carousel
                loop={false}
                width={PAGE_WIDTH}
                height={85}
                data={activeChallenges}
                onSnapToItem={setActiveSlide}
                style={{ paddingHorizontal: ITEM_MARGIN }}
                renderItem={({ item }) => (
                  <View style={{ width: PAGE_WIDTH - ITEM_MARGIN }}>
                    <YourChallengeCard
                      challenge={item}
                      onChallengeDeleted={handleChallengeDeleted}
                    />
                  </View>
                )}
              />
              <PageIndicator
                isVisible={activeChallenges.length > 1}
                count={activeChallenges.length}
                currentIndex={activeSlide}
              />
            </View>
          </ConditionalRenderer>

          <ConditionalRenderer condition={completedChallenges.length > 0}>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                {t("completed_challenges")}
              </ThemedText>
              <Carousel
                loop={false}
                width={PAGE_WIDTH}
                height={85}
                data={completedChallenges}
                onSnapToItem={setCompletedCurrentPage}
                style={{ paddingHorizontal: ITEM_MARGIN }}
                renderItem={({ item }) => (
                  <View style={{ width: PAGE_WIDTH - ITEM_MARGIN }}>
                    <YourChallengeCard
                      challenge={item}
                      onChallengeDeleted={loadData}
                    />
                  </View>
                )}
              />
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
              <Carousel
                loop={false}
                width={PAGE_WIDTH}
                height={360}
                data={recommendedChallenges}
                onSnapToItem={setRecommendedCurrentPage}
                style={{ paddingHorizontal: ITEM_MARGIN }}
                renderItem={({ item }) => (
                  <View style={{ width: PAGE_WIDTH - ITEM_MARGIN * 2 }}>
                    <RecommendedChallengeCard challenge={item} />
                  </View>
                )}
              />
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
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default ChallengesScreen;
