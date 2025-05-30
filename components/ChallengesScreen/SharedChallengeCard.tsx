import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface SharedChallengeCardProps {
  challenge: ChallengeData;
  friendName: string;
  friendAvatarUrl: string | null;
  additionalParticipants?: number;
}

export default function SharedChallengeCard({
  challenge,
  friendName,
  friendAvatarUrl,
  additionalParticipants = 0,
}: SharedChallengeCardProps) {
  const router = useRouter();

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

  const handlePress = () => {
    router.push({
      pathname: "/shared-challenge",
      params: { id: challenge.id },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/ilustrations/medal.png")}
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
          <View style={styles.friendInfo}>
            <View style={styles.avatarsContainer}>
              <Image
                source={
                  friendAvatarUrl
                    ? { uri: friendAvatarUrl }
                    : require("@/assets/ilustrations/profile.png")
                }
                style={styles.avatar}
              />
              {additionalParticipants > 0 && (
                <View style={styles.additionalAvatar}>
                  <ThemedText style={styles.additionalCount} bold>
                    +{additionalParticipants}
                  </ThemedText>
                </View>
              )}
            </View>
            <ThemedText style={styles.friendName} numberOfLines={1}>
              {friendName}
              {additionalParticipants > 0 && ` +${additionalParticipants}`}
            </ThemedText>
          </View>
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
  friendInfo: {
    alignItems: "center",
    marginRight: 5,
  },
  avatarsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
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
    marginStart: -10,
    justifyContent: "center",
    alignItems: "center",
  },
  additionalCount: {
    fontSize: 12,
    color: Colors.PrimaryGray,
  },
  friendName: {
    fontSize: 12,
    color: Colors.PrimaryGray,
    maxWidth: 80,
  },
});
