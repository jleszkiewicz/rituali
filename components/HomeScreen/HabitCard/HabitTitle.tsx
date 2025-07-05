import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TextLayoutEventData,
  NativeSyntheticEvent,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";

interface HabitTitleProps {
  name: string;
  streak: number;
  isToday: boolean;
  strikeThroughAnim: Animated.Value;
}

interface TextLine {
  y: number;
  width: number;
}

const HabitTitle: React.FC<HabitTitleProps> = ({
  name,
  streak,
  isToday,
  strikeThroughAnim,
}) => {
  const [textLines, setTextLines] = useState<TextLine[]>([]);

  const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = event.nativeEvent;
    setTextLines(
      lines.map((line) => ({
        y: line.y + line.height / 2,
        width: line.width,
      }))
    );
  };

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
          onTextLayout={onTextLayout}
        >
          {name}
        </Animated.Text>
        {textLines.map((line, index) => (
          <Animated.View
            key={index}
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
                top: line.y,
                width: line.width,
              },
            ]}
          />
        ))}
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
    marginBottom: 4,
  },
  nameContainer: {
    position: "relative",
    alignSelf: "flex-start",
  },
  name: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    fontFamily: "Poppins-Bold",
    lineHeight: 24,
  },
  streak: {
    fontSize: 14,
    color: Colors.PrimaryGray,
  },
  strikeThrough: {
    position: "absolute",
    left: 0,
    height: 2,
    backgroundColor: Colors.PrimaryGray,
    transformOrigin: "left",
  },
});

export default HabitTitle;
