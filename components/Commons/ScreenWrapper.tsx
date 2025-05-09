import { StyleSheet, SafeAreaView, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.ButterYellow,
    flex: 1,
  },
  content: {
    flex: 1,
    marginHorizontal: 20,
  },
});
