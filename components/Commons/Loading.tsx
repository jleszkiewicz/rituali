import React, { useEffect } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { t } from "@/src/service/translateService";
import { LinearGradient } from "expo-linear-gradient";

const Loading = () => {
  const spinValue = new Animated.Value(0);
  const scaleValue = new Animated.Value(1);
  const opacityValue = new Animated.Value(0.7);

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      })
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    );

    const fade = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 0.9,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0.7,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    );

    spin.start();
    pulse.start();
    fade.start();

    return () => {
      spin.stop();
      pulse.stop();
      fade.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderDot = (index: number, totalDots: number) => {
    const angle = (index * 360) / totalDots;
    const radius = 50;
    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);

    return (
      <Animated.View
        key={index}
        style={[
          styles.dotContainer,
          {
            transform: [
              { translateX: x },
              { translateY: y },
              { scale: scaleValue },
            ],
            opacity: opacityValue,
          },
        ]}
      >
        <LinearGradient
          colors={[Colors.HotPink, Colors.PrimaryPink]}
          style={styles.dot}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.loaderContainer}>
      <Animated.View
        style={[
          styles.circleContainer,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      >
        {Array.from({ length: 8 }).map((_, index) => renderDot(index, 8))}
      </Animated.View>
      <ThemedText style={styles.loadingText}>{t("loading")}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circleContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  dotContainer: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: Colors.HotPink,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  dot: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: Colors.HotPink,
  },
  loadingText: {
    marginTop: 30,
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
});

export default Loading;
