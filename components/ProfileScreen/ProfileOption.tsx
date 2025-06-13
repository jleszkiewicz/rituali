import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import { Colors } from "@/constants/Colors";

type ProfileOptionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  shouldShowBottomBorder?: boolean;
};
const ProfileOption = ({
  icon,
  label,
  onPress,
  shouldShowBottomBorder = true,
}: ProfileOptionProps) => (
  <TouchableOpacity
    style={[styles.optionRow, shouldShowBottomBorder && styles.bottomBorder]}
    onPress={onPress}
  >
    <Ionicons
      name={icon}
      size={22}
      color={Colors.PrimaryGray}
      style={{ width: 28 }}
    />
    <ThemedText style={styles.optionLabel}>{label}</ThemedText>
    <Ionicons
      name="chevron-forward"
      size={20}
      color={Colors.PrimaryGray}
      style={{ marginLeft: "auto" }}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  optionsContainer: {
    backgroundColor: Colors.White,
    borderRadius: 16,
    marginHorizontal: 0,
    marginBottom: 24,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  optionLabel: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    marginLeft: 12,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
  },
});

export default ProfileOption;
