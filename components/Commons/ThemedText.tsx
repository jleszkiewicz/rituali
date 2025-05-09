import React from "react";
import { Text, TextProps, StyleSheet, TextStyle } from "react-native";
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
  const fontStyle: TextStyle = {
    fontFamily: bold
      ? FontStyles.bold.fontFamily
      : FontStyles.regular.fontFamily,
  };

  return <Text style={[styles.defaultText, fontStyle, style]} {...props} />;
};

const styles = StyleSheet.create({
  defaultText: {
    color: Colors.PrimaryGray,
    fontSize: 16,
    lineHeight: 24,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
