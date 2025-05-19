import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import { Colors } from "@/constants/Colors";

interface ChallengeHeaderProps {
  title: string;
}

export const ChallengeHeader = ({ title }: ChallengeHeaderProps) => {
  return (
    <View style={styles.headerSection}>
      <ThemedText style={styles.title} bold>
        {title}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: Colors.PrimaryGray,
    marginBottom: 8,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    opacity: 0.7,
    lineHeight: 22,
  },
});
