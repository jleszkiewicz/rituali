import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TouchableOpacity, StyleSheet } from "react-native";
import AddOptionsModal from "@/components/modals/AddOptionsModal";
import AddHabitModal from "@/components/modals/AddHabitModal";
import AddChallengeModal from "@/components/modals/AddChallengeModal";

export default function TabsLayout() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isAddHabitModalVisible, setIsAddHabitModalVisible] = useState(false);
  const [isAddChallengeModalVisible, setIsAddChallengeModalVisible] =
    useState(false);

  const handleAddHabit = () => {
    setIsAddModalVisible(false);
    setIsAddHabitModalVisible(true);
  };

  const handleAddChallenge = () => {
    setIsAddModalVisible(false);
    setIsAddChallengeModalVisible(true);
  };

  return (
    <>
      <Tabs>
        <Tabs.Screen
          name="home"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={30}
                color={color}
              />
            ),
            tabBarShowLabel: false,
            tabBarActiveTintColor: Colors.HotPink,
            tabBarInactiveTintColor: Colors.PrimaryGray,
          }}
        />
        <Tabs.Screen
          name="challenges"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "trophy" : "trophy-outline"}
                color={color}
                size={30}
              />
            ),
            tabBarActiveTintColor: Colors.HotPink,
            tabBarInactiveTintColor: Colors.PrimaryGray,
            tabBarShowLabel: false,
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
                <Ionicons name="add" size={30} color={Colors.White} />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "bar-chart" : "bar-chart-outline"}
                color={color}
                size={26}
              />
            ),
            tabBarActiveTintColor: Colors.HotPink,
            tabBarInactiveTintColor: Colors.PrimaryGray,
            tabBarShowLabel: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={color}
                size={28}
              />
            ),
            tabBarActiveTintColor: Colors.HotPink,
            tabBarInactiveTintColor: Colors.PrimaryGray,
            tabBarShowLabel: false,
          }}
        />
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
      />

      <AddChallengeModal
        isVisible={isAddChallengeModalVisible}
        onClose={() => setIsAddChallengeModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: -10,
    left: "50%",
    transform: [{ translateX: -30 }],
    backgroundColor: Colors.HotPink,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
