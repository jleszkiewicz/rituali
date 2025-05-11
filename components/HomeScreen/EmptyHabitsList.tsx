import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../Commons/ThemedText";
import { t } from "@/src/service/translateService";
import { View } from "react-native";
import { StyleSheet } from "react-native";

const EmptyHabitsList = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="list" size={60} color={Colors.PrimaryGray} />
      <ThemedText style={styles.title}>{t("no_habits_title")}</ThemedText>
      <ThemedText style={styles.description}>
        {t("no_recorded_habits")}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "bold",
    color: Colors.PrimaryGray,
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    textAlign: "center",
  },
});
export default EmptyHabitsList;
