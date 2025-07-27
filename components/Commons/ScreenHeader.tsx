import { Colors } from "@/constants/Colors";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightActions?: React.ReactNode;
}

const ScreenHeader = ({ title, onBack, rightActions }: ScreenHeaderProps) => {
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
      {rightActions && <View style={styles.rightActions}>{rightActions}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
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
  rightActions: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ScreenHeader;
