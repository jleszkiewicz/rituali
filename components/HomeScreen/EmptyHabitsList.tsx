import { Colors } from "@/constants/Colors";
import { View, Text, StyleSheet } from "react-native";

const EmptyHabitsList = () => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>{"Brak dodanych nawyków."}</Text>
        <Text style={styles.description}>
          {"Dodaj nawyk, aby rozpocząć śledzenie."}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "60%",
  },
  text: {
    color: Colors.PrimaryGray,
    fontSize: 20,
    marginBottom: 16,
  },
  description: {
    color: Colors.PrimaryGray,
    fontSize: 16,
  },
});

export default EmptyHabitsList;
