import React, { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import AddOptionsModal from "@/components/modals/AddOptionsModal";
import AddHabitModal from "@/components/modals/AddHabitModal";
import AddChallengeModal from "@/components/modals/AddChallengeModal";

export default function TabsLayout() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isAddHabitModalVisible, setIsAddHabitModalVisible] = useState(false);
  const [isAddChallengeModalVisible, setIsAddChallengeModalVisible] =
    useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch("https://www.google.com", {
          method: "HEAD",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (isMounted) {
          setIsConnected(response.ok);
        }
      } catch (error) {
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    checkConnection();
    const intervalId = setInterval(checkConnection, 3000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const handleAddPress = () => {
    if (isConnected) {
      setIsAddModalVisible(true);
    }
  };

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
      <Tabs
        screenOptions={{
          tabBarIconStyle: {
            color: Colors.PrimaryGray,
            marginTop: 10,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.PrimaryGray,
          tabBarInactiveTintColor: Colors.PrimaryGray,
          tabBarStyle: {
            backgroundColor: Colors.White,
            borderTopWidth: 1,
            borderTopColor: Colors.LightGray,
            height: Platform.OS === "ios" ? 85 : 60,
            paddingBottom: Platform.OS === "ios" ? 20 : 10,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={30}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="challenges"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "trophy" : "trophy-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            tabBarButton: () => (
              <TouchableOpacity style={styles.button} onPress={handleAddPress}>
                <Ionicons name="add" size={30} color={Colors.White} />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "bar-chart" : "bar-chart-outline"}
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={color}
                size={28}
              />
            ),
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
    top: -0,
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
