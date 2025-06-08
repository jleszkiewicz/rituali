import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import Carousel from "react-native-reanimated-carousel";
import ConditionalRenderer from "../Commons/ConditionalRenderer";
import EmptyChallengesList from "./EmptyChallengesList";
import PendingChallengeInvitations from "./PendingChallengeInvitations";
import SharedChallengeCard from "./SharedChallengeCard";
import ChallengeCarousel from "./ChallengeCarousel";
import { ChallengeData } from "../AddChallengeModal/types";
import { Friend } from "./types";
import { useSubscription } from "@/src/hooks/useSubscription";

interface YourChallengesTabProps {
  activeChallenges: ChallengeData[];
  friends: Friend[];
  userId: string;
  isLoading: boolean;
  onInvitationHandled: () => void;
  onChallengeDeleted: () => void;
  PAGE_WIDTH: number;
  ITEM_MARGIN: number;
}

const YourChallengesTab = ({
  activeChallenges,
  friends,
  userId,
  isLoading,
  onInvitationHandled,
  onChallengeDeleted,
  PAGE_WIDTH,
  ITEM_MARGIN,
}: YourChallengesTabProps) => {
  const { setShowSubscriptionModal } = useSubscription();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeChallengesList = activeChallenges.filter(
    (challenge: ChallengeData) => {
      const endDate = new Date(challenge.endDate);
      endDate.setHours(0, 0, 0, 0);
      return endDate >= today;
    }
  );

  const completedChallengesList = activeChallenges.filter(
    (challenge: ChallengeData) => {
      const endDate = new Date(challenge.endDate);
      endDate.setHours(0, 0, 0, 0);
      return endDate < today;
    }
  );

  const sharedChallenges = activeChallengesList.filter(
    (challenge: ChallengeData) => challenge.participants.length > 1
  );

  const singleUserChallenges = activeChallengesList.filter(
    (challenge: ChallengeData) => challenge.participants.length === 1
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
            style={{ paddingHorizontal: ITEM_MARGIN }}
            renderItem={({ item }: { item: ChallengeData }) => {
              const friendId = item.participants.find(
                (id: string) => id !== userId
              );
              const friend = friends.find((f: Friend) => f.id === friendId);
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
        </View>
      </ConditionalRenderer>

      <ChallengeCarousel
        title={t("your_open_challenges")}
        challenges={singleUserChallenges}
        friends={friends}
        userId={userId}
        onChallengeDeleted={onChallengeDeleted}
        PAGE_WIDTH={PAGE_WIDTH}
        ITEM_MARGIN={ITEM_MARGIN}
        onShowSubscriptionModal={() => setShowSubscriptionModal(true)}
      />

      <ChallengeCarousel
        title={t("completed_challenges")}
        challenges={completedChallengesList}
        friends={friends}
        userId={userId}
        onChallengeDeleted={onChallengeDeleted}
        PAGE_WIDTH={PAGE_WIDTH}
        ITEM_MARGIN={ITEM_MARGIN}
        onShowSubscriptionModal={() => setShowSubscriptionModal(true)}
      />
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
