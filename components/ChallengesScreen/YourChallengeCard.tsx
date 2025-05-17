import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { differenceInDays } from "date-fns";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import ChallengeInfoModal from "../modals/ChallengeInfoModal";
import { Ionicons } from "@expo/vector-icons";

interface YourChallengeCardProps {
  challenge: ChallengeData;
}

export default function YourChallengeCard({
  challenge,
}: YourChallengeCardProps) {
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const totalDays = differenceInDays(endDate, startDate) + 1;

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setIsInfoModalVisible(true)}
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
