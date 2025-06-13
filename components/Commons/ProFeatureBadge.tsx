import * as React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { useSubscription } from "@/src/hooks/useSubscription";

interface ProFeatureBadgeProps {
  style?: any;
}

export const ProFeatureBadge: React.FC<ProFeatureBadgeProps> = ({ style }) => {
  const { isLoading } = useSubscription();

  if (isLoading) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <ThemedText style={styles.text}>PRO</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.HotPink,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  text: {
    color: Colors.White,
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default ProFeatureBadge;
