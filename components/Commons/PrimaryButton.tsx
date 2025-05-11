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
}

const PrimaryButton = ({
  title,
  onPress,
  style,
  children,
}: PrimaryButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {children ? (
        children
      ) : (
        <ThemedText style={styles.title} bold>
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
});

export default PrimaryButton;
