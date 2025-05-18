import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { differenceInDays } from "date-fns";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import ChallengeInfoModal from "../modals/ChallengeInfoModal";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import { dateFormat } from "@/constants/Constants";
import { getCompletedChallenges } from "@/src/service/apiService";

interface YourChallengeCardProps {
  challenge: ChallengeData;
}

export default function YourChallengeCard({
  challenge,
}: YourChallengeCardProps) {
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const router = useRouter();

  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const totalDays = differenceInDays(endDate, startDate) + 1;

  const isCompleted = getCompletedChallenges([challenge]).length > 0;

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

  return (
    <>
      <TouchableOpacity
        style={[styles.container, isCompleted && styles.completedContainer]}
        onPress={handlePress}
      >
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
  completedContainer: {
    opacity: 0.7,
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
