import React from "react";
import { Colors } from "@/constants/Colors";
import { View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CurvedArrow from "./CurvedArrow";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";

const EmptyHabitsList = () => {
  return (
    <>
      <View style={styles.container}>
        <MaterialIcons
          name="playlist-add"
          size={120}
          color={Colors.LightPink}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <ThemedText style={styles.text}>{t("no_habits")}</ThemedText>
        </View>
        <ThemedText style={styles.description}>
          {t("add_habit_to_start")}
        </ThemedText>
        <CurvedArrow />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "25%",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    marginBottom: 32,
  },
  text: {
    color: Colors.PrimaryGray,
    fontSize: 20,
  },
  emoji: {
    marginLeft: 8,
  },
  description: {
    color: Colors.PrimaryGray,
    fontSize: 16,
    marginBottom: 16,
  },
});

export default EmptyHabitsList;
