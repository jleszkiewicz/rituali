import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../Commons/ThemedText";

const RecommendedChallenge = () => {
  const zasady = [
    "Zrób 30 przysiadów dziennie",
    "Zrób 30 przysiadów dziennie",
    "Zrób 30 przysiadów dziennie",
    "Zrób 30 przysiadów dziennie",
    "Zrób 30 przysiadów dziennie",
  ];
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Recommended Challenge</ThemedText>
      <ThemedText style={styles.duration}>{"30 dni"}</ThemedText>
      <View style={styles.rulesContainer}>
        {zasady.map((zasada) => (
          <ThemedText style={styles.rule}>{`• ${zasada}`}</ThemedText>
        ))}
      </View>
      <TouchableOpacity style={styles.buttonContainer}>
        <ThemedText style={styles.buttonText}>Start</ThemedText>
        <Ionicons name="arrow-forward" size={24} color={Colors.White} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.White,
  },
  duration: {
    fontSize: 16,
    color: Colors.White,
    marginVertical: 10,
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
    borderWidth: 1,
    borderColor: Colors.White,
    borderRadius: 10,
    padding: 10,
    alignSelf: "flex-end",
  },
  buttonText: {
    fontSize: 16,
    color: Colors.White,
    fontWeight: "bold",
  },
});

export default RecommendedChallenge;
