import React from "react";
import { View, StyleSheet } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";

interface CircularProgressProps {
  progress: number;
  radius?: number;
  strokeWidth?: number;
  text?: string;
  color?: string;
}

export default function CircularProgress({
  progress,
  radius = 50,
  strokeWidth = 5,
  text,
  color = Colors.HotPink,
}: CircularProgressProps) {
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={radius * 2 + 10} height={radius * 2 + 10}>
        <Circle
          cx={radius + 5}
          cy={radius + 5}
          r={radius}
          stroke={Colors.White}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={radius + 5}
          cy={radius + 5}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius + 5} ${radius + 5})`}
        />
      </Svg>
      {text && (
        <View style={styles.textContainer}>
          <ThemedText style={styles.text}>{text}</ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    color: Colors.White,
  },
});
