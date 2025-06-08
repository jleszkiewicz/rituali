import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import Carousel from "react-native-reanimated-carousel";
import PageIndicator from "../Commons/PageIndicator";
import YourChallengeCard from "./YourChallengeCard";
import { ChallengeData } from "../AddChallengeModal/types";
import { Friend, Participant } from "./types";

interface ChallengeCarouselProps {
  title: string;
  challenges: ChallengeData[];
  friends: Friend[];
  userId: string;
  onChallengeDeleted: () => void;
  PAGE_WIDTH: number;
  ITEM_MARGIN: number;
  onShowSubscriptionModal: () => void;
}

const ChallengeCarousel = ({
  title,
  challenges,
  friends,
  userId,
  onChallengeDeleted,
  PAGE_WIDTH,
  ITEM_MARGIN,
  onShowSubscriptionModal,
}: ChallengeCarouselProps) => {
  const [currentPage, setCurrentPage] = React.useState(0);

  if (challenges.length === 0) return null;

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle} bold>
        {title}
      </ThemedText>
      <Carousel
        loop={false}
        width={PAGE_WIDTH}
        height={85}
        data={challenges}
        onSnapToItem={setCurrentPage}
        style={{ paddingHorizontal: ITEM_MARGIN }}
        renderItem={({ item }: { item: ChallengeData }) => {
          const participants: Participant[] = item.participants.map(
            (participantId: string) => {
              const friend = friends.find(
                (f: Friend) => f.id === participantId
              );
              return {
                id: participantId,
                display_name: friend?.display_name || null,
                avatar_url: friend?.avatar_url || null,
              };
            }
          );
          return (
            <View style={{ width: PAGE_WIDTH - ITEM_MARGIN }}>
              <YourChallengeCard
                challenge={item}
                onChallengeDeleted={onChallengeDeleted}
                participants={participants}
                onShowSubscriptionModal={onShowSubscriptionModal}
              />
            </View>
          );
        }}
      />
      <PageIndicator
        isVisible={challenges.length > 1}
        count={challenges.length}
        currentIndex={currentPage}
      />
    </View>
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
});

export default ChallengeCarousel;
