import {
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "../../constants/Colors";

interface PrimaryButtonProps {
  onPress: () => void;
  title?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  disabled?: boolean;
}

const PrimaryButton = ({
  title,
  onPress,
  style,
  children,
  disabled = false,
}: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {children ? (
        children
      ) : (
        <ThemedText
          style={[styles.title, disabled && styles.disabledText]}
          bold
        >
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.ButterYellow,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.HotPink,
  },
  title: {
    color: Colors.HotPink,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: Colors.PrimaryGray,
  },
});

export default PrimaryButton;
