import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { t } from "@/src/service/translateService";

interface ParticipantProgress {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  completion_percentage: number;
}

interface ParticipantsProgressProps {
  participants: ParticipantProgress[];
  currentUserId: string | null;
}

export default function ParticipantsProgress({
  participants,
  currentUserId,
}: ParticipantsProgressProps) {
  return (
    <View style={styles.section}>
      {participants.map((participant) => (
        <View key={participant.id} style={styles.participantItem}>
          <View style={styles.participantInfo}>
            <View style={styles.nameContainer}>
              <ThemedText style={styles.participantName}>
                {participant.display_name || "User"}
              </ThemedText>
              {participant.id === currentUserId && (
                <ThemedText style={styles.youLabel} bold>
                  {t("you")}
                </ThemedText>
              )}
              <Image
                source={
                  participant.completion_percentage === 100
                    ? require("@/assets/illustrations/clap.png")
                    : require("@/assets/illustrations/sad.png")
                }
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <ThemedText style={styles.progressText} bold>
              {participant.completion_percentage}%
            </ThemedText>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${participant.completion_percentage}%` },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    backgroundColor: Colors.ButterYellow,
    padding: 20,
    borderRadius: 10,
  },
  participantItem: {
    marginBottom: 15,
  },
  participantInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  participantName: {
    color: Colors.PrimaryGray,
    fontSize: 16,
  },
  youLabel: {
    color: Colors.HotPink,
    fontSize: 13,
    fontStyle: "italic",
  },
  progressText: {
    color: Colors.PrimaryGray,
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.LightGray,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.HotPink,
    borderRadius: 4,
  },
  icon: {
    width: 30,
    height: 30,
    marginEnd: 4,
  },
});
