import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import ChallengeInfoModal from "../modals/ChallengeInfoModal";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface YourChallengeCardProps {
  challenge: ChallengeData;
  onChallengeDeleted?: () => void;
}

export default function YourChallengeCard({
  challenge,
  onChallengeDeleted,
}: YourChallengeCardProps) {
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
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
    if (isCompleted) {
      router.push({
        pathname: "/challenge-summary",
        params: { challengeId: challenge.id },
      });
    } else {
      setIsInfoModalVisible(true);
    }
  };

  const handleChallengeDeleted = () => {
    setIsInfoModalVisible(false);
    if (onChallengeDeleted) {
      onChallengeDeleted();
    }
  };

  return (
    <>
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
            <Ionicons name="chevron-forward" size={24} color={Colors.White} />
          </View>
        </View>
      </TouchableOpacity>

      <ChallengeInfoModal
        isVisible={isInfoModalVisible}
        onClose={() => setIsInfoModalVisible(false)}
        challenge={challenge}
        onChallengeDeleted={handleChallengeDeleted}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 10,
    padding: 10,
    marginEnd: 10,
    shadowColor: Colors.Black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    color: Colors.White,
  },
  duration: {
    fontSize: 14,
    color: Colors.White,
    opacity: 0.8,
    marginTop: 4,
  },
  medal: {
    width: 60,
    height: 60,
    marginEnd: 5,
  },
});
