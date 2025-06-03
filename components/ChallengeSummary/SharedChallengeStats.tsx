import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";

interface SharedChallengeStatsProps {
  totalDays: number;
  participants: {
    id: string;
    display_name: string | null;
    totalCompletions: number;
    completionRate: number;
  }[];
}

export const SharedChallengeStats = ({
  totalDays,
  participants,
}: SharedChallengeStatsProps) => {
  const userId = useSelector(selectUserId);

  const sortedParticipants = [...participants].sort(
    (a, b) => b.completionRate - a.completionRate
  );

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={styles.tableHeaderCell} />
          <ThemedText style={styles.tableHeaderText}>
            {t("total_completions")}
          </ThemedText>
          <ThemedText style={styles.tableHeaderText}>
            {t("completion_rate")}
          </ThemedText>
        </View>

        {sortedParticipants.map((participant, index) => (
          <View
            key={participant.id}
            style={[
              styles.tableRow,
              index === sortedParticipants.length - 1 && styles.lastRow,
            ]}
          >
            <View style={styles.participantCell}>
              <ThemedText style={styles.participantName} bold>
                {participant.id === userId
                  ? t("you")
                  : participant.display_name || "User"}
              </ThemedText>
              {index === 0 && (
                <Image
                  source={require("@/assets/ilustrations/trophy.png")}
                  style={styles.trophyIcon}
                />
              )}
            </View>
            <ThemedText style={styles.completionRate}>
              {participant.totalCompletions}
            </ThemedText>
            <ThemedText style={styles.completionRate}>
              {participant.completionRate}%
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  table: {
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: Colors.PrimaryGray,
  },
  tableHeaderCell: {
    flex: 1.5,
  },
  tableHeaderText: {
    fontSize: 12,
    color: Colors.White,
    flex: 1.5,
    textAlign: "right",
    opacity: 0.7,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.White,
  },
  participantCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1.5,
  },
  participantName: {
    fontSize: 14,
    color: Colors.White,
  },
  completionRate: {
    fontSize: 20,
    color: Colors.ButterYellow,
    fontWeight: "500",
    flex: 1.5,
    textAlign: "right",
  },
  trophyIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
});
