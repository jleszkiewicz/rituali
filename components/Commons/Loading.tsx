import { View, Text, StyleSheet } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import { SafeAreaView } from "react-native";
import { ActivityIndicator } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
const Loading = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenWrapper>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.PrimaryPink} />
          <Text style={styles.loadingText}>{t("loading")}</Text>
        </View>
      </ScreenWrapper>
    </SafeAreaView>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
    flex: 1,
    marginTop: 10,
  },
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
