import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { t } from "@/src/service/translateService";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import {
  getPendingChallengeInvitations,
  respondToChallengeInvitation,
} from "@/src/service/apiService";
import ConditionalRender from "../Commons/ConditionalRenderer";
import { differenceInDays } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

interface PendingChallengeInvitationsProps {
  onInvitationHandled: () => void;
}

const PendingChallengeInvitations = ({
  onInvitationHandled,
}: PendingChallengeInvitationsProps) => {
  const [invitations, setInvitations] = React.useState<any[]>([]);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const userId = useSelector(selectUserId);

  const fetchInvitations = async () => {
    if (!userId) return;

    try {
      const invitationsData = await getPendingChallengeInvitations(userId);
      setInvitations(invitationsData);
    } catch (error) {
      console.error("Error fetching pending invitations:", error);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [userId]);

  const handleInvitation = async (invitationId: string, accept: boolean) => {
    try {
      await respondToChallengeInvitation(
        invitationId,
        accept ? "accepted" : "rejected"
      );
      onInvitationHandled();
      fetchInvitations();
    } catch (error) {
      console.error("Error handling challenge invitation:", error);
    }
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = differenceInDays(end, start) + 1;
    return `${days} ${days === 1 ? t("day") : t("days")}`;
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderInvitation = ({ item }: { item: any }) => {
    const isExpanded = expandedId === item.id;

    return (
      <View style={styles.invitationItem}>
        <TouchableOpacity
          style={styles.challengeInfo}
          onPress={() => toggleExpand(item.id)}
        >
          <Image
            source={require("@/assets/illustrations/medals.png")}
            style={styles.medalIcon}
          />
          <View style={styles.textContainer}>
            <ThemedText style={styles.challengeName}>
              {item.challenge.name}
            </ThemedText>
            <ThemedText style={styles.senderName}>
              {t("from")}: {item.sender.username}
            </ThemedText>
            <ThemedText style={styles.duration}>
              {getDuration(item.challenge.startDate, item.challenge.endDate)}
            </ThemedText>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={Colors.PrimaryGray}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <ThemedText style={styles.habitsTitle} bold>
              {t("habits_in_challenge")}:
            </ThemedText>
            {item.challenge.habits.map((habitName: string, index: number) => (
              <ThemedText key={index} style={styles.habitText}>
                • {habitName}
              </ThemedText>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleInvitation(item.id, true)}
          >
            <ThemedText style={styles.buttonText} bold>
              {t("accept")}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={() => handleInvitation(item.id, false)}
          >
            <ThemedText style={styles.declineButtonText} bold>
              {t("decline")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (invitations.length === 0) return null;

  return (
    <ConditionalRender condition={invitations.length > 0}>
      <View style={styles.container}>
        <ThemedText style={styles.sectionTitle} bold>
          {t("pending_invitations")}
        </ThemedText>
        <FlatList
          data={invitations}
          renderItem={renderInvitation}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </ConditionalRender>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: Colors.PrimaryGray,
  },
  invitationItem: {
    backgroundColor: Colors.White,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.ButterYellow,
    shadowColor: Colors.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  challengeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  medalIcon: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  challengeName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.PrimaryGray,
    marginBottom: 4,
  },
  senderName: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: Colors.PrimaryGray,
  },
  expandedContent: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.LightGray,
  },
  habitsTitle: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    marginBottom: 8,
  },
  habitText: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    marginBottom: 4,
    paddingLeft: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: Colors.HotPink,
  },
  declineButton: {
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.HotPink,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 14,
  },
  declineButtonText: {
    color: Colors.HotPink,
    fontSize: 14,
  },
});

export default PendingChallengeInvitations;
