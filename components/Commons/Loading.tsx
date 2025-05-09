import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";

const Loading = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={Colors.PrimaryPink} />
      <ThemedText style={styles.loadingText}>Loading...</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
});

export default Loading;
