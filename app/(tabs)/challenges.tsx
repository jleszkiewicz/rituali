import React, { useState, useEffect, useCallback } from "react";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
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
import { RecommendedChallenge } from "@/components/ChallengesScreen/RecommendedChallenge";
import PageIndicator from "@/components/Commons/PageIndicator";
import Carousel from "react-native-reanimated-carousel";
import { t } from "@/src/service/translateService";
import ConditionalRenderer from "@/components/Commons/ConditionalRenderer";
import Loading from "@/components/Commons/Loading";
import PendingChallengeInvitations from "@/components/ChallengesScreen/PendingChallengeInvitations";
import { getHabitsForCurrentLanguage } from "@/components/ChallengesScreen/methods";
import { Colors } from "@/constants/Colors";
import { StartChallengeModal } from "@/components/ChallengesScreen/StartChallengeModal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PAGE_WIDTH = SCREEN_WIDTH - 20;
const ITEM_MARGIN = 10;
const SCREEN_WRAPPER_PADDING = 20;
const CARD_SPACING = 16; // odstęp między kartami
const CARD_WIDTH =
  (SCREEN_WIDTH - SCREEN_WRAPPER_PADDING * 2 - CARD_SPACING) / 2;

interface Friend {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  completion_percentage: number;
}

const ChallengesScreen = () => {
  const [activeTab, setActiveTab] = useState<"your" | "discover">("your");
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [sharedSlide, setSharedSlide] = useState(0);
  const [selectedChallenge, setSelectedChallenge] =
    useState<RecommendedChallengeData | null>(null);
  const [isStartModalVisible, setIsStartModalVisible] = useState(false);
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
      throw error;
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

  const sharedChallenges = activeChallenges.filter((challenge) => {
    return challenge.participants.length > 1;
  });

  const singleUserChallenges = activeChallenges.filter((challenge) => {
    return challenge.participants.length === 1;
  });

  const renderYourChallenges = () => {
    return (
      <>
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
                const friendId = item.participants.find((id) => id !== userId);
                const friend = friends.find((f) => f.id === friendId);
                const additionalParticipants = item.participants.length - 2;
                return (
                  <View style={{ width: PAGE_WIDTH - ITEM_MARGIN }}>
                    <SharedChallengeCard
                      challenge={item}
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

        <ConditionalRenderer condition={singleUserChallenges.length > 0}>
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle} bold>
              {t("your_open_challenges")}
            </ThemedText>
            <Carousel
              loop={false}
              width={PAGE_WIDTH}
              height={85}
              data={singleUserChallenges}
              onSnapToItem={setActiveSlide}
              style={{ paddingHorizontal: ITEM_MARGIN }}
              renderItem={({ item }) => {
                const participants = item.participants.map((participantId) => {
                  const friend = friends.find((f) => f.id === participantId);
                  return {
                    id: participantId,
                    display_name: friend?.display_name || null,
                    avatar_url: friend?.avatar_url || null,
                  };
                });
                return (
                  <View style={{ width: PAGE_WIDTH - ITEM_MARGIN }}>
                    <YourChallengeCard
                      challenge={item}
                      onChallengeDeleted={handleChallengeDeleted}
                      participants={participants}
                    />
                  </View>
                );
              }}
            />
            <PageIndicator
              isVisible={singleUserChallenges.length > 1}
              count={singleUserChallenges.length}
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
              renderItem={({ item }) => {
                const participants = item.participants.map((participantId) => {
                  const friend = friends.find((f) => f.id === participantId);
                  return {
                    id: participantId,
                    display_name: friend?.display_name || null,
                    avatar_url: friend?.avatar_url || null,
                  };
                });
                return (
                  <View style={{ width: PAGE_WIDTH - ITEM_MARGIN }}>
                    <YourChallengeCard
                      challenge={item}
                      onChallengeDeleted={loadData}
                      participants={participants}
                    />
                  </View>
                );
              }}
            />
            <PageIndicator
              isVisible={completedChallenges.length > 1}
              count={completedChallenges.length}
              currentIndex={completedCurrentPage}
            />
          </View>
        </ConditionalRenderer>
      </>
    );
  };

  const renderDiscoverChallenges = () => {
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
              const isSingleHabit =
                Array.isArray(habits) && habits.length === 1;
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
                    onPress={handleChallengePress}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ConditionalRenderer>
    );
  };

  const handleChallengePress = (challenge: RecommendedChallengeData) => {
    setSelectedChallenge(challenge);
    setIsStartModalVisible(true);
  };

  const handleCloseStartModal = () => {
    setIsStartModalVisible(false);
    setSelectedChallenge(null);
  };

  const renderContent = () => {
    if (isLoading || !isDataLoaded) {
      return <Loading />;
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.tabContainer}>
            <View style={styles.tabButtons}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "your" && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab("your")}
              >
                <ThemedText
                  style={[
                    styles.tabButtonText,
                    activeTab === "your" && styles.activeTabButtonText,
                  ]}
                  bold={activeTab === "your"}
                >
                  {t("your_challenges")}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "discover" && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab("discover")}
              >
                <ThemedText
                  style={[
                    styles.tabButtonText,
                    activeTab === "discover" && styles.activeTabButtonText,
                  ]}
                  bold={activeTab === "discover"}
                >
                  {t("discover")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {activeTab === "your"
            ? renderYourChallenges()
            : renderDiscoverChallenges()}
        </View>
      </ScrollView>
    );
  };

  return (
    <ScreenWrapper>
      <ScreenHeader title={t("challenges")} />
      {renderContent()}

      {selectedChallenge && (
        <StartChallengeModal
          isVisible={isStartModalVisible}
          onClose={handleCloseStartModal}
          challenge={selectedChallenge}
          refreshChallenges={loadData}
        />
      )}
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
  recommendedChallengesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
  },
  recommendedCardContainer: {
    marginBottom: 4,
    width: (SCREEN_WIDTH - SCREEN_WRAPPER_PADDING * 2 - 10) / 2,
    flex: 0,
  },
  fullWidthCard: {
    width: SCREEN_WIDTH - SCREEN_WRAPPER_PADDING * 2,
    flex: 0,
  },
  tabContainer: {
    marginBottom: 20,
  },
  tabButtons: {
    flexDirection: "row",
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: Colors.White,
  },
  tabButtonText: {
    fontSize: 14,
    color: Colors.White,
  },
  activeTabButtonText: {
    color: Colors.HotPink,
  },
});

export default ChallengesScreen;
