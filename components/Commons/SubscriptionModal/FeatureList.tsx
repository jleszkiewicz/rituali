import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";

const features = [
  "add_your_friends",
  "unlimited_challenges",
  "unlimited_habits",
  "challenge_summaries",
];

export const FeatureList: React.FC = () => {
  return (
    <View style={styles.featuresContainer}>
      {features.map((feature, index) => (
        <View key={index} style={styles.feature}>
          <Image
            source={require("@/assets/illustrations/star.png")}
            style={styles.bulletStar}
            resizeMode="contain"
          />
          <ThemedText style={styles.featureText}>{t(feature)}</ThemedText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  featuresContainer: {
    width: "100%",
    marginBottom: 30,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bulletStar: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: Colors.White,
    maxWidth: "90%",
  },
});
