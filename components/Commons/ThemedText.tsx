import React from "react";
import { Text, TextProps, StyleSheet, Platform, TextStyle } from "react-native";
import { Colors } from "@/constants/Colors";
import { FontStyles } from "@/src/constants/Fonts";

interface ThemedTextProps extends TextProps {
  bold?: boolean;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  style,
  bold = false,
  ...props
}) => {
  const fontStyle: TextStyle = Platform.select({
    ios: {
      fontFamily: "System",
      fontWeight: bold ? "700" : "400",
    },
    android: {
      fontFamily: bold ? "sans-serif-medium" : "sans-serif",
    },
    default: {
      fontFamily: bold
        ? FontStyles.bold.fontFamily
        : FontStyles.regular.fontFamily,
    },
  }) as TextStyle;

  return <Text style={[styles.defaultText, fontStyle, style]} {...props} />;
};

const styles = StyleSheet.create({
  defaultText: {
    color: Colors.PrimaryGray,
    fontSize: 16,
    lineHeight: 24,
  },
});
