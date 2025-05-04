import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

interface EmptyChallengeCardProps {
  onPress: () => void;
}

export default function EmptyChallengeCard({
  onPress,
}: EmptyChallengeCardProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={[Colors.HotPink, Colors.PrimaryPink]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{t("add_habit_to_challenge")}</Text>
            <Ionicons
              name="alert-circle-outline"
              color="white"
              size={26}
              style={styles.infoIcon}
            />
          </View>
          <Text style={styles.textDescription}>
            {t("add_habit_to_challenge_description")}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward-outline"
          color="white"
          size={26}
          style={styles.infoIcon}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  gradient: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  textDescription: {
    color: "#fff",
    fontSize: 14,
    textAlign: "left",
    marginTop: 5,
  },
  infoIcon: {
    marginStart: 5,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
