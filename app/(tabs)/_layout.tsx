import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TouchableOpacity, StyleSheet } from "react-native";
import AddOptionsModal from "@/components/modals/AddOptionsModal";
import AddHabitModal from "@/components/modals/AddHabitModal";
import { HabitData } from "@/components/AddHabitModal/types";
import { addHabit } from "@/src/service/apiService";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";

export default function TabsLayout() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isAddHabitModalVisible, setIsAddHabitModalVisible] = useState(false);
  const userId = useSelector(selectUserId);

  const handleAddHabit = () => {
    setIsAddModalVisible(false);
    setIsAddHabitModalVisible(true);
  };

  const handleAddChallenge = () => {
    setIsAddModalVisible(false);
    // TODO: Open new modal for adding challenge
  };

  const handleHabitSubmit = (habit: HabitData) => {
    setIsAddHabitModalVisible(false);
    addHabit(userId, habit);
  };

  return (
    <>
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
                onPress={() => setIsAddModalVisible(true)}
              >
                <Ionicons name="add" size={30} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      </Tabs>

      <AddOptionsModal
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddHabit={handleAddHabit}
        onAddChallenge={handleAddChallenge}
      />

      <AddHabitModal
        isVisible={isAddHabitModalVisible}
        onClose={() => setIsAddHabitModalVisible(false)}
        onSubmit={handleHabitSubmit}
      />
    </>
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
