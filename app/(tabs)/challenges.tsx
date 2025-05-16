import React, { useState, useEffect, useRef } from "react";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { ThemedText } from "@/components/Commons/ThemedText";
import { useSelector } from "react-redux";
import { selectHabits } from "@/src/store/habitsSlice";
import YourChallengeCard from "@/components/ChallengesScreen/YourChallengeCard";
import { RootState } from "@/src/store";
import { fetchRecommendedChallenges } from "@/src/service/apiService";
import { RecommendedChallengeData } from "@/components/AddHabitModal/types";
import { Colors } from "@/constants/Colors";
import RecommendedChallengeCard from "@/components/ChallengesScreen/RecommendedChallenge";
import PageIndicator from "@/components/Commons/PageIndicator";
import { t } from "@/src/service/translateService";

const ChallengesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const challenges = useSelector(
    (state: RootState) => state.challenges.challenges
  );
  const habits = useSelector(selectHabits);
  const screenWidth = Dimensions.get("window").width;
  const pageWidth = screenWidth - 40;
  const cardWidth = pageWidth;
  const [recommendedChallenges, setRecommendedChallenges] = useState<
    RecommendedChallengeData[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentYourChallengePage, setCurrentYourChallengePage] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const yourChallengesFlatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const recommendedChallengesData = await fetchRecommendedChallenges();
        console.log(
          "ChallengesScreen: recommendedChallengesData:",
          recommendedChallengesData
        );
        setRecommendedChallenges(recommendedChallengesData);
      } catch (err) {
        console.error("Error loading recommended challenges:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenges();
  }, []);

  const handlePageChange = (event: any) => {
    const newPage = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setCurrentPage(newPage);
  };

  const handleYourChallengePageChange = (event: any) => {
    const newPage = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setCurrentYourChallengePage(newPage);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.HotPink} />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <ScreenHeader title={t("challenges")} />
      <ScrollView>
        <View style={styles.section}>
          <ThemedText bold style={styles.sectionTitle}>
            {t("your_challenges")}
          </ThemedText>
          <View>
            <FlatList
              ref={yourChallengesFlatListRef}
              data={challenges}
              renderItem={({ item: challenge }) => (
                <View style={{ width: cardWidth }}>
                  <YourChallengeCard
                    challenge={challenge}
                    habits={habits}
                    width={cardWidth}
                  />
                </View>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              snapToAlignment="start"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleYourChallengePageChange}
              getItemLayout={(_, index) => ({
                length: pageWidth,
                offset: pageWidth * index,
                index,
              })}
            />
            <PageIndicator
              isVisible={challenges.length > 1}
              count={challenges.length}
              currentIndex={currentYourChallengePage}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText bold style={styles.sectionTitle}>
            {t("recommended_challenges")}
          </ThemedText>
          <View>
            <FlatList
              ref={flatListRef}
              data={recommendedChallenges}
              renderItem={({ item: challenge }) => {
                console.log(
                  "ChallengesScreen: rendering challenge:",
                  challenge
                );
                return (
                  <View style={{ width: cardWidth }}>
                    <RecommendedChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                    />
                  </View>
                );
              }}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              snapToAlignment="start"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handlePageChange}
              getItemLayout={(_, index) => ({
                length: pageWidth,
                offset: pageWidth * index,
                index,
              })}
            />
            <PageIndicator
              isVisible={recommendedChallenges.length > 1}
              count={recommendedChallenges.length}
              currentIndex={currentPage}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default ChallengesScreen;
