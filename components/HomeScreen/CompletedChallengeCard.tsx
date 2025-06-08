import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
import { useRouter } from "expo-router";
import { t } from "../../src/service/translateService";
import { markChallengeAsViewed } from "@/src/service/apiService";
import { Ionicons } from "@expo/vector-icons";
import { ChallengeData } from "../AddChallengeModal/types";
import { useSubscription } from "@/src/hooks/useSubscription";
import { ProFeatureBadge } from "../Commons/ProFeatureBadge";

interface CompletedChallengeCardProps {
  challenge: ChallengeData;
}

export const CompletedChallengeCard: React.FC<CompletedChallengeCardProps> = ({
  challenge,
}) => {
  const router = useRouter();
  const { isSubscribed, setShowSubscriptionModal } = useSubscription();

  const handleViewSummary = async () => {
    if (!challenge.id) {
      console.error("Challenge ID is undefined");
      return;
    }

    if (!isSubscribed) {
      setShowSubscriptionModal(true);
      return;
    }

    try {
      await markChallengeAsViewed(challenge.id);

      const isShared = challenge.participants.length > 1;
      router.push({
        pathname: isShared ? "/shared-challenge-summary" : "/challenge-summary",
        params: { challengeId: challenge.id },
      });
    } catch (error) {
      console.error("Error in handleViewSummary:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleViewSummary}>
      <Image
        source={require("@/assets/illustrations/success.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <ThemedText style={styles.title} bold>
          {t("challenge_completed")}
        </ThemedText>
        <ThemedText style={styles.description}>
          {t("challenge_completed_description").replace(
            "{{name}}",
            challenge.name || ""
          )}
        </ThemedText>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, !isSubscribed && styles.buttonDisabled]}
            onPress={handleViewSummary}
          >
            <ThemedText style={styles.buttonText}>
              {t("view_summary")}
            </ThemedText>
            <Ionicons name="chevron-forward" size={18} color={Colors.White} />
          </TouchableOpacity>
          {!isSubscribed && <ProFeatureBadge style={styles.badge} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.ButterYellow,
    shadowColor: Colors.PrimaryGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    marginBottom: 12,
  },
  buttonContainer: {
    position: "relative",
    alignSelf: "flex-end",
  },
  button: {
    backgroundColor: Colors.HotPink,
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 14,
    fontWeight: "500",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
  },
});
