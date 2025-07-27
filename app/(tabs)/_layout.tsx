import React, { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TouchableOpacity, StyleSheet, Platform, View } from "react-native";
import AddOptionsModal from "@/components/modals/AddOptionsModal";
import AddHabitModal from "@/components/modals/AddHabitModal";
import AddChallengeModal from "@/components/modals/AddChallengeModal";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AppScreens } from "@/src/routes/AppScreens";
import CustomModal from "@/components/Commons/CustomModal";
import { t } from "@/src/service/translateService";
import { useColorScheme } from "react-native";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { BottomTabBar } from "@react-navigation/bottom-tabs";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const userId = useSelector(selectUserId);
  const router = useRouter();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isAddHabitModalVisible, setIsAddHabitModalVisible] = useState(false);
  const [isAddChallengeModalVisible, setIsAddChallengeModalVisible] =
    useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successModalConfig, setSuccessModalConfig] = useState<{
    title: string;
    message: string;
    type: "success" | "error";
    isWithBuddy?: boolean;
    isPartOfChallenge?: boolean;
  }>({
    title: "",
    message: "",
    type: "success",
    isWithBuddy: false,
    isPartOfChallenge: false,
  });

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

  const handleChallengeSuccess = (isWithBuddy: boolean) => {
    setIsAddChallengeModalVisible(false);
    setSuccessModalConfig({
      title: t("success"),
      message: isWithBuddy
        ? t("challenge_created_with_invitations")
        : t("challenge_created"),
      type: "success",
      isWithBuddy,
    });
    setSuccessModalVisible(true);
  };

  const handleHabitSuccess = (isPartOfChallenge: boolean) => {
    setIsAddHabitModalVisible(false);
    setSuccessModalConfig({
      title: t("success"),
      message: isPartOfChallenge
        ? t("habit_added_to_challenge")
        : t("habit_added_successfully"),
      type: "success",
      isPartOfChallenge,
    });
    setSuccessModalVisible(true);
  };

  return (
    <View style={styles.root}>
      <Tabs
        tabBar={(props) => (
          <View style={styles.tab}>
            <BottomTabBar {...props} />
          </View>
        )}
        screenOptions={{
          tabBarIconStyle: {
            color: Colors.PrimaryGray,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.PrimaryGray,
          tabBarInactiveTintColor: Colors.PrimaryGray,
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: Platform.OS === "ios" ? 28 : 12,
            paddingTop: 10,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name={AppScreens.Home}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Octicons
                name="home"
                size={26}
                color={color}
                style={{ opacity: focused ? 1 : 0.6 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={AppScreens.Challenges}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name="trophy-outline"
                size={30}
                color={color}
                style={{ opacity: focused ? 1 : 0.6 }}
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
          name={AppScreens.Friends}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Octicons
                name="people"
                size={30}
                color={color}
                style={{ opacity: focused ? 1 : 0.6 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={AppScreens.Profile}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Octicons
                name="person"
                size={28}
                color={color}
                style={{ opacity: focused ? 1 : 0.6 }}
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
        onSuccess={handleHabitSuccess}
      />

      <AddChallengeModal
        isVisible={isAddChallengeModalVisible}
        onClose={() => setIsAddChallengeModalVisible(false)}
        onSuccess={handleChallengeSuccess}
      />

      <CustomModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title={successModalConfig.title}
        message={successModalConfig.message}
        type={successModalConfig.type}
        isWithBuddy={successModalConfig.isWithBuddy}
        isPartOfChallenge={successModalConfig.isPartOfChallenge}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: "relative",
  },
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
  tab: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 16,
    borderRadius: 24,
    elevation: 2,
    borderWidth: 0.2,
    borderColor: Colors.LightGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    backgroundColor: Colors.OffWhite,
    height: 61,
    justifyContent: "center",
  },
});
