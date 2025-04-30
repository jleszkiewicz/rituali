import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Colors } from "@/constants/Colors";

const CurvedArrow = () => {
  return (
    <Svg width="200" height="200" style={styles.arrow}>
      <Path
        d="M100,0 Q30,30 100,60 Q170,120 100,130 Q90,140 100,160"
        stroke={Colors.LightPink}
        strokeWidth="3"
        fill="none"
        strokeDasharray="12,4"
      />
      <Path
        d="M90,158 L100,180 L110,158"
        stroke={Colors.LightPink}
        strokeWidth="3"
        fill={Colors.LightPink}
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  arrow: {
    marginTop: 16,
  },
});

export default CurvedArrow;
