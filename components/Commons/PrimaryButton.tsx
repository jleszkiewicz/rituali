import {
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "../../constants/Colors";

interface PrimaryButtonProps {
  onPress: () => void;
  title?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  disabled?: boolean;
  rightIcon?: React.ReactNode;
}

const PrimaryButton = ({
  title,
  onPress,
  style,
  children,
  disabled = false,
  rightIcon,
}: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.content}>
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
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.HotPink,
    padding: 10,
    borderRadius: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: Colors.White,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: Colors.PrimaryGray,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default PrimaryButton;
