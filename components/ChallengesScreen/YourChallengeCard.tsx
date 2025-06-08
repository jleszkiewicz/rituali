import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { useSubscription } from "@/src/hooks/useSubscription";

interface Participant {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface YourChallengeCardProps {
  challenge: ChallengeData;
  onChallengeDeleted?: () => void;
  participants?: Participant[];
  onShowSubscriptionModal: () => void;
}

export default function YourChallengeCard({
  challenge,
  onChallengeDeleted,
  participants = [],
  onShowSubscriptionModal,
}: YourChallengeCardProps) {
  const router = useRouter();
  const userId = useSelector(selectUserId);
  const { isSubscribed } = useSubscription();

  const startDate = new Date(challenge.startDate + "T00:00:00");
  const endDate = new Date(challenge.endDate + "T00:00:00");

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const totalDays = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isCompleted = endDate < today;
  const isSharedChallenge = challenge.participants.length > 1;

  const handlePress = () => {
    if (isCompleted) {
      if (!isSubscribed) {
        onShowSubscriptionModal();
        return;
      }

      if (isSharedChallenge) {
        router.push({
          pathname: "/shared-challenge-summary",
          params: { challengeId: challenge.id },
        });
      } else {
        router.push({
          pathname: "/challenge-summary",
          params: { challengeId: challenge.id },
        });
      }
    } else {
      router.push({
        pathname: "/challenge-info",
        params: { id: challenge.id },
      });
    }
  };

  const otherParticipants = participants.filter((p) => p.id !== userId);
  const firstOtherParticipant = otherParticipants[0];

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/illustrations/medal.png")}
          style={styles.medal}
        />
        <View style={styles.leftSection}>
          <ThemedText style={styles.title} bold>
            {challenge.name}
          </ThemedText>
          <ThemedText style={styles.duration}>
            {totalDays} {totalDays === 1 ? t("days_one") : t("days")}
          </ThemedText>
        </View>

        <View style={styles.rightSection}>
          {isSharedChallenge && otherParticipants.length > 0 && (
            <View style={styles.participantsContainer}>
              <View style={styles.avatarsContainer}>
                <Image
                  source={
                    firstOtherParticipant.avatar_url
                      ? { uri: firstOtherParticipant.avatar_url }
                      : require("@/assets/illustrations/profile.png")
                  }
                  style={styles.avatar}
                />
                {otherParticipants.length > 1 && (
                  <View style={styles.additionalAvatar}>
                    <ThemedText style={styles.additionalCount} bold>
                      +{otherParticipants.length - 1}
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>
          )}
          <Ionicons
            name="chevron-forward"
            size={24}
            color={Colors.PrimaryGray}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.ButterYellow,
    borderRadius: 10,
    padding: 10,
    marginEnd: 10,
    shadowColor: Colors.Black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 17,
    color: Colors.PrimaryGray,
  },
  duration: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    opacity: 0.8,
    marginTop: 4,
  },
  medal: {
    width: 60,
    height: 60,
    marginEnd: 5,
  },
  participantsContainer: {
    marginRight: 8,
  },
  avatarsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  additionalAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.White,
    borderWidth: 2,
    borderColor: Colors.PrimaryGray,
    marginLeft: -10,
    justifyContent: "center",
    alignItems: "center",
  },
  additionalCount: {
    fontSize: 12,
    color: Colors.PrimaryGray,
  },
});
