import { Colors } from "@/constants/Colors";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
}

const ScreenHeader = ({ title, onBack }: ScreenHeaderProps) => {
  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.PrimaryGray} />
        </TouchableOpacity>
      )}
      <ThemedText bold style={styles.header}>
        {title}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 10,
  },
  header: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 18,
    color: Colors.PrimaryGray,
  },
});

export default ScreenHeader;
