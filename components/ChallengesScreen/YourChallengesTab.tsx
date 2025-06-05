import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import Carousel from "react-native-reanimated-carousel";
import PageIndicator from "../Commons/PageIndicator";
import ConditionalRenderer from "../Commons/ConditionalRenderer";
import EmptyChallengesList from "./EmptyChallengesList";
import PendingChallengeInvitations from "./PendingChallengeInvitations";
import SharedChallengeCard from "./SharedChallengeCard";
import YourChallengeCard from "./YourChallengeCard";
import { ChallengeData } from "../AddChallengeModal/types";
import { Friend } from "./types";

interface YourChallengesTabProps {
  activeChallenges: ChallengeData[];
  completedChallenges: ChallengeData[];
  friends: Friend[];
  userId: string;
  isLoading: boolean;
  onInvitationHandled: () => void;
  onChallengeDeleted: () => void;
  PAGE_WIDTH: number;
  ITEM_MARGIN: number;
}

const YourChallengesTab: React.FC<YourChallengesTabProps> = ({
  activeChallenges,
  completedChallenges,
  friends,
  userId,
  isLoading,
  onInvitationHandled,
  onChallengeDeleted,
  PAGE_WIDTH,
  ITEM_MARGIN,
}) => {
  const [sharedSlide, setSharedSlide] = React.useState(0);
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [completedCurrentPage, setCompletedCurrentPage] = React.useState(0);

  const sharedChallenges = activeChallenges.filter(
    (challenge) => challenge.participants.length > 1
  );

  const singleUserChallenges = activeChallenges.filter(
    (challenge) => challenge.participants.length === 1
  );

  if (activeChallenges.length === 0 && !isLoading) {
    return (
      <View style={styles.emptyListContainer}>
        <EmptyChallengesList
          imageWidth={250}
          textColor={Colors.PrimaryGray}
          title={t("no_challenges_title")}
          description={t("no_challenges_description")}
        />
      </View>
    );
  }

  return (
    <>
      <PendingChallengeInvitations onInvitationHandled={onInvitationHandled} />

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
                    onChallengeDeleted={onChallengeDeleted}
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
                    onChallengeDeleted={onChallengeDeleted}
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

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyListContainer: {
    marginTop: 90,
  },
});

export default YourChallengesTab;
