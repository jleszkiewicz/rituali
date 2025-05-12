import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import ConditionalRenderer from "./ConditionalRenderer";

interface PageIndicatorProps {
  count: number;
  currentIndex: number;
  isVisible: boolean;
  activeColor?: string;
  inactiveColor?: string;
  activeSize?: number;
  inactiveSize?: number;
}

const PageIndicator: React.FC<PageIndicatorProps> = ({
  count,
  currentIndex,
  isVisible,
  activeColor = Colors.HotPink,
  inactiveColor = Colors.PrimaryGray,
  activeSize = 12,
  inactiveSize = 8,
}) => {
  return (
    <ConditionalRenderer condition={isVisible}>
      <View style={styles.container}>
        {Array.from({ length: count }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                width: index === currentIndex ? activeSize : inactiveSize,
                height: index === currentIndex ? activeSize : inactiveSize,
                borderRadius:
                  index === currentIndex ? activeSize / 2 : inactiveSize / 2,
                backgroundColor:
                  index === currentIndex ? activeColor : inactiveColor,
              },
            ]}
          />
        ))}
      </View>
    </ConditionalRenderer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  indicator: {
    marginHorizontal: 4,
  },
});

export default PageIndicator;
