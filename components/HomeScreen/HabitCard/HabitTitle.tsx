import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";

interface HabitTitleProps {
  name: string;
  streak: number;
  isToday: boolean;
  strikeThroughAnim: Animated.Value;
}

const HabitTitle: React.FC<HabitTitleProps> = ({
  name,
  streak,
  isToday,
  strikeThroughAnim,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Animated.Text
          style={[
            styles.name,
            {
              opacity: strikeThroughAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.7],
              }),
            },
          ]}
        >
          {name}
        </Animated.Text>
        <Animated.View
          style={[
            styles.strikeThrough,
            {
              transform: [
                {
                  scaleX: strikeThroughAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
      {isToday && streak > 0 && (
        <ThemedText style={styles.streak} bold>{`${streak} 🔥`}</ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginStart: 10,
    maxWidth: "80%",
  },
  nameContainer: {
    position: "relative",
    alignSelf: "flex-start",
  },
  name: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    fontFamily: "Poppins-Bold",
  },
  streak: {
    fontSize: 14,
    color: Colors.PrimaryGray,
  },
  strikeThrough: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 2,
    backgroundColor: Colors.PrimaryGray,
    transformOrigin: "left",
  },
});

export default HabitTitle;
