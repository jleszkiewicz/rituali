import { Colors } from "@/constants/Colors";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

const ScreenHeader = ({ title }: { title: string }) => {
  return (
    <View>
      <ThemedText bold style={styles.header}>
        {title}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 18,
    color: Colors.PrimaryGray,
  },
});

export default ScreenHeader;
