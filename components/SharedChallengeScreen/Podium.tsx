import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { t } from "@/src/service/translateService";

interface Participant {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  completionHistory: {
    date: string;
    completion_percentage: number;
  }[];
}

interface PodiumProps {
  participants: Participant[];
}

export const Podium: React.FC<PodiumProps> = ({ participants }) => {
  const participantsWithAverage = participants.map((participant) => {
    const totalCompletion = participant.completionHistory.reduce(
      (sum, day) => sum + day.completion_percentage,
      0
    );
    const averageCompletion =
      participant.completionHistory.length > 0
        ? Math.round(totalCompletion / participant.completionHistory.length)
        : 0;

    return {
      ...participant,
      averageCompletion,
    };
  });

  const sortedParticipants = [...participantsWithAverage].sort(
    (a, b) => b.averageCompletion - a.averageCompletion
  );

  const groupedParticipants = sortedParticipants.reduce(
    (groups, participant) => {
      const rate = participant.averageCompletion;
      if (!groups[rate]) {
        groups[rate] = [];
      }
      groups[rate].push(participant);
      return groups;
    },
    {} as Record<number, typeof sortedParticipants>
  );

  const topGroups = Object.entries(groupedParticipants)
    .sort(([rateA], [rateB]) => Number(rateB) - Number(rateA))
    .slice(0, 3);

  const getPlaceStyle = (place: number) => {
    switch (place) {
      case 1:
        return styles.firstPlaceNumber;
      case 2:
        return styles.secondPlaceNumber;
      case 3:
        return styles.thirdPlaceNumber;
      default:
        return styles.firstPlaceNumber;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.podiumContainer}>
        {topGroups.map(([rate, groupParticipants], groupIndex) => (
          <View key={rate} style={styles.podiumGroup}>
            {groupParticipants.map((participant) => (
              <View key={participant.id} style={styles.podiumColumn}>
                <View style={styles.avatarContainer}>
                  {participant.avatar_url ? (
                    <Image
                      source={{ uri: participant.avatar_url }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={[styles.avatar, styles.defaultAvatar]}>
                      <ThemedText style={styles.defaultAvatarText}>
                        {participant.display_name?.[0]?.toUpperCase() || "U"}
                      </ThemedText>
                    </View>
                  )}
                  <ThemedText style={styles.userName} numberOfLines={1}>
                    {participant.display_name?.split(" ")[0] || "User"}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.podiumPlace,
                    groupIndex === 0
                      ? styles.firstPlace
                      : groupIndex === 1
                      ? styles.secondPlace
                      : styles.thirdPlace,
                  ]}
                >
                  <ThemedText style={styles.placeNumberText}>
                    {groupIndex + 1}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
      <ThemedText style={styles.averageLabel}>
        {t("average_completion")}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 16,
    paddingTop: 32,
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 12,
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    height: 180,
    marginTop: 50,
  },
  podiumGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  podiumColumn: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  avatarContainer: {
    position: "absolute",
    top: -70,
    zIndex: 1,
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.White,
    marginBottom: 4,
  },
  defaultAvatar: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.White,
  },
  defaultAvatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.HotPink,
  },
  podiumPlace: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    width: 80,
    backgroundColor: Colors.ButterYellow,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  firstPlace: {
    height: "100%",
  },
  secondPlace: {
    height: "80%",
  },
  thirdPlace: {
    height: "60%",
  },
  placeNumberText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.PrimaryGray,
  },
  firstPlaceNumber: {
    backgroundColor: "#FFD700",
  },
  secondPlaceNumber: {
    backgroundColor: "#C0C0C0",
  },
  thirdPlaceNumber: {
    backgroundColor: "#CD7F32",
  },
  averageLabel: {
    fontSize: 14,
    color: Colors.White,
    textAlign: "center",
    marginTop: 8,
  },
  userName: {
    fontSize: 12,
    color: Colors.White,
    textAlign: "center",
    maxWidth: 100,
  },
});
