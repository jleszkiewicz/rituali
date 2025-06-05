import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../Commons/ThemedText";
import { RecommendedChallengeData } from "../AddHabitModal/types";
import { getHabitsForCurrentLanguage } from "./methods";
import { t } from "@/src/service/translateService";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { addChallenge, addHabit } from "@/src/service/apiService";
import { format, addDays } from "date-fns";
import { dateFormat } from "@/constants/Constants";
import { useDispatch } from "react-redux";
import { setHabits } from "@/src/store/habitsSlice";
import { setChallenges } from "@/src/store/challengesSlice";
import { fetchUserHabits, fetchUserChallenges } from "@/src/service/apiService";
import { StartChallengeModal } from "./StartChallengeModal";
import * as Localization from "expo-localization";

interface RecommendedChallengeProps {
  challenge: RecommendedChallengeData;
  onPress: (challenge: RecommendedChallengeData) => void;
}

export const RecommendedChallenge = ({
  challenge,
  onPress,
}: RecommendedChallengeProps) => {
  const [isStartModalVisible, setIsStartModalVisible] = useState(false);

  const habits = getHabitsForCurrentLanguage(challenge);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(challenge)}
      activeOpacity={0.9}
    >
      <View style={styles.mainContent}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.title}>{challenge.name}</ThemedText>
          <View style={styles.durationContainer}>
            <ThemedText style={styles.duration} bold>
              {challenge.duration}
            </ThemedText>
            <ThemedText style={styles.durationDays}>{t("days")}</ThemedText>
          </View>
        </View>
        <View style={styles.rulesContainer}>
          {habits.map((habit, index) => (
            <ThemedText style={styles.rule} key={index}>
              {habit}
            </ThemedText>
          ))}
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.participantsChip}>
          <Ionicons name="people" size={16} color={Colors.White} />
          <ThemedText style={styles.participantsText}>
            {challenge.participants_count}
          </ThemedText>
        </View>
      </View>
      <ImageBackground
        source={{ uri: challenge.background_illustration }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    position: "relative",
    minHeight: 250,
  },
  mainContent: {
    padding: 15,
    zIndex: 1,
    width: "100%",
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "bold",
    color: Colors.White,
    flex: 1,
    marginRight: 16,
  },
  durationContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  duration: {
    fontSize: 20,
    color: Colors.ButterYellow,
    lineHeight: 24,
    marginBottom: -4,
  },
  durationDays: {
    fontSize: 14,
    color: Colors.ButterYellow,
  },
  rulesContainer: {
    gap: 8,
  },
  rule: {
    fontSize: 13,
    color: Colors.White,
    flex: 1,
    lineHeight: 18,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 10,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  participantsChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.HotPink,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 6,
    gap: 4,
  },
  participantsText: {
    fontSize: 12,
    color: Colors.White,
    fontWeight: "bold",
  },
  backgroundImage: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 150,
    height: 150,
    opacity: 0.7,
    zIndex: 0,
  },
  backgroundImageStyle: {
    resizeMode: "contain",
  },
});
