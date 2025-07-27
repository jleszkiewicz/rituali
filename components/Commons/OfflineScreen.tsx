import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";

const OfflineScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/illustrations/offline.png")}
        style={styles.image}
      />
      <ThemedText style={styles.title}>{t("offline_mode")}</ThemedText>
      <ThemedText style={styles.description}>
        {t("offline_mode_description")}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.ButterYellow,
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.PrimaryGray,
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 30,
  },
  description: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default OfflineScreen;
