import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../Commons/ThemedText";
import { LinearGradient } from "expo-linear-gradient";

const RecommendedChallenge = () => {
  const zasady = [
    "Zrób 30 przysiadów dziennie",
    "Zrób 30 przysiadów dziennie",
    "Zrób 30 przysiadów dziennie",
    "Zrób 30 przysiadów dziennie",
    "Zrób 30 przysiadów dziennie",
  ];
  return (
    <LinearGradient
      colors={[Colors.PrimaryGray, Colors.PrimaryGray]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <ThemedText style={styles.title}>Recommended Challenge</ThemedText>
        <View style={styles.durationContainer}>
          <ThemedText style={styles.duration} bold>
            {"30"}
          </ThemedText>
          <ThemedText style={styles.durationDays}>{"dni"}</ThemedText>
        </View>
      </View>
      <View style={styles.rulesContainer}>
        {zasady.map((zasada) => (
          <ThemedText style={styles.rule}>{`• ${zasada}`}</ThemedText>
        ))}
      </View>
      <TouchableOpacity style={styles.buttonContainer}>
        <ThemedText style={styles.buttonText}>Start</ThemedText>
        <Ionicons name="arrow-forward" size={24} color={Colors.HotPink} />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "bold",
    color: Colors.HotPink,
  },
  duration: {
    fontSize: 26,
    color: Colors.White,
    lineHeight: 30,
  },
  rulesContainer: {
    marginTop: 10,
  },
  rule: {
    fontSize: 14,
    color: Colors.White,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.ButterYellow,
    borderRadius: 10,
    padding: 10,
    alignSelf: "flex-end",
  },
  buttonText: {
    fontSize: 16,
    color: Colors.HotPink,
    fontWeight: "bold",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationDays: {
    fontSize: 16,
    color: Colors.White,
  },
  durationContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default RecommendedChallenge;
