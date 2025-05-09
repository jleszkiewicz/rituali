import { Colors } from "@/constants/Colors";
import { View, Text, StyleSheet } from "react-native";

const ScreenHeader = ({ title }: { title: string }) => {
  return (
    <View>
      <Text style={styles.header}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 18,
    color: Colors.PrimaryGray,
    fontFamily: "Poppins-Bold",
  },
});

export default ScreenHeader;
