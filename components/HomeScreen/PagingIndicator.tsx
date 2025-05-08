import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

interface PagingIndicatorProps {
  count: number;
  currentIndex: number;
  isVisible: boolean;
}

export default function PagingIndicator({
  count,
  currentIndex,
  isVisible,
}: PagingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.HotPink,
  },
  inactiveDot: {
    backgroundColor: Colors.LightPink,
    opacity: 0.5,
  },
});
