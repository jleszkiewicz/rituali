import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Image, Pressable } from "react-native";
import { router } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { ThemedText } from "@/components/Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import PageIndicator from "@/components/Commons/PageIndicator";
import { t } from "@/src/service/translateService";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PAGE_WIDTH = SCREEN_WIDTH - 40;

const onboardingData = [
  {
    image: require("@/assets/illustrations/onboarding1.png"),
    titleKey: "onboarding_track_habits_title",
    descriptionKey: "onboarding_track_habits_description",
  },
  {
    image: require("@/assets/illustrations/onboarding2.png"),
    titleKey: "onboarding_challenges_title",
    descriptionKey: "onboarding_challenges_description",
  },
  {
    image: require("@/assets/illustrations/onboarding3.png"),
    titleKey: "onboarding_stats_title",
    descriptionKey: "onboarding_stats_description",
  },
];

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);

  const handleStart = () => {
    router.replace("/(auth)/login" as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          loop={false}
          width={PAGE_WIDTH}
          height={500}
          data={onboardingData}
          onSnapToItem={setCurrentPage}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image source={item.image} style={styles.image} />
              <ThemedText style={styles.title}>{t(item.titleKey)}</ThemedText>
              <ThemedText style={styles.description}>
                {t(item.descriptionKey)}
              </ThemedText>
            </View>
          )}
        />
      </View>

      <View style={styles.bottomContainer}>
        <PageIndicator
          count={onboardingData.length}
          currentIndex={currentPage}
          isVisible={true}
          activeColor={Colors.HotPink}
          inactiveColor="#ddd"
          activeSize={8}
          inactiveSize={8}
        />

        <Pressable style={styles.button} onPress={handleStart}>
          <ThemedText style={styles.buttonText}>
            {t("onboarding_start_button")}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  carouselContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    alignItems: "center",
    padding: 20,
    height: "100%",
    justifyContent: "center",
  },
  image: {
    width: PAGE_WIDTH - 40,
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bottomContainer: {
    paddingBottom: 40,
    alignItems: "center",
    gap: 20,
  },
  button: {
    backgroundColor: Colors.HotPink,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
