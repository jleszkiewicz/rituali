import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../../Commons/ThemedText";
import { Colors } from "@/constants/Colors";

interface HabitTitleProps {
  name: string;
  streak: number;
  isToday: boolean;
}

const HabitTitle: React.FC<HabitTitleProps> = ({ name, streak, isToday }) => {
  return (
    <View style={styles.titleContainer}>
      <ThemedText style={styles.title} bold>
        {name}
      </ThemedText>
      {isToday && streak > 0 && (
        <ThemedText style={styles.streak}>{`${streak} 🔥`}</ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    justifyContent: "center",
    marginStart: 10,
    maxWidth: "80%",
  },
  title: {
    fontSize: 16,
    color: Colors.White,
  },
  streak: {
    fontSize: 14,
    color: Colors.White,
  },
});

export default HabitTitle;
