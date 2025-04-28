import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TouchableOpacity, StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              style={styles.button}
              onPress={() => alert("Button clicked")}
            >
              <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 18,
    left: "50%",
    transform: [{ translateX: -30 }],
    backgroundColor: Colors.HotPink,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
