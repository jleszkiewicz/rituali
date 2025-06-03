import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import {
  setHabits,
  selectHabits,
  setLoading,
  selectHabitsLoading,
} from "@/src/store/habitsSlice";
import { selectChallenges, setChallenges } from "@/src/store/challengesSlice";
import {
  fetchUserHabits,
  fetchCompletedChallenges,
} from "@/src/service/apiService";
import CalendarCarousel from "@/components/HomeScreen/CalendarCarousel";
import { format } from "date-fns";
import { Colors } from "@/constants/Colors";
import type { HabitData } from "../../components/AddHabitModal/types";
import AddHabitModal from "@/components/modals/AddHabitModal";
import ScreenWrapper from "@/components/Commons/ScreenWrapper";
import { dateFormat } from "@/constants/Constants";
import { getTitle } from "@/components/HomeScreen/methods/methods";
import Loading from "@/components/Commons/Loading";
import ChallengesList from "@/components/HomeScreen/ChallengesList";
import { t } from "@/src/service/translateService";
import ConditionalRenderer from "@/components/Commons/ConditionalRenderer";
import ScreenHeader from "@/components/Commons/ScreenHeader";
import { ThemedText } from "@/components/Commons/ThemedText";
import EmptyHabitsList from "@/components/HomeScreen/EmptyHabitsList";
import HabitCard from "@/components/HomeScreen/HabitCard";
import { CompletedChallengeCard } from "@/components/HomeScreen/CompletedChallengeCard";
import { selectViewedChallengeIds } from "@/src/store/viewedChallengesSlice";
import { getActiveChallenges } from "@/src/service/apiService";
import { ChallengeData } from "@/components/AddChallengeModal/types";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const habits = useSelector(selectHabits);
  const challenges = useSelector(selectChallenges);
  const isLoading = useSelector(selectHabitsLoading);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddHabitModalVisible, setIsAddHabitModalVisible] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<
    ChallengeData[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);

  const viewedChallengeIds = useSelector(selectViewedChallengeIds);

  const activeChallenges = challenges.filter(
    (challenge) =>
      new Date(challenge.endDate) >= selectedDate &&
      new Date(challenge.startDate) <= selectedDate
  );

  const filteredCompletedChallenges = completedChallenges.filter(
    (challenge) => !viewedChallengeIds.includes(challenge.id)
  );

  const refresh = async () => {
    setRefreshing(true);
    try {
      const [habitsData, challengesData, completedChallengesData] =
        await Promise.all([
          fetchUserHabits(userId),
          getActiveChallenges(userId),
          fetchCompletedChallenges(),
        ]);

      dispatch(setHabits(habitsData));
      dispatch(setChallenges(challengesData));
      setCompletedChallenges(completedChallengesData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;

      try {
        dispatch(setLoading(true));
        const [habitsData, challengesData, completedChallengesData] =
          await Promise.all([
            fetchUserHabits(userId),
            getActiveChallenges(userId),
            fetchCompletedChallenges(),
          ]);

        dispatch(setHabits(habitsData));
        dispatch(setChallenges(challengesData));
        setCompletedChallenges(completedChallengesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadData();
  }, [userId, dispatch]);

  const activeHabits = habits
    .filter((habit: HabitData) => {
      const habitStartDate = new Date(habit.startDate);
      const habitEndDate = habit.endDate ? new Date(habit.endDate) : null;
      const isActiveInSelectedDate =
        habitStartDate <= selectedDate &&
        (!habitEndDate || habitEndDate >= selectedDate);

      if (habit.status === "deleted") {
        return false;
      }

      if (habit.status === "active") {
        return isActiveInSelectedDate;
      }

      return false;
    })
    .sort((a: HabitData, b: HabitData) => a.name.localeCompare(b.name));

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Loading />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScreenHeader title={getTitle(selectedDate)} />
      <CalendarCarousel
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {filteredCompletedChallenges.length > 0 && (
          <View style={styles.completedChallengesContainer}>
            {filteredCompletedChallenges.map((challenge) => {
              return (
                <CompletedChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                />
              );
            })}
          </View>
        )}
        <ConditionalRenderer condition={activeChallenges.length > 0}>
          <ThemedText style={styles.sectionTitle} bold>
            {t("challenges")}
          </ThemedText>
          <ChallengesList
            challenges={activeChallenges}
            habits={habits}
            selectedDate={format(selectedDate, dateFormat)}
          />
        </ConditionalRenderer>

        {activeHabits.length > 0 ? (
          <>
            <View style={styles.habitsHeader}>
              <ThemedText style={styles.sectionTitle} bold>
                {t("habits")}
              </ThemedText>
              <View style={styles.completionRateContainer}>
                <ThemedText style={styles.completionRateLabel}>
                  {t("today_completion_rate")}:
                </ThemedText>
                <ThemedText style={styles.completionRate}>
                  {Math.round(
                    (activeHabits.filter((habit) =>
                      habit.completionDates.includes(
                        format(selectedDate, dateFormat)
                      )
                    ).length /
                      activeHabits.length) *
                      100
                  )}
                  %
                </ThemedText>
              </View>
            </View>
            {activeHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                selectedDate={format(selectedDate, dateFormat)}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyHabitsContainer}>
            <EmptyHabitsList
              imageWidth={250}
              textColor={Colors.PrimaryGray}
              title={t("no_habits_title")}
              description={t("no_recorded_habits")}
            />
          </View>
        )}
      </ScrollView>

      <AddHabitModal
        isVisible={isAddHabitModalVisible}
        onClose={() => setIsAddHabitModalVisible(false)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
    flex: 1,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.PrimaryGray,
    marginBottom: 16,
    marginTop: 6,
    textTransform: "capitalize",
  },
  habitsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  editButton: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginBottom: 12,
  },
  editButtonText: {
    color: Colors.HotPink,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  completedChallengesContainer: {
    marginVertical: 20,
  },
  completedChallengesScrollContent: {
    paddingHorizontal: 10,
  },
  emptyHabitsContainer: {
    marginTop: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  completionRateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  completionRate: {
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
  completionRateLabel: {
    fontSize: 14,
    color: Colors.PrimaryGray,
  },
});
