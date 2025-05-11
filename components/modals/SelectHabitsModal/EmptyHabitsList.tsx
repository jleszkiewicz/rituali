import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/src/service/translateService";

const EmptyHabitsList: React.FC = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="list" size={48} color={Colors.White} />
      <ThemedText style={styles.title}>{t("no_available_habits")}</ThemedText>
      <ThemedText style={styles.description}>
        {t("create_new_habit_first")}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: Colors.White,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: Colors.White,
    opacity: 0.7,
    textAlign: "center",
  },
});

export default EmptyHabitsList;
